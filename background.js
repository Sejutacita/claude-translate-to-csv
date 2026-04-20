chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
	if (message.type === "TRANSLATE_BATCH") {
		doTranslate(message.items, message.languages).then(sendResponse);
		return true;
	}
	if (message.type === "GET_SETTINGS") {
		chrome.storage.sync.get(
			["provider", "apiKey", "githubToken"],
			sendResponse,
		);
		return true;
	}
});

async function doTranslate(items, languages) {
	const settings = await chrome.storage.sync.get([
		"provider",
		"apiKey",
		"githubToken",
	]);
	const provider = settings.provider || "anthropic";

	// Route to appropriate provider
	if (provider === "github") {
		return await translateWithGitHub(items, languages, settings.githubToken);
	}

	return await translateWithAnthropic(items, languages, settings.apiKey);
}

async function translateWithAnthropic(items, languages, apiKey) {
	if (!apiKey || apiKey.length < 10) {
		return {
			error:
				"No Anthropic API key set. Click the extension icon (🌐) to enter your API key.",
		};
	}

	const sourceObj = {};
	items.forEach((text, i) => {
		const key = textToKey(text, i);
		sourceObj[key] = text;
	});

	const sourceJson = JSON.stringify(sourceObj, null, 2);
	const prompt = buildPrompt(sourceJson);

	try {
		const response = await fetch("https://api.anthropic.com/v1/messages", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": apiKey,
				"anthropic-version": "2023-06-01",
				"anthropic-dangerous-direct-browser-access": "true",
			},
			body: JSON.stringify({
				model: "claude-haiku-4-5-20251001",
				max_tokens: 2048,
				messages: [{ role: "user", content: prompt }],
			}),
		});

		if (!response.ok) {
			const err = await response.json();
			return { error: err.error?.message || "API error. Check your API key." };
		}

		const data = await response.json();
		const raw = data.content?.[0]?.text || "";
		const clean = raw.replace(/```json|```/g, "").trim();
		const parsed = JSON.parse(clean);
		return { result: parsed };
	} catch (e) {
		return { error: `Failed: ${e.message}` };
	}
}

async function translateWithGitHub(items, languages, githubToken) {
	if (!githubToken || githubToken.length < 10) {
		return {
			error:
				"No GitHub token set. Click the extension icon (🌐) to enter your token.",
		};
	}

	const sourceObj = {};
	items.forEach((text, i) => {
		const key = textToKey(text, i);
		sourceObj[key] = text;
	});

	const sourceJson = JSON.stringify(sourceObj, null, 2);
	const prompt = buildPrompt(sourceJson);

	try {
		const response = await fetch(
			"https://models.inference.ai.azure.com/chat/completions",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${githubToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "gpt-4o-mini",
					messages: [{ role: "user", content: prompt }],
					max_tokens: 2048,
					temperature: 0.3,
				}),
			},
		);

		if (!response.ok) {
			const err = await response.json();
			return {
				error:
					err.error?.message || err.message || "API error. Check your token.",
			};
		}

		const data = await response.json();
		const raw = data.choices?.[0]?.message?.content || "";
		const clean = raw.replace(/```json|```/g, "").trim();
		const parsed = JSON.parse(clean);
		return { result: parsed };
	} catch (e) {
		return { error: `Failed: ${e.message}` };
	}
}

function buildPrompt(sourceJson) {
	return `You are a professional localization engineer.

Translate all values in the source JSON into English (en) and Indonesian (id).

Source JSON (keys must be preserved exactly):
${sourceJson}

Return ONLY a valid JSON object with this exact structure:
{
  "source": { ...original key-value pairs... },
  "languages": {
    "English": { ...same keys, English translated values... },
    "Indonesian": { ...same keys, Indonesian translated values... }
  }
}

Rules:
- No markdown, no code fences, no explanation. Raw JSON only.
- Preserve every key exactly as-is.
- Keep existing placeholders like {name}, %s, {{var}} unchanged.
- If the source text is already in English, keep it as-is in the English object.
- If the source text is already in Indonesian, keep it as-is in the Indonesian object.
- Translate naturally and professionally.
- IMPORTANT — detect dynamic runtime values and replace them with {{placeholder}} syntax:
  * Proper names of people (e.g. "Nazir", "John") → {{name}}
  * Company or organization names (e.g. "NAZIR DEVELOPMENT", "Acme Corp") → {{company}}
  * Numeric counts or amounts (e.g. "3 items", "100 users") → {{count}} items, {{count}} users
  * Dates or times (e.g. "Monday", "Jan 1 2024") → {{date}}
  * Any other value that is clearly injected at runtime → {{value}}
  * Apply this to BOTH the English and Indonesian translations.
  * Example: "Hello, Nazir 👋" → "Hello, {{name}} 👋" and "Halo, {{name}} 👋"
  * Example: "Overview of NAZIR DEVELOPMENT" → "Overview of {{company}}" and "Gambaran umum {{company}}"`;
}

function textToKey(text, index) {
	// Convert text to a camelCase key, max 40 chars
	const words = text
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, "")
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 8); // limit word count before slicing
	if (!words.length) return `item${index + 1}`;
	const camel =
		words[0] +
		words
			.slice(1)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join("");
	return camel.slice(0, 40) || `item${index + 1}`;
}
