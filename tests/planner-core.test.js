"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const planner = require("../planner-core.js");

test("event defaults provide a complete, valid starter plan", () => {
  const state = planner.createInitialState();
  assert.equal(state.event.kind, "Birthday");
  assert.equal(planner.isValidDate(state.event.date), true);
  assert.equal(state.budget.total, 5000);
});

test("state validation rejects malformed and out-of-range saved data", () => {
  const state = planner.sanitizeState({
    event: { name: "<img src=x onerror=alert(1)>", kind: "Unexpected", date: "2026-02-30", location: "Somewhere", guests: -1 },
    budget: { total: Infinity, spent: -10 },
    completedTasks: { "<script>": "true" },
    customTasks: [" a ".repeat(100), null],
    vendorsBooked: [1, true, "true"],
  });
  assert.equal(state.event.name, "<img src=x onerror=alert(1)>");
  assert.equal(state.event.kind, "Birthday");
  assert.equal(state.event.date, "2026-10-24");
  assert.equal(state.event.guests, 38);
  assert.equal(state.budget.total, 5000);
  assert.deepEqual(state.completedTasks, {});
  assert.equal(state.customTasks[0].length, 80);
  assert.deepEqual(state.vendorsBooked, [false, true, false]);
});

test("storage failures fall back to a working default plan", () => {
  const state = planner.loadState({ getItem() { throw new Error("Storage disabled"); } });
  assert.equal(state.event.name, "Emma's 30th");
});

test("storage reads invalid JSON safely and writes normalized data", () => {
  let stored;
  const storage = {
    getItem() { return "not json"; },
    setItem(key, value) { stored = { key, value }; },
  };
  assert.equal(planner.loadState(storage).budget.total, 5000);
  planner.saveState(storage, { version: 99 });
  assert.equal(stored.key, planner.STORAGE_KEY);
  assert.equal(JSON.parse(stored.value).version, 1);
});

test("event workspaces retain separate plans and safely migrate saved plans", () => {
  const workspace = planner.createInitialWorkspace();
  const newPlan = planner.createEventPlan({
    name: "Our wedding",
    kind: "Wedding",
    date: "2027-08-20",
    location: "",
    guests: 100,
  }, "wedding-1");
  workspace.events.push(newPlan);
  workspace.activeEventId = newPlan.id;
  const restored = planner.sanitizeWorkspace(JSON.parse(JSON.stringify(workspace)));
  assert.equal(restored.activeEventId, "wedding-1");
  assert.equal(restored.events.find((event) => event.id === "wedding-1").event.kind, "Wedding");
  assert.equal(restored.events.find((event) => event.id === "wedding-1").event.location, "");
  assert.equal(restored.events.length, 3);
  const migrated = planner.sanitizeWorkspace(planner.createInitialState());
  assert.equal(migrated.activeEventId, "emma-30th");
  assert.equal(migrated.events.length, 1);
});

test("task completion maps keep untrusted property names as ordinary data", () => {
  const state = planner.sanitizeState({ completedTasks: JSON.parse('{"__proto__":true,"constructor":false}') });
  assert.equal(Object.hasOwn(state.completedTasks, "__proto__"), true);
  assert.equal(Object.hasOwn(state.completedTasks, "constructor"), true);
  assert.equal(Object.getPrototypeOf(state.completedTasks), Object.prototype);
});

test("budget progress stays between zero and one hundred", () => {
  assert.equal(planner.getBudgetProgress(250, 1000), 25);
  assert.equal(planner.getBudgetProgress(130, 100), 100);
  assert.equal(planner.getBudgetProgress(0, 0), 0);
  assert.equal(planner.getBudgetProgress(10, 0), 100);
});

test("day calculations use calendar days and handle invalid dates", () => {
  assert.equal(planner.daysUntil("2026-10-25", new Date(2026, 9, 24)), 1);
  assert.equal(planner.daysUntil("2026-10-23", new Date(2026, 9, 24)), -1);
  assert.equal(planner.daysUntil("not-a-date"), null);
});

test("idea suggestions match the event type and avoid exceeding the guest budget", () => {
  const wedding = planner.getCuratedIdea({ kind: "Wedding", name: "Our wedding" }, { total: 100 });
  const community = planner.getCuratedIdea({ kind: "Community event", name: "Block party" }, { total: 100 });
  assert.match(wedding.text, /guestbook/);
  assert.match(community.text, /neighbors/);
  assert.equal(wedding.source, "curated");
  assert.equal(wedding.tags.length, 3);
  const birthday = planner.getCuratedIdea({ kind: "Birthday", name: "Kai's party", guests: 18 }, { total: 300 }, 0);
  const nextBirthday = planner.getCuratedIdea({ kind: "Birthday", name: "Kai's party", guests: 18 }, { total: 300 }, 1);
  assert.match(birthday.text, /Kai's party/);
  assert.notEqual(birthday.text, nextBirthday.text);
});
