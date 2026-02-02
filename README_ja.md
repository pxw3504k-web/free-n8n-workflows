# 無料 n8n ワークフローコレクション

<div align="center">

[English](./README.md) | [简体中文](./README_zh.md) | [日本語](./README_ja.md) | [Español](./README_es.md)

</div>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpwj19960112%2Ffree-n8n-workflows)
[![GitHub stars](https://img.shields.io/github/stars/pwj19960112/free-n8n-workflows?style=social)](https://github.com/pwj19960112/free-n8n-workflows)

🚀 **1000+ 検証済み n8n 自動化ワークフロー** - オープンソース & 無料ダウンロード。

ゼロから構築するのはやめましょう。マーケティング、セールス、オペレーション、AI自動化のための、本番環境ですぐに使えるn8nワークフローを発見、検索、デプロイできます。

## 📱 モバイルアプリ

**生産性ツールでさらなる可能性を解き放ちましょう：**

### [App Name 1] - [一言での価値提案]

コードをスキャンまたはクリックしてダウンロード：

![App 1 QR Code](https://placehold.co/200x200?text=App+1+QR)

[App Store / Google Play でダウンロード](#)

### [App Name 2] - [一言での価値提案]

コードをスキャンまたはクリックしてダウンロード：

![App 2 QR Code](https://placehold.co/200x200?text=App+2+QR)

[App Store / Google Play でダウンロード](#)

---

## 特徴

- 🔍 **検索 & フィルタリング**：カテゴリ、統合、キーワードでワークフローを閲覧。
- 📦 **ワンクリックダウンロード**：検証済みのJSONテンプレートを即座に入手。
- 🌐 **多言語サポート**：英語と中国語のローカライズに対応。
- ⚡ **高性能**：Next.js 14 と Supabase で構築され、高速に動作します。
- 🎨 **モダンなUI**：ダークモード対応のクリーンでレスポンシブなインターフェース。

## データ & バックアップ

元のサイトがダウンした場合でも利用できるように、ワークフローの完全なデータベースがこのリポジトリに含まれています。

- **JSON 形式**：[`data/workflows.json`](./data/workflows.json) - すべてのワークフローの完全なエクスポート。
- **SQL スキーマ**：[`data/schema.sql`](./data/schema.sql) - セルフホスティング用のデータベース構造。

## セルフホスティング方法 (How to Self-Host)

Vercel または Docker を使用して、このプロジェクトを自分でデプロイできます。

### オプション 1：Vercel（推奨）& Supabase

1. **このリポジトリをフォークする**。
2. **Supabase プロジェクトを作成する**：
   - [Supabase](https://supabase.com) にアクセスして新しいプロジェクトを作成します。
   - Supabase SQL エディタで [`data/schema.sql`](./data/schema.sql) の SQL を実行します。
   - [`data/workflows.json`](./data/workflows.json) からデータをインポートします（JSON を `workflows` テーブルに挿入するための簡単なスクリプトが必要になる場合があります）。
3. **Vercel にデプロイする**：
   - 上記の "Deploy with Vercel" ボタンをクリックするか、Vercel でフォークしたリポジトリをインポートします。
   - 環境変数を設定します：
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     NEXT_PUBLIC_SITE_URL=https://your-domain.com
     ```

### オプション 2：Docker（ローカル / VPS）

1. **リポジトリをクローンする**：

   ```bash
   git clone https://github.com/yourusername/free-n8n-workflows.git
   cd free-n8n-workflows
   ```

2. **環境設定**：

   ```bash
   cp env.example .env.local
   # .env.local を編集して Supabase の認証情報を入力
   ```

3. **Docker で実行する**：

   ```bash
   docker build -t n8n-workflows .
   docker run -p 3000:3000 n8n-workflows
   ```

4. **データベースのセットアップ**：
   Postgres データベース（またはローカルの Supabase インスタンス）が必要です。
   - `data/schema.sql` を使用してデータベースを初期化します。
   - `data/workflows.json` からデータをロードします。

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの実行
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## ライセンス (License)

MIT License. ニーズに合わせて自由に使用、変更してください。
