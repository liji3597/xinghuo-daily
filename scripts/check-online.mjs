import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const url = process.argv[2];
if (!url) throw new Error('请提供要验收的公开地址');
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto(url, { waitUntil: 'networkidle' });
  if (!response?.ok()) throw new Error(`公开页面响应异常：${response?.status()}`);
  await page.locator('.reveal-button').click();
  await page.getByRole('textbox', { name: '今天的思考' }).fill('线上验收记录');
  await page.getByRole('button', { name: '保存思考' }).click();
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('textbox', { name: '今天的思考' }).waitFor();
  const value = await page.getByRole('textbox', { name: '今天的思考' }).inputValue();
  if (value !== '线上验收记录') throw new Error('线上本地记录刷新后未保留');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (overflow) throw new Error('线上手机页面存在横向溢出');
  if (errors.length) throw new Error(`线上浏览器错误：${errors.join('; ')}`);
  await page.screenshot({ path: 'artifacts/online-mobile.png', fullPage: true });
  console.log(JSON.stringify({ url, status: response.status(), persistence: true, overflow: false, browserErrors: errors.length }));
} finally {
  await browser.close();
}
