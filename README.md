# Translate UI to CSV

A Chrome extension that lets you pick any text elements on a webpage and instantly translate them into a ready-to-use CSV with **English** and **Indonesian** columns — powered by AI (Anthropic Claude or GitHub Copilot).


https://github.com/user-attachments/assets/b185eca6-6a14-4b4f-848e-791d264ccc5a


---

## ✨ Features

- 🖱️ **Click to collect** — pick any visible text element on any page
- 🤖 **AI-powered translation** — uses Claude (Anthropic) to translate naturally and professionally
- 📋 **CSV output** — exports as `key, en, id` format, ready for your localization workflow
- 🔁 **Toggle header row** — choose whether to include the header when copying

---

## 📦 Installation

> The extension is not yet on the Chrome Web Store. Install it manually via Developer Mode.

### Requirements

- Google Chrome (or any Chromium-based browser)
- **One of the following AI providers:**
  - [Anthropic API key](https://console.anthropic.com/) OR
  - [GitHub Personal Access Token](https://github.com/settings/tokens) (works with or without Copilot subscription)

### Steps

1. **Clone or download this repository**

   ```bash
   git clone https://github.com/Sejutacita/translate-ui-to-csv.git
   ```

   Or download the ZIP from GitHub and extract it.

2. **Open Chrome Extensions page**

   Navigate to:

   ```
   chrome://extensions
   ```

3. **Enable Developer Mode**

   Toggle the **Developer mode** switch in the top-right corner.

4. **Load the extension**

   - Click **"Load unpacked"**
   - Select the folder where you cloned/extracted the repo

5. **Pin the extension** _(optional but recommended)_

   - Click the 🧩 puzzle icon in the Chrome toolbar
   - Click the 📌 pin icon next to **Translate UI to CSV**

---

## 🔑 Setup AI Provider

1. Click the extension icon in the toolbar
2. **Choose your AI provider:**
   - **Anthropic Claude**: Enter your API key from [console.anthropic.com](https://console.anthropic.com/)
   - **GitHub Models**: Enter your Personal Access Token from [github.com/settings/tokens](https://github.com/settings/tokens)
3. Click **Test key** to verify it works
4. Click **Save**

> **Note:** GitHub Models API uses Azure's infrastructure and works with any GitHub account. Copilot subscribers get higher rate limits!

---

## 🚀 How to Use

1. Click the 🌐 extension icon — a floating panel will appear on the page
2. Click **"Start clicking elements"** to enter pick mode
3. Click any text on the page to collect it
4. Once you've collected all the text you need, click **"Translate →"**
5. The result modal will show a CSV with `key`, `en`, `id` columns
6. Toggle the **"Include header row"** radio to include/exclude the header
7. Click **"Copy to clipboard"** and paste it into your spreadsheet or i18n file

---

## 📄 CSV Output Format

```csv
"key","en","id"
"welcomeMessage","Welcome","Selamat datang"
"signIn","Sign in","Masuk"
```

---

## 🛠️ Tech Stack

- Vanilla JavaScript (no frameworks)
- Chrome Extension Manifest V3
- AI Translation via:
  - [Anthropic Claude API](https://docs.anthropic.com/) (claude-haiku-4-5)
  - [GitHub Models API](https://github.com/marketplace/models) (gpt-4o-mini via Azure)

---

## 📝 License

MIT
