const anthropicKeyEl = document.getElementById("anthropic-key");
const githubTokenEl = document.getElementById("github-token");
const showAnthropicBtn = document.getElementById("show-anthropic");
const showGithubBtn = document.getElementById("show-github");
const saveBtn = document.getElementById("save");
const testBtn = document.getElementById("test");
const statusEl = document.getElementById("status");
const providerRadios = document.querySelectorAll('input[name="provider"]');
const anthropicSection = document.getElementById("anthropic-section");
const githubSection = document.getElementById("github-section");

// Load saved settings
chrome.storage.sync.get(["provider", "apiKey", "githubToken"], (d) => {
	// Set provider (default to anthropic for backward compatibility)
	const provider = d.provider || "anthropic";
	document.getElementById(`provider-${provider}`).checked = true;
	updateProviderSections(provider);

	// Load credentials
	if (d.apiKey) anthropicKeyEl.value = d.apiKey;
	if (d.githubToken) githubTokenEl.value = d.githubToken;
});

// Provider radio button handling
for (const radio of providerRadios) {
	radio.addEventListener("change", (e) => {
		updateProviderSections(e.target.value);
	});
}

function updateProviderSections(provider) {
	if (provider === "github") {
		anthropicSection.classList.remove("active");
		githubSection.classList.add("active");
	} else {
		anthropicSection.classList.add("active");
		githubSection.classList.remove("active");
	}
}

function getSelectedProvider() {
	return document.querySelector('input[name="provider"]:checked').value;
}

showAnthropicBtn.addEventListener("click", () => {
	const isPass = anthropicKeyEl.type === "password";
	anthropicKeyEl.type = isPass ? "text" : "password";
	showAnthropicBtn.textContent = isPass ? "Hide" : "Show";
});

showGithubBtn.addEventListener("click", () => {
	const isPass = githubTokenEl.type === "password";
	githubTokenEl.type = isPass ? "text" : "password";
	showGithubBtn.textContent = isPass ? "Hide" : "Show";
});

saveBtn.addEventListener("click", () => {
	const provider = getSelectedProvider();
	const anthropicKey = anthropicKeyEl.value.trim();
	const githubToken = githubTokenEl.value.trim();

	// Validate that the active provider has a credential
	if (provider === "anthropic" && !anthropicKey) {
		show("Please enter your Anthropic API key", "err");
		return;
	}
	if (provider === "github" && !githubToken) {
		show("Please enter your GitHub token", "err");
		return;
	}

	saveBtn.textContent = "Saving…";
	saveBtn.disabled = true;

	// Save both credentials and provider selection
	chrome.storage.sync.set(
		{
			provider,
			apiKey: anthropicKey,
			githubToken: githubToken,
		},
		() => {
			if (chrome.runtime.lastError) {
				show(`Error: ${chrome.runtime.lastError.message}`, "err");
			} else {
				show("✓ Saved!", "ok");
			}
			saveBtn.textContent = "Save";
			saveBtn.disabled = false;
		},
	);
});

testBtn.addEventListener("click", async () => {
	const provider = getSelectedProvider();
	const anthropicKey = anthropicKeyEl.value.trim();
	const githubToken = githubTokenEl.value.trim();

	// Validate credential for active provider
	if (provider === "anthropic" && !anthropicKey) {
		show("Enter your Anthropic API key first", "err");
		return;
	}
	if (provider === "github" && !githubToken) {
		show("Enter your GitHub token first", "err");
		return;
	}

	testBtn.textContent = "Testing…";
	testBtn.disabled = true;

	try {
		if (provider === "anthropic") {
			await testAnthropic(anthropicKey);
		} else {
			await testGitHub(githubToken);
		}
	} catch (e) {
		show(`✗ ${e.message}`, "err");
	}

	testBtn.textContent = "Test key";
	testBtn.disabled = false;
});

async function testAnthropic(apiKey) {
	const res = await fetch("https://api.anthropic.com/v1/messages", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": apiKey,
			"anthropic-version": "2023-06-01",
			"anthropic-dangerous-direct-browser-access": "true",
		},
		body: JSON.stringify({
			model: "claude-haiku-4-5-20251001",
			max_tokens: 10,
			messages: [{ role: "user", content: "Hi" }],
		}),
	});

	if (res.ok) {
		show("✓ Anthropic key works!", "ok");
	} else {
		const err = await res.json();
		show(`✗ ${err.error?.message || "Invalid key"}`, "err");
	}
}

async function testGitHub(token) {
	const res = await fetch(
		"https://models.inference.ai.azure.com/chat/completions",
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "gpt-4o-mini",
				messages: [{ role: "user", content: "Hi" }],
				max_tokens: 10,
			}),
		},
	);

	if (res.ok) {
		show("✓ GitHub token works!", "ok");
	} else {
		const err = await res.json();
		show(`✗ ${err.error?.message || err.message || "Invalid token"}`, "err");
	}
}

function show(msg, type) {
	statusEl.textContent = msg;
	statusEl.style.color = type === "err" ? "#e07070" : "#6ec97a";
	setTimeout(() => {
		statusEl.textContent = "";
	}, 3000);
}
