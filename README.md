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

🚀 部署指南
本项目专为 Cloudflare Pages 设计，请按照以下步骤部署。
1. 准备工作
一个 Cloudflare 账号。
创建一个 R2 存储桶 (Bucket)。
（可选）配置 R2 的自定义域名（Custom Domain）以获得更短的文件链接。
2. 创建 Pages 项目
登录 Cloudflare Dashboard，进入 Workers & Pages。
点击 Create Application -> Pages。
选择 Connect to Git (推荐) 或直接上传项目文件夹。
3. 绑定 R2 存储桶
在 Pages 项目设置中：
进入 Settings -> Functions。
找到 R2 Bucket Bindings 部分。
点击 Add Binding：
Variable name: R2 (后端 API 需使用此名称调用存储桶)
R2 Bucket: 选择你创建的存储桶。
4. 设置环境变量 (关键)
在 Pages 项目设置中，进入 Settings -> Environment variables，添加以下变量：
变量名	必填	说明	示例
PASSWORD	✅	访问控制台的密码	MySecretPass123
BACKGROUND_IMAGE	❌	背景直链，支持图片或 MP4 视频	https://example.com/bg.mp4
R2_CUSTOM_DOMAIN	❌	R2 的公开访问域名	https://cdn.yourdomain.com
5. 部署更新
保存所有设置后，进入 Deployments 页面，点击 Create deployment (或推送到 Git) 以重新构建项目，使环境变量生效。
🎨 自定义背景说明
系统通过检测 BACKGROUND_IMAGE 环境变量的后缀名来决定渲染方式：
视频背景 (推荐)：
填入以 .mp4, .webm, .mov 结尾的直链。
系统会自动静音、循环播放。
建议：使用压缩过的 720P 视频，体积控制在 5MB 以内体验最佳。
图片背景：
填入图片直链（JPG, PNG, WebP）。
默认背景：
如果不设置该变量，系统将显示默认的极光流体渐变背景。
🔧 后端 API 开发提示
本项目前端已经写好，你需要确保 functions/api/ 目录下有对应的 API 处理逻辑。以下是前端预期的接口定义：
GET /api/list?prefix=xxx
功能：获取文件列表。
返回：JSON 格式 { folders: ["path/"], files: [{name, key, url}, ...] }。
POST /api/upload
功能：上传文件。
入参：FormData (file, path)。
返回：JSON 格式 { success: true }。
DELETE /api/delete
功能：删除文件。
入参：JSON { key: "filename" }。
返回：JSON 格式 { success: true }。
