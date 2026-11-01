import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const artifacts = 'artifacts';

async function expectNoOverflow(page: import('@playwright/test').Page) {
  const sizes = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }));
  expect(sizes.content, `页面横向溢出：${sizes.content} > ${sizes.viewport}`).toBeLessThanOrEqual(sizes.viewport);
}

test.beforeAll(async () => {
  await mkdir(artifacts, { recursive: true });
});

test('桌面端完整阅读、记录、导出与清空流程', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/星火日签/);
  await expect(page.getByRole('heading', { name: /今天，/ })).toBeVisible();
  await expectNoOverflow(page);
  await page.screenshot({ path: `${artifacts}/home-desktop.png`, fullPage: true });

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '跳到主要内容' })).toBeFocused();
  await page.locator('.reveal-button').click();
  await expect(page.getByRole('heading', { name: '写下一点思考' })).toBeVisible();
  const thought = page.getByRole('textbox', { name: '今天的思考' });
  await thought.fill('先了解事实，再决定今天的下一步。');
  await page.reload();
  await expect(thought).toHaveValue('先了解事实，再决定今天的下一步。');
  await page.getByRole('button', { name: '保存思考' }).click();
  await expect(page.getByText('思考已保存在本机')).toBeVisible();
  await page.reload();
  await expect(thought).toHaveValue('先了解事实，再决定今天的下一步。');
  await page.screenshot({ path: `${artifacts}/revealed-desktop.png`, fullPage: true });

  await page.locator('.desktop-nav').getByRole('button', { name: '自由抽取' }).click();
  const quote = page.locator('.free-draw blockquote');
  const before = await quote.textContent();
  await page.getByRole('button', { name: '再抽一张' }).click();
  await expect(quote).not.toHaveText(before || '');
  await expectNoOverflow(page);

  await page.locator('.desktop-nav').getByRole('button', { name: '我的记录' }).click();
  await expect(page.getByText('共 1 条')).toBeVisible();
  await page.getByRole('button', { name: /编辑 .* 的思考/ }).click();
  const editor = page.getByRole('textbox', { name: /编辑 .* 的思考/ });
  await editor.fill('修改后的思考：用行动检验认识。');
  await page.getByRole('button', { name: '保存修改' }).click();
  await expect(page.getByText('修改后的思考：用行动检验认识。')).toBeVisible();

  const markdownDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出 Markdown' }).click();
  expect((await markdownDownload).suggestedFilename()).toMatch(/星火日签-.*\.md$/);
  const jsonDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出 JSON' }).click();
  expect((await jsonDownload).suggestedFilename()).toMatch(/星火日签-.*\.json$/);

  await page.getByRole('button', { name: /删除 .* 的记录/ }).click();
  await expect(page.getByText('第一条记录，从今天的一段话开始')).toBeVisible();
  await page.getByRole('button', { name: '撤销' }).click();
  await expect(page.getByText('共 1 条')).toBeVisible();
  await page.getByRole('button', { name: '清空本机记录' }).click();
  await page.getByRole('button', { name: '保留记录' }).click();
  await expect(page.getByText('共 1 条')).toBeVisible();
  await page.getByRole('button', { name: '清空本机记录' }).click();
  await page.getByRole('button', { name: '清空全部记录' }).click();
  await expect(page.getByText('共 0 条')).toBeVisible();
  await expect(page.getByRole('button', { name: '导出 Markdown' })).toBeDisabled();
  expect(errors).toEqual([]);
});

test('手机端抽卡与长语录均无横向溢出', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.mobile-nav')).toBeVisible();
  await expectNoOverflow(page);
  await page.screenshot({ path: `${artifacts}/home-mobile.png`, fullPage: true });
  await page.locator('.reveal-button').click();
  await expect(page.getByRole('heading', { name: '写下一点思考' })).toBeVisible();
  await expectNoOverflow(page);
  await page.screenshot({ path: `${artifacts}/revealed-mobile.png`, fullPage: true });
});

test('手机端长语录保持完整且布局稳定', async ({ browser }) => {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const timestamp = now.toISOString();
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 390, height: 844 },
    storageState: {
      cookies: [],
      origins: [{
        origin: 'http://127.0.0.1:4173',
        localStorage: [{
          name: 'xinghuo:records:v1',
          value: JSON.stringify({ [date]: { date, quoteId: 'investigation-07', thought: '长语录布局测试', revealedAt: timestamp, updatedAt: timestamp } }),
        }],
      }],
    },
  });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('textbox', { name: '今天的思考' })).toHaveValue('长语录布局测试');
  await expect(page.locator('blockquote')).toContainText('共产党的正确而不动摇的斗争策略');
  await expectNoOverflow(page);
  await page.screenshot({ path: `${artifacts}/long-quote-mobile.png`, fullPage: true });
  await context.close();
});
