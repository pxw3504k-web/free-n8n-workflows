# 免费 n8n 工作流集合

<div align="center">

[English](./README.md) | [简体中文](./README_zh.md) | [日本語](./README_ja.md) | [Español](./README_es.md)

</div>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpwj19960112%2Ffree-n8n-workflows)
[![GitHub stars](https://img.shields.io/github/stars/pwj19960112/free-n8n-workflows?style=social)](https://github.com/pwj19960112/free-n8n-workflows)

🚀 **8000+ 已验证的 n8n 自动化工作流** - 开源且免费下载。

无需从零开始构建。发现、搜索并部署用于营销、销售、运营和 AI 自动化的生产级 n8n 工作流。
<img width="2880" height="3986" alt="image" src="https://github.com/user-attachments/assets/d5bc24de-d4c2-4656-bddf-0a076914ee66" />


## 功能特性

- 🔍 **搜索与过滤**：按类别、集成或关键词浏览工作流。
- 📦 **一键下载**：即时获取已验证的 JSON 模板。
- 🌐 **多语言支持**：支持英语和中文本地化。
- ⚡ **高性能**：基于 Next.js 14 和 Supabase 构建，速度极快。
- 🎨 **现代 UI**：整洁、响应式的界面，支持深色模式。

## 数据与备份

本仓库包含完整的工作流数据库，确保即使原网站无法访问，数据依然可用。

- **JSON 格式**：[`data/workflows.json`](./data/workflows.json) - 所有工作流的完整导出。
- **SQL Schema**：[`data/schema.sql`](./data/schema.sql) - 用于自托管的数据库结构。

## 如何自托管 (Self-Host)

你可以使用 Vercel 或 Docker 自行部署本项目。

### 选项 1：Vercel（推荐）& Supabase

1. **Fork 本仓库**。
2. **创建一个 Supabase 项目**：
   - 前往 [Supabase](https://supabase.com) 创建新项目。
   - 在 Supabase SQL 编辑器中运行 [`data/schema.sql`](./data/schema.sql) 中的 SQL。
   - 导入 [`data/workflows.json`](./data/workflows.json) 中的数据（你可能需要编写一个简单的脚本将 JSON 插入到 `workflows` 表中）。
3. **部署到 Vercel**：
   - 点击上方的 "Deploy with Vercel" 按钮，或在 Vercel 中导入你 fork 的仓库。
   - 设置环境变量：
     ```
     NEXT_PUBLIC_SUPABASE_URL=你的项目URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon key
     NEXT_PUBLIC_SITE_URL=https://your-domain.com
     ```

### 选项 2：Docker（本地 / VPS）

1. **克隆仓库**：

   ```bash
   git clone https://github.com/yourusername/free-n8n-workflows.git
   cd free-n8n-workflows
   ```

2. **设置环境**：

   ```bash
   cp env.example .env.local
   # 编辑 .env.local 填入你的 Supabase 凭证
   ```

3. **使用 Docker 运行**：

   ```bash
   docker build -t n8n-workflows .
   docker run -p 3000:3000 n8n-workflows
   ```

4. **数据库设置**：
   你需要一个 Postgres 数据库（或本地 Supabase 实例）。
   - 使用 `data/schema.sql` 初始化数据库。
   - 从 `data/workflows.json` 加载数据。

## 开发

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 许可证 (License)

MIT License. 欢迎随意使用和修改以满足你的需求。
