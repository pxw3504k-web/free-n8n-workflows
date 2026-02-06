# 🚀 Free n8n Workflows Collection

<div align="center">

[English](./README.md) | 
[简体中文](./README_zh.md) | 
[日本語](./README_ja.md) | 
[Español](./README_es.md)

**The largest open-source collection of verified n8n workflows.**





*Stop reinventing the wheel. Copy, Paste, Automate.*

[Explore Workflows](https://n8nworkflows.world) · [Report Bug](https://github.com/pxw3504k-web/free-n8n-workflows/issues) · [Request Feature](https://github.com/pxw3504k-web/free-n8n-workflows/issues)

</div>

---

### 📖 The Story: Why Open Source?

This project started as an online n8n template search engine ([n8nworkflows.world](https://n8nworkflows.world)).

However, just last week, our database was hit by a massive scraper attack (originating mostly from data centers in Lanzhou). These bots weren't browsing the web, but systematically scraping data, generating **31GB of egress traffic** in just a few days, making server maintenance costs unsustainable.

Since everyone wants this data so badly, I decided to stop fighting and open source it completely.

As an indie developer, I believe automation technology should be open to everyone. Now, I am making these **8,000+ verified workflows** available for download. No paywalls, no server limits, no API bills.

If you find this project helpful, please give this repository a Star ⭐️. It is the biggest support for me!

<img width="2880" height="3986" alt="image" src="https://github.com/user-attachments/assets/d5bc24de-d4c2-4656-bddf-0a076914ee66" />

---

### 🎁 Support the Developer

Maintaining this open-source project is my hobby. If you want to support my work (or protect your digital life), please check out the two new apps I am developing. They are the motivation for me to continue contributing to the community.

#### 1. 🆘 LifelineSOS: Family Locator

**Privacy-first Life360 alternative.** I was fed up with location apps that sell user data.

* **Feature**: Real-time and private family location sharing.
* **Highlight**: No ads, no data selling. One-tap SOS in emergencies.
* **Status**: Launching Closed Beta soon.
👉 [Free Download link](https://play.google.com/store/apps/details?id=com.lifeline.sos)

#### 2. 🕵️‍♂️ Hidden Camera Detector

**Essential security tool for travelers.**

* **Feature**: Uses phone magnetic sensors and network scanning to detect hidden cameras in hotels/Airbnbs.
* **Highlight**: Protect your privacy from intrusion.
* **Status**: In development.
👉 [Follow my Twitter to learn more](https://x.com/zoAoo6667168456)

---

### ✨ Features

* 🚀 **Massive Database**: Includes 8,000+ verified workflows, covering Marketing, DevOps, Sales, and AI automation scenarios.
* 🔍 **Smart Search**: Includes full Next.js search engine source code, supporting filtering by "Role" or "Integration".
* 📦 **JSON Ready**: Provides raw JSON file downloads, ready to import directly into n8n.
* ⚡ **Modern Stack**: Built with Next.js 14, Tailwind CSS, and Supabase.
* 🛡️ **Self-Hostable**: The data is in your hands. You can deploy this project on your own Vercel or server.

---

### 📂 Data Access

If you don't want to run the website and just want the data, we have prepared it for you:

* **Full JSON Data**: Please check directory `/data/workflows.json`
* **SQL Database Structure**: Please check directory `/data/schema.sql` (Suitable for PostgreSQL/Supabase)

---

### 🛠️ Installation

You can run your own n8n search site in the following two ways.

#### Method 1: One-Click Deploy via Vercel (Recommended)

1. Fork this repository.
2. Create a new project in Supabase and run `/data/schema.sql` to set up tables.
3. Import your forked repo in Vercel, configure Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.).
4. Click Deploy to have your own search site.

#### Method 2: Local Development

```bash
# 1. Clone repository
git clone https://github.com/pxw3504k-web/free-n8n-workflows.git
cd free-n8n-workflows

# 2. Install dependencies
npm install

# 3. Configure environment
# Rename .env.example to .env.local and fill in your Supabase
# If just browsing statically, you can skip DB config

# 4. Run
npm run dev

```

Open `http://localhost:3000` in your browser to see the result.

---

### 🤝 Contributing

The open-source community is amazing because of people like you. Any contribution (whether submitting new workflows or fixing bugs) is highly welcome.

1. Fork this project
2. Create your branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add some NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Submit Pull Request

---

### 📄 License

This project is distributed under the **MIT License**. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

---

Follow my Twitter [@zoAoo6667168456](https://x.com/zoAoo6667168456) for more updates on indie development and automation tools.
