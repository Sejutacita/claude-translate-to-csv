# AGENTS.md

Repo-specific guidance for AI agents working on this Chrome extension.

## Architecture

**Chrome Extension (Manifest V3) — vanilla JS, no build step**

- `background.js` — service worker, handles translation API calls (supports both Anthropic and GitHub)
- `content.js` — injected on `<all_urls>`, manages UI panel and element picking, shows active provider badge
- `settings.js` + `settings.html` — popup for provider selection and credential management
- `content.css` — injected styles for panel and hover states

No package.json, no dependencies, no build/test commands.

## Testing & Development

**No automated tests.** Manual testing only:

1. Load as unpacked extension: `chrome://extensions` → Developer Mode → Load unpacked
2. Test on any webpage
3. Check console for errors in both page context and extension background

**The panel auto-loads on every page** via `content.js:379` (`buildPanel()` runs immediately). Users close it manually, not via icon click.

## Translation Logic

**Dual provider support:**
- **Anthropic**: `claude-haiku-4-5-20251001` (hardcoded in `background.js:translateWithAnthropic`)
- **GitHub**: `gpt-4o-mini` via Azure endpoint (hardcoded in `background.js:translateWithGitHub`)

**Provider selection:** User chooses via radio buttons in settings. Both credentials can be saved simultaneously.

**API Endpoints:**
- Anthropic: `https://api.anthropic.com/v1/messages`
- GitHub: `https://models.inference.ai.azure.com/chat/completions`

**Critical prompt logic** in `background.js:buildPrompt()`:
- Auto-detects dynamic values (names, dates, counts) and converts to `{{placeholder}}` syntax
- Returns structured JSON: `{ source, languages: { English, Indonesian } }`
- Keys are auto-generated from text via camelCase conversion (max 40 chars)

If modifying translation behavior, edit the prompt string in `buildPrompt()`. Do not change the JSON structure without updating `content.js:349-362` (CSV builder).

## Key Constraints

- **Credentials stored via `chrome.storage.sync`** — both `apiKey` (Anthropic) and `githubToken` stored, user selects active `provider`
- **No error recovery** — failed translations show a toast, no retry mechanism
- **Element selection** — uses direct text nodes first (`content.js:180-194`), falls back to `innerText` (max 300 chars)
- **Hardcoded languages** — English + Indonesian only (`content.js:5-8`)
- **Provider badge** — content panel shows active provider (`content.js:buildPanel`)

## Common Modifications

**Add a language:**
1. Update `LANGS` array in `content.js:5-8`
2. Update prompt in `background.js:buildPrompt()` to reference new language
3. Update CSV builder in `content.js:349-362` to include new column

**Change models:**
- Anthropic: Update model string in `background.js:translateWithAnthropic()` and `settings.js:testAnthropic()`
- GitHub: Update model string in `background.js:translateWithGitHub()` and `settings.js:testGitHub()`

**Add a provider:**
1. Add radio option in `settings.html` provider selector
2. Add credential input section in `settings.html`
3. Add test function in `settings.js`
4. Add translation function in `background.js` (follow pattern of `translateWithAnthropic/GitHub`)
5. Update provider routing in `background.js:doTranslate()`
6. Add host permission in `manifest.json`

**Modify key generation:**
- Edit `textToKey()` in `background.js`
