# 🚀 Free n8n Workflows Collection

<div align="center">

[English](./README.md) | [简体中文](./README_zh.md) | [日本語](./README_ja.md) | [Español](./README_es.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpxw3504k-web%2Ffree-n8n-workflows)
[![GitHub stars](https://img.shields.io/github/stars/pxw3504k-web/free-n8n-workflows?style=social)](https://github.com/pxw3504k-web/free-n8n-workflows)
[![Twitter Follow](https://img.shields.io/twitter/follow/zoAoo6667168456?style=social)](https://x.com/zoAoo6667168456)

**最大級のオープンソース n8n 検証済みワークフローコレクション。**
<br/>
*車輪の再発明はやめましょう。コピー、ペースト、そして自動化へ。*

[ワークフローを探索](https://n8nworkflows.world) · [バグ報告](https://github.com/pxw3504k-web/free-n8n-workflows/issues) · [機能リクエスト](https://github.com/pxw3504k-web/free-n8n-workflows/issues)

</div>

---

### 📖 ストーリー：なぜオープンソース化したのか？ (The Story)

このプロジェクトは当初、オンラインの n8n テンプレート検索エンジン（[n8nworkflows.world](https://n8nworkflows.world)）としてスタートしました。

しかし先週、私たちのデータベースは大規模なスクレイピング攻撃（主に蘭州のデータセンターから）に見舞われました。これらのボットはWebページを閲覧するだけでなく、組織的にデータを抜き取り、わずか数日で **31GB の送信トラフィック (Egress Traffic)** を発生させました。その結果、サーバーの維持コストを持続不可能なものにしてしまいました。

データがこれほど求められているのなら、対抗するのをやめ、完全にオープンソース化することを決意しました。

個人開発者として、自動化技術はすべての人が利用できるべきだと信じています。現在、これら **8,000以上の検証済みワークフロー** をダウンロード可能にしました。ペイウォールなし、サーバー制限なし、API請求もありません。

このプロジェクトが役に立った場合は、ぜひこのリポジトリに Star ⭐️ を付けてください。私にとって最大の励みになります！

<img width="2880" height="3986" alt="image" src="https://github.com/user-attachments/assets/d5bc24de-d4c2-4656-bddf-0a076914ee66" />

---

### 🎁 開発者を支援 (Support the Developer)

このオープンソースプロジェクトの維持は趣味で行っています。もし私の活動を支援したい（あるいはあなた自身のデジタルライフを守りたい）と思っていただけるなら、私が開発中の2つの新しいアプリをチェックしてください。これらは私がコミュニティに貢献し続けるための原動力となっています。

#### 1. 🆘 LifelineSOS：家族の安全を守る (Family Locator)
**プライバシー重視の Life360 代替アプリ。** ユーザーデータを販売する位置情報アプリにはうんざりしていました。

- **機能**：リアルタイムかつプライベートな家族間の位置情報共有。
- **ハイライト**：広告なし、データ販売なし。緊急時のワンタップ SOS 通知。
- **ステータス**：クローズドベータ版をまもなく公開。
👉 [フォームに記入してベータ版アクセス権を取得](https://forms.gle/AovsjCCybzuamHEo9)

#### 2. 🕵️‍♂️ 盗撮カメラ発見機 (Hidden Camera Detector)
**旅行者のための必須セキュリティツール。**

- **機能**：スマホの磁気センサーとネットワークスキャンを利用して、ホテルや Airbnb の部屋にある隠しカメラを検出します。
- **ハイライト**：盗撮の脅威からプライバシーを守ります。
- **ステータス**：開発中。
👉 [Twitter をフォローして詳細をチェック](https://x.com/zoAoo6667168456)

---

### ✨ 主な機能 (Features)

- 🚀 **膨大なデータベース**：マーケティング、DevOps、セールス、AI自動化シナリオをカバーする、8,000以上の検証済みワークフローを収録。
- 🔍 **スマート検索**：Next.js 製の検索エンジンソースコードを完全収録。「役割」や「連携アプリ」によるフィルタリングをサポート。
- 📦 **JSON 直接ダウンロード**：生の JSON ファイルダウンロードを提供。n8n に直接インポートしてすぐに使用可能。
- ⚡ **最新の技術スタック**：Next.js 14、Tailwind CSS、Supabase で構築。
- 🛡️ **セルフホスト対応**：データはあなたの手に。このプロジェクトは、あなた自身の Vercel やサーバーにデプロイ可能です。

---

### 📂 データへのアクセス (Data Access)

Webサイトを運用せず、データだけが必要な場合も準備は万全です：

- **完全な JSON データ**：ディレクトリ `/data/workflows.json` をご確認ください。
- **SQL データベース構造**：ディレクトリ `/data/schema.sql` をご確認ください（PostgreSQL/Supabase 用）。

---

### 🛠️ インストールとセルフホスト (Installation)

以下の2つの方法で、あなた自身の n8n 検索サイトを実行できます。

#### 方法 1：Vercel でワンクリックデプロイ（推奨）

1. このリポジトリを Fork します。
2. Supabase で新しいプロジェクトを作成し、`/data/schema.sql` を実行してテーブルを設定します。
3. Vercel に Fork したリポジトリをインポートし、Supabase の環境変数（`NEXT_PUBLIC_SUPABASE_URL` 等）を設定します。
4. デプロイをクリックすれば、独自の検索サイトが完成します。

#### 方法 2：ローカル開発 (Local Development)

```bash
# 1. リポジトリをクローン
git clone [https://github.com/pxw3504k-web/free-n8n-workflows.git](https://github.com/pxw3504k-web/free-n8n-workflows.git)
cd free-n8n-workflows

# 2. 依存関係をインストール
npm install

# 3. 環境設定
# .env.example を .env.local にリネームし、Supabase の認証情報を入力
# 静的に閲覧するだけなら、DB設定はスキップ可能です

# 4. 実行
npm run dev
```
ブラウザで `http://localhost:3000` を開くと結果が表示されます。

---

### 🤝 貢献 (Contributing)

オープンソースコミュニティは、学び、インスピレーションを受け、創造するための素晴らしい場所です。新しいワークフローの送信やバグ修正など、あらゆる貢献を**大いに歓迎**します。

1. このプロジェクトを Fork する
2. 機能ブランチを作成する (`git checkout -b feature/NewFeature`)
3. 変更をコミットする (`git commit -m 'Add some NewFeature'`)
4. ブランチに Push する (`git push origin feature/NewFeature`)
5. Pull Request を送信する

---

### 📄 ライセンス (License)

本プロジェクトは **MIT ライセンス** の下で公開されています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。

---

個人開発や自動化ツールの最新情報については、Twitter [@zoAoo6667168456](https://x.com/zoAoo6667168456) をフォローしてください。
