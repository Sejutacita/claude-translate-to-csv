# Claude Translate to CSV

A Chrome extension that lets you pick any text elements on a webpage and instantly translate them into a ready-to-use CSV with **English** and **Indonesian** columns — powered by [Claude AI](https://anthropic.com).


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
- An [Anthropic API key](https://console.anthropic.com/)

### Steps

1. **Clone or download this repository**

   ```bash
   git clone https://github.com/devnazir/claude-translate-to-csv.git
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
   - Click the 📌 pin icon next to **Claude Translate to CSV**

---

## 🔑 Setup API Key

1. Click the extension icon in the toolbar
2. Enter your **Anthropic API key** in the settings popup
3. Click **Save**

> Get your API key at [console.anthropic.com](https://console.anthropic.com/)

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
- [Anthropic Claude API](https://docs.anthropic.com/)

---

## 📝 License

MIT
