"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { createServer, isValidIdeaRequest, sanitizeIdeaResponse } = require("../server.js");

const validRequest = {
  name: "Birthday",
  kind: "Birthday",
  date: "2026-11-01",
  location: "Brooklyn",
  guests: 20,
  budget: { total: 2000, spent: 500 },
};

async function withServer(options, run) {
  const server = createServer({ apiKey: null, ...options });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test("idea requests enforce field types, allowed event kinds, and bounds", () => {
  assert.equal(isValidIdeaRequest(validRequest), true);
  assert.equal(isValidIdeaRequest({ ...validRequest, kind: "wedding<script>" }), false);
  assert.equal(isValidIdeaRequest({ ...validRequest, guests: -1 }), false);
  assert.equal(isValidIdeaRequest({ ...validRequest, date: "2026-02-31" }), false);
  assert.equal(isValidIdeaRequest({ ...validRequest, name: "x".repeat(61) }), false);
  assert.equal(isValidIdeaRequest(null), false);
});

test("AI output is parsed and validated before reaching the browser", () => {
  const idea = sanitizeIdeaResponse({
    choices: [{ message: { content: JSON.stringify({ text: "Try a shared photo wall.", tags: ["#personal", "#photos", "javascript:alert(1)", "#valid"] }) } }],
  });
  assert.deepEqual(idea, { text: "Try a shared photo wall.", tags: ["#personal", "#photos", "#valid"], source: "ai" });
  assert.throws(() => sanitizeIdeaResponse({ choices: [{ message: { content: "not json" } }] }));
  assert.throws(() => sanitizeIdeaResponse({ choices: [{ message: { content: JSON.stringify({ text: "No usable tags.", tags: ["<script>"] }) } }] }));
});

test("server provides safe headers, serves only public app assets, and reports honest AI status", async () => {
  await withServer({}, async (base) => {
    const [page, status, missing, source, tests] = await Promise.all([
      fetch(base),
      fetch(`${base}/api/status`),
      fetch(`${base}/does-not-exist.txt`),
      fetch(`${base}/server.js`),
      fetch(`${base}/tests/server.test.js`),
    ]);
    assert.equal(page.status, 200);
    assert.match(page.headers.get("content-security-policy"), /default-src 'self'/);
    assert.equal(status.status, 200);
    assert.deepEqual(await status.json(), { aiConfigured: false });
    assert.equal(missing.status, 404);
    assert.equal(source.status, 404);
    assert.equal(tests.status, 404);
  });
});

test("AI endpoint rejects invalid data and reports an unconfigured provider clearly", async () => {
  await withServer({}, async (base) => {
    const invalid = await fetch(`${base}/api/ideas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validRequest, kind: "script" }),
    });
    assert.equal(invalid.status, 400);

    const unconfigured = await fetch(`${base}/api/ideas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validRequest),
    });
    assert.equal(unconfigured.status, 503);
    assert.equal((await unconfigured.json()).code, "GEN_AI_NOT_CONFIGURED");
  });
});

test("AI endpoint rejects cross-origin requests and non-JSON payloads", async () => {
  await withServer({}, async (base) => {
    const crossOrigin = await fetch(`${base}/api/ideas`, {
      method: "POST",
      headers: { Origin: "https://attacker.example", "Content-Type": "application/json" },
      body: JSON.stringify(validRequest),
    });
    assert.equal(crossOrigin.status, 403);

    const differentScheme = await fetch(`${base}/api/ideas`, {
      method: "POST",
      headers: { Origin: `https://${new URL(base).host}`, "Content-Type": "application/json" },
      body: JSON.stringify(validRequest),
    });
    assert.equal(differentScheme.status, 403);

    const wrongContentType = await fetch(`${base}/api/ideas`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(validRequest),
    });
    assert.equal(wrongContentType.status, 415);

    const oversizedBody = await fetch(`${base}/api/ideas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validRequest, extra: "x".repeat(5000) }),
    });
    assert.equal(oversizedBody.status, 413);
  });
});

test("AI endpoint rate-limits expensive idea generation", async () => {
  await withServer({}, async (base) => {
    let lastResponse;
    for (let request = 0; request < 13; request += 1) {
      lastResponse = await fetch(`${base}/api/ideas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validRequest),
      });
      if (request < 12) assert.equal(lastResponse.status, 503);
    }
    assert.equal(lastResponse.status, 429);
  });
});

test("AI proxy keeps its API key server-side and validates provider output", async () => {
  let providerRequest;
  await withServer({
    apiKey: "server-only-test-key",
    fetchImpl: async (url, init) => {
      providerRequest = { url, init };
      return new Response(JSON.stringify({
        choices: [{ message: { content: JSON.stringify({ text: "Make a memory board.", tags: ["#personal", "#easy"] }) } }],
      }), { status: 200 });
    },
  }, async (base) => {
    const response = await fetch(`${base}/api/ideas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validRequest),
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { text: "Make a memory board.", tags: ["#personal", "#easy"], source: "ai" });
    assert.equal(providerRequest.url, "https://api.openai.com/v1/chat/completions");
    assert.match(providerRequest.init.headers.Authorization, /^Bearer server-only-test-key$/);
    assert.equal(response.headers.get("access-control-allow-origin"), null);
  });
});
