# 星火日签

每天从《毛泽东选集》中读一段话，了解出处，也写下一点自己的思考。网站采用纸签翻卡形式，不做吉凶或运势解读。

## 功能

- 100 条精选语录，标注卷次、篇名、写作时间与原文来源
- 每日一签：同一天保持同一条语录
- 自由抽取：独立随机阅读，不改变每日一签
- 思考记录：草稿自动保存，支持编辑、删除与撤销
- 本地隐私：无需账号，数据只保存在当前浏览器 localStorage
- 数据备份：导出 Markdown 或 JSON
- 响应式布局、键盘导航与减少动态效果支持

“今日提示”和“原文语境”是编辑导读，不属于语录原文。

## 本地开发

需要 Node.js 22 或更新版本。

```bash
npm install
npm run dev
```

## 测试与构建

```bash
npm test
npm run test:e2e
npm run build
```

端到端测试使用本机 Chrome；也可先执行 `npx playwright install chromium`，并移除 `playwright.config.ts` 中的 `channel: 'chrome'`。

生产文件输出到 `dist/`。这是纯静态网站，不需要后端或数据库。

## 部署

### 静态托管

将仓库导入 Vercel、Netlify 或 Cloudflare Pages：

- 构建命令：`npm run build`
- 输出目录：`dist`
- 安装命令：`npm install`

### 自有服务器

执行 `npm ci && npm run build`，把 `dist/` 内的全部文件上传到网站根目录，由 Nginx、Caddy 或其他静态 Web 服务器托管即可。页面导航使用 URL hash，不需要额外的 SPA 回退规则。

## 内容维护

- 原有语录：`src/data/quotes.ts`
- 扩充语录：`src/data/additional-quotes.ts`
- 抽签与日期：`src/lib/date.ts`
- 阅读记录与导出：`src/lib/records.ts`

新增语录时请保留唯一 ID、准确出处、来源链接和编辑导读，并运行全部测试。
