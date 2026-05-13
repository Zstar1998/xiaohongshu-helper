# 小红书营销助手 - Vercel 部署版

## 文件说明

这个版本是专门为 **Vercel 部署** 准备的，已修复 API 路径问题。

## 文件结构

```
xiaohongshu-vercel/
├── index.html          ← 主页面（API 路径已改为 /api/...）
├── api/
│   ├── generate-image.js   ← Vercel Serverless Function
│   └── task-status.js     ← Vercel Serverless Function
├── vercel.json         ← Vercel 配置文件
├── icons/              ← PWA 图标（可选）
├── manifest.json       ← PWA 配置（可选）
└── sw.js              ← Service Worker（可选）
```

## 部署步骤

### 1. 上传到 GitHub
1. 访问 https://github.com/Zstar1998/xiaohongshu-helper
2. 点击 "Add file" → "Upload files"
3. 上传这个 ZIP 里的所有文件（覆盖现有文件）
4. 点击 "Commit changes"

### 2. 部署到 Vercel
1. 访问 https://vercel.com/
2. 登录（可以用 GitHub 账号登录）
3. "Add New..." → "Project"
4. 选择 GitHub 仓库 `xiaohongshu-helper`
5. 配置：
   - **Framework Preset:** 选择 `Other`
   - **Build Command:** 输入 `echo "skip"`
   - **Output Directory:** 输入 `.`
6. 点击 **"Deploy"**

等待 1-2 分钟，部署完成！

## 获取 API Key

### DeepSeek API（文案生成）
访问：https://platform.deepseek.com/

### 通义千问 API（AI 绘图）
访问：https://dashscope.aliyun.com/

## 测试

部署成功后：
1. 访问你的 Vercel 网址（格式：`https://xxx.vercel.app`）
2. 进入 "设置" Tab，输入 API Key
3. 进入 "AI 绘图" Tab，测试生成图片

**AI 绘图应该 100% 可用！**

## 技术说明

- ✅ 使用 Vercel Serverless Functions（`/api/` 路径）
- ✅ 完全绕过 CORS 限制
- ✅ 支持通义千问异步图像生成
- ✅ 自动轮询任务状态（最多 2 分钟）

## 常见问题

**Q: 部署后 AI 绘图不工作？**
A: 检查 Vercel 后台 → Deployments → View Function Logs

**Q: 文案生成失败？**
A: 确认 DeepSeek API Key 正确且有余额

**Q: 可以用 Netlify 部署这个版本吗？**
A: 不可以！这个版本是 Vercel 专用（API 路径是 `/api/...`）。如需 Netlify，需要用 `netlify-deploy-final` 文件夹里的版本。
