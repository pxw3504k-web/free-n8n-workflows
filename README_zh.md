# 🚀 Free n8n Workflows Collection

<div align="center">

[English](./README.md) | [简体中文](./README_zh.md) | [日本語](./README_ja.md) | [Español](./README_es.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpxw3504k-web%2Ffree-n8n-workflows)
[![GitHub stars](https://img.shields.io/github/stars/pxw3504k-web/free-n8n-workflows?style=social)](https://github.com/pxw3504k-web/free-n8n-workflows)
[![Twitter Follow](https://img.shields.io/twitter/follow/zoAoo6667168456?style=social)](https://x.com/zoAoo6667168456)

**全网最大的 n8n 验证工作流开源合集。**
<br/>
*停止重复造轮子。复制、粘贴、开始自动化。*

[浏览工作流](https://n8nworkflows.world) · [反馈 Bug](https://github.com/pxw3504k-web/free-n8n-workflows/issues) · [功能建议](https://github.com/pxw3504k-web/free-n8n-workflows/issues)

</div>

---

### 📖 故事：为什么要开源？(The Story)

这个项目最初是一个在线的 n8n 模板搜索引擎（[n8nworkflows.world](https://n8nworkflows.world)）。

然而，就在上周，我们的数据库遭到了大规模的爬虫攻击（主要来自兰州的数据中心）。这些机器人不是在浏览网页，而是在系统性地抓取数据，短短几天内产生了 **31GB 的出站流量 (Egress Traffic)**，导致服务器维护成本变得不可持续。

既然大家这么想要这些数据，我决定不再对抗，而是彻底开源。

作为独立开发者，我认为自动化技术应该对所有人开放。现在，我将这 **8,000+ 个已验证的工作流数据** 全部开放下载。没有付费墙，没有服务器限制，没有 API 账单。

如果你觉得这个项目对你有帮助，请给这个仓库点一个 Star ⭐️，这是对我最大的支持！

<img width="2880" height="3986" alt="image" src="https://github.com/user-attachments/assets/d5bc24de-d4c2-4656-bddf-0a076914ee66" />

---

### 🎁 支持开发者 (Support the Developer)

维护这个开源项目是我的业余爱好。如果你想支持我的工作（或者保护你自己的数字生活），请看看我正在开发的两个新 App。它们是我能持续为社区“用爱发电”的动力。

#### 1. 🆘 LifelineSOS：家人守护 (Family Locator)
**隐私优先的 Life360 替代品。** 我受够了那些贩卖用户数据的定位软件。

- **功能**：实时且私密的家人位置共享。
- **亮点**：没有广告，不卖数据。紧急情况下一键 SOS 求救。
- **状态**：即将发布内测。  
👉 [立刻免费下载](https://play.google.com/store/apps/details?id=com.lifeline.sos)

#### 2. 🕵️‍♂️ 酒店防偷拍神器 (Hidden Camera Detector)
**差旅人士必备的安全工具。**

- **功能**：利用手机磁传感器和网络扫描技术，检测酒店/Airbnb 房间内的隐藏摄像头。
- **亮点**：保护你的隐私不被侵犯。
- **状态**：开发中。  
👉 [关注我的 Twitter 了解更多](https://x.com/zoAoo6667168456)

---

### ✨ 核心功能 (Features)

- 🚀 **海量数据库**：收录了 8,000+ 个已验证的工作流，涵盖营销、DevOps、销售和 AI 自动化场景。
- 🔍 **智能搜索**：代码中包含了完整的 Next.js 搜索引擎源码，支持按“角色”或“集成应用”筛选。
- 📦 **JSON 直读**：提供原始 JSON 文件下载，直接导入 n8n 即可使用。
- ⚡ **现代技术栈**：基于 Next.js 14, Tailwind CSS 和 Supabase 构建。
- 🛡️ **支持自部署**：数据在你手中。你可以将此项目部署在自己的 Vercel 或服务器上。

---

### 📂 数据获取 (Data Access)

如果你不想运行网站，只是单纯想要数据，我们已经为你准备好了：

- **完整 JSON 数据**：请查看目录 `/data/workflows.json`
- **SQL 数据库结构**：请查看目录 `/data/schema.sql` (适用于 PostgreSQL/Supabase)

---

### 🛠️ 安装与自部署 (Installation)

你可以通过以下两种方式运行你自己的 n8n 搜索站。

#### 方法 1：使用 Vercel 一键部署 (推荐)

1. Fork 本仓库。
2. 在 Supabase 创建一个新项目，并运行 `/data/schema.sql` 建立表结构。
3. 在 Vercel 中导入你 Fork 的仓库，配置好 Supabase 的环境变量 (`NEXT_PUBLIC_SUPABASE_URL` 等)。
4. 点击部署，即可拥有你自己的搜索站。

#### 方法 2：本地开发 (Local Development)

```bash
# 1. 克隆仓库
git clone https://github.com/pxw3504k-web/free-n8n-workflows.git
cd free-n8n-workflows

# 2. 安装依赖
npm install

# 3. 配置环境
# 将 .env.example 重命名为 .env.local 并填入你的 Supabase
# 如果是纯静态浏览，可跳过数据库配置

# 4. 运行
npm run dev
```
打开浏览器访问 `http://localhost:3000` 即可看到效果。

---

### 🤝 贡献 (Contributing)

开源社区之所以美好，是因为有像你这样的人。任何形式的贡献（无论是提交新的 Workflow，还是修复 Bug）都深受得欢迎。

1. Fork 本项目  
2. 创建你的分支 (`git checkout -b feature/NewFeature`)  
3. 提交修改 (`git commit -m 'Add some NewFeature'`)  
4. 推送到分支 (`git push origin feature/NewFeature`)  
5. 提交 Pull Request

---

### 📄 许可证 (License)

本项目基于 **MIT 许可证** 分发。详情请参阅 [LICENSE](LICENSE) 文件。

---

关注我的 Twitter [@zoAoo6667168456](https://x.com/zoAoo6667168456) 以获取更多独立开发和自动化工具的更新。
