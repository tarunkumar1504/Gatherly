"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("HTML IDs are unique and every static JavaScript ID selector exists", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "HTML IDs must be unique.");
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]).filter(Boolean);
  assert.deepEqual([...new Set(anchors.filter((id) => !ids.includes(id)))], []);
  const selectors = [...app.matchAll(/querySelector(?:All)?\(["']#([A-Za-z0-9_-]+)/g)]
    .map((match) => match[1]);
  assert.deepEqual([...new Set(selectors.filter((id) => !ids.includes(id)))], []);
});

test("event planning screens ship without inline scripts, styles, or external assets", () => {
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/i);
  assert.doesNotMatch(html, /\s(?:on[a-z]+|style)=/i);
  assert.doesNotMatch(css, /@import\s+url|url\(\s*["']?https?:/i);
  assert.match(html, /name="viewport"/i);
});

test("the interface keeps keyboard focus, screen-reader progress, and motion preferences", () => {
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(html, /id="budget-progress"[^>]*aria-label="Budget spent"/);
  assert.match(html, /role="status"/);
  assert.match(html, /aria-controls="sidebar"/);
});
