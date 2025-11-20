# R2 Spatial Drive (R2 空间云盘)

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-orange)

一个基于 **Cloudflare Pages + R2** 构建的现代化轻量级图床与文件管理系统。

本项目采用了极具未来感的 **iOS 26 概念设计**（空间计算 / 流体玻璃风格），支持无缝的 **深色/浅色模式切换**，以及沉浸式的 **动态视频/图片背景**。

---

## ✨ 功能特性

### 🎨 极致 UI 设计
*   **空间美学**：采用高斯模糊、内发光和物理动效曲线，模拟高级玻璃材质与悬浮感。
*   **自适应主题**：内置 Light/Dark 模式，一键切换，自动记忆。
*   **动态背景**：智能识别环境变量，支持 **直链图片** 或 **MP4 视频** 作为背景，暗黑模式下自动适配遮罩。
*   **Logo 集成**：界面优雅集成自定义 Logo。

### 🔒 安全与管理
*   **中间件鉴权**：基于 Cloudflare Pages Functions 中间件 (`_middleware.js`) 的密码保护。
*   **状态保持**：Cookie 持久化登录状态，无需频繁输入密码。
*   **文件操作**：
    *   支持文件夹层级浏览。
    *   多文件批量上传。
    *   一键复制文件直链。
    *   文件预览与永久删除。

### ⚡️ 架构优势
*   **Serverless**：完全运行在 Cloudflare Edge 网络，无服务器维护成本。
*   **低延迟**：利用 R2 存储与 Cloudflare 全球 CDN 加速。

---

## 🛠 目录结构

```text
.
├── index.html                # 前端主入口 (包含所有 UI、动效和交互逻辑)
└── functions/
    ├── _middleware.js        # 核心中间件：处理身份验证 & 环境变量注入
    └── api/                  # 后端 API 逻辑
        ├── list.js           # [需实现] 列出 R2 文件
        ├── upload.js         # [需实现] 上传文件到 R2
        └── delete.js         # [需实现] 删除 R2 文件
