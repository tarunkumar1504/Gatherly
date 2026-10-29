"use strict";

const planner = window.GatherlyPlanner;
if (!planner) throw new Error("The Gatherly planner core could not be loaded.");

const DEFAULT_TASKS = [
  { title: "Book your venue", category: "VENUE", tag: "tag-venue", due: "Due Oct 28", priority: "Must do", filter: "this-week" },
  { title: "Send out the invites", category: "GUESTS", tag: "tag-guests", due: "Due Oct 30", priority: "Must do", filter: "this-week" },
  { title: "Pick a party theme", category: "THE LITTLE DETAILS", tag: "tag-style", due: "Done yesterday", priority: "Done", filter: "done" },
  { title: "Taste-test birthday cake", category: "FOOD & DRINK", tag: "tag-food", due: "Due Nov 2", priority: "Nice to do", filter: "this-week" },
  { title: "Choose your playlist", category: "ENTERTAINMENT", tag: "tag-style", due: "Done Oct 20", priority: "Done", filter: "done" },
  { title: "Book a photographer", category: "PHOTOGRAPHY", tag: "tag-guests", due: "Done Oct 18", priority: "Done", filter: "done" },
  { title: "Set the party budget", category: "BUDGET", tag: "tag-food", due: "Done Oct 16", priority: "Done", filter: "done" },
  { title: "Make your guest list", category: "GUESTS", tag: "tag-guests", due: "Done Oct 15", priority: "Done", filter: "done" },
  { title: "Pick a color palette", category: "THE LITTLE DETAILS", tag: "tag-style", due: "Done Oct 14", priority: "Done", filter: "done" },
  { title: "Find a caterer", category: "FOOD & DRINK", tag: "tag-food", due: "Done Oct 12", priority: "Done", filter: "done" },
  { title: "Send save-the-dates", category: "GUESTS", tag: "tag-guests", due: "Done Oct 10", priority: "Done", filter: "done" },
  { title: "Choose a birthday outfit", category: "THE LITTLE DETAILS", tag: "tag-style", due: "Due Nov 9", priority: "Nice to do", filter: "later" },
  { title: "Plan a signature cocktail", category: "FOOD & DRINK", tag: "tag-food", due: "Due Nov 10", priority: "Nice to do", filter: "later" },
  { title: "Make a day-of timeline", category: "THE LITTLE DETAILS", tag: "tag-style", due: "Due Nov 14", priority: "Must do", filter: "later" },
];

const EVENT_TASKS = {
  Wedding: [
    { title: "Book ceremony and reception venues", category: "VENUE", tag: "tag-venue", priority: "Must do", filter: "this-week" },
    { title: "Choose your celebrant", category: "CEREMONY", tag: "tag-style", priority: "Must do", filter: "this-week" },
    { title: "Make your guest list", category: "GUESTS", tag: "tag-guests", priority: "Must do", filter: "this-week" },
    { title: "Send save-the-dates", category: "GUESTS", tag: "tag-guests", priority: "Nice to do", filter: "later" },
    { title: "Book a photographer", category: "PHOTOGRAPHY", tag: "tag-guests", priority: "Nice to do", filter: "later" },
    { title: "Choose a caterer", category: "FOOD & DRINK", tag: "tag-food", priority: "Must do", filter: "later" },
    { title: "Plan ceremony music", category: "MUSIC", tag: "tag-style", priority: "Nice to do", filter: "later" },
    { title: "Choose your flowers", category: "DECOR", tag: "tag-food", priority: "Nice to do", filter: "later" },
    { title: "Plan the day-of timeline", category: "THE LITTLE DETAILS", tag: "tag-style", priority: "Must do", filter: "later" },
    { title: "Share accessibility and dietary details", category: "GUESTS", tag: "tag-guests", priority: "Must do", filter: "later" },
  ],
  "Community event": [
    { title: "Confirm the venue and any permits", category: "VENUE", tag: "tag-venue", priority: "Must do", filter: "this-week" },
    { title: "Invite your neighbors", category: "GUESTS", tag: "tag-guests", priority: "Must do", filter: "this-week" },
    { title: "Find volunteers for the day", category: "COMMUNITY", tag: "tag-style", priority: "Must do", filter: "this-week" },
    { title: "Plan an accessible, all-ages activity", category: "ACTIVITIES", tag: "tag-style", priority: "Must do", filter: "later" },
    { title: "Arrange food and refreshments", category: "FOOD & DRINK", tag: "tag-food", priority: "Nice to do", filter: "later" },
    { title: "Arrange tables, chairs, and shade", category: "EQUIPMENT", tag: "tag-venue", priority: "Must do", filter: "later" },
    { title: "Share transit and accessibility details", category: "GUESTS", tag: "tag-guests", priority: "Must do", filter: "later" },
    { title: "Plan cleanup and waste sorting", category: "THE LITTLE DETAILS", tag: "tag-style", priority: "Nice to do", filter: "later" },
    { title: "Check the weather backup plan", category: "THE LITTLE DETAILS", tag: "tag-venue", priority: "Nice to do", filter: "later" },
    { title: "Thank volunteers and neighbors", category: "COMMUNITY", tag: "tag-style", priority: "Nice to do", filter: "later" },
  ],
  "Baby shower": [
    { title: "Choose a welcoming space", category: "VENUE", tag: "tag-venue", priority: "Must do", filter: "this-week" },
    { title: "Make a guest list", category: "GUESTS", tag: "tag-guests", priority: "Must do", filter: "this-week" },
    { title: "Send invitations", category: "GUESTS", tag: "tag-guests", priority: "Must do", filter: "this-week" },
    { title: "Plan food and dietary options", category: "FOOD & DRINK", tag: "tag-food", priority: "Must do", filter: "later" },
    { title: "Choose a relaxed, inclusive activity", category: "ACTIVITIES", tag: "tag-style", priority: "Nice to do", filter: "later" },
    { title: "Set up a wishes and advice station", category: "THE LITTLE DETAILS", tag: "tag-style", priority: "Nice to do", filter: "later" },
    { title: "Coordinate the gift list", category: "GIFTS", tag: "tag-guests", priority: "Nice to do", filter: "later" },
    { title: "Plan comfortable seating", category: "VENUE", tag: "tag-venue", priority: "Must do", filter: "later" },
  ],
  "Other celebration": [
    { title: "Choose a date and venue", category: "VENUE", tag: "tag-venue", priority: "Must do", filter: "this-week" },
    { title: "Make a guest list", category: "GUESTS", tag: "tag-guests", priority: "Must do", filter: "this-week" },
    { title: "Set a celebration budget", category: "BUDGET", tag: "tag-food", priority: "Must do", filter: "this-week" },
    { title: "Send invitations", category: "GUESTS", tag: "tag-guests", priority: "Must do", filter: "later" },
    { title: "Plan food and refreshments", category: "FOOD & DRINK", tag: "tag-food", priority: "Nice to do", filter: "later" },
    { title: "Choose an activity everyone can enjoy", category: "ACTIVITIES", tag: "tag-style", priority: "Nice to do", filter: "later" },
    { title: "Share accessibility and travel details", category: "GUESTS", tag: "tag-guests", priority: "Must do", filter: "later" },
  ],
};

const VENDORS = [
  { name: "Venue", detail: "The Foundry · Brooklyn", cost: 1200, bookedLabel: "$1,200", icon: "⌂" },
  { name: "Catering", detail: "Bloom & Platter", cost: 1100, bookedLabel: "$1,100", icon: "✿" },
  { name: "Photographer", detail: "Jules Rivera", cost: 540, bookedLabel: "$540", icon: "◉" },
  { name: "Music & DJ", detail: "On your vendor wishlist", cost: 300, bookedLabel: "$300 est.", icon: "♫" },
  { name: "Flowers", detail: "On your vendor wishlist", cost: 160, bookedLabel: "$160 est.", icon: "❀" },
];

const TIMELINE_TEMPLATES = {
  Birthday: [
    ["4:00 PM", "Doors open & welcome drinks", "Let the catching up begin"],
    ["5:00 PM", "Photos & a little mingling", "Snap a pic before dinner"],
    ["6:00 PM", "Food is served", "Good food, even better company"],
    ["7:30 PM", "Cake, candles & birthday wishes", "Make a wish!"],
  ],
  Wedding: [
    ["3:30 PM", "Guest arrival & ceremony seating", "Welcome your guests"],
    ["4:00 PM", "Ceremony", "A moment for the happy couple"],
    ["5:00 PM", "Drinks, photos & congratulations", "Take a moment to celebrate"],
    ["6:30 PM", "Dinner, toasts & dancing", "Good food, heartfelt speeches, and a first dance"],
  ],
  "Community event": [
    ["12:00 PM", "Welcome & neighbor check-in", "Make everyone feel at home"],
    ["1:00 PM", "Community activities", "Something fun for every age"],
    ["2:00 PM", "Shared food & refreshments", "Bring neighbors together"],
    ["3:30 PM", "Thank volunteers & tidy up", "Leave the space ready for next time"],
  ],
  "Baby shower": [
    ["1:00 PM", "Welcome & refreshments", "Help everyone settle in"],
    ["1:30 PM", "Food & catching up", "Make time for conversation"],
    ["2:30 PM", "Wishes & a relaxed activity", "Celebrate the growing family"],
    ["3:30 PM", "Cake & thank-yous", "Close out the afternoon"],
  ],
  "Other celebration": [
    ["4:00 PM", "Welcome & arrivals", "Make time to greet your guests"],
    ["5:00 PM", "Food & refreshments", "Good food, good company"],
    ["6:00 PM", "The main celebration", "Bring everyone together"],
    ["7:00 PM", "Closing thanks & farewells", "End on a happy note"],
  ],
};

const browserStorage = (() => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
})();

const workspace = planner.loadWorkspace(browserStorage);
let state = workspace.events.find((event) => event.id === workspace.activeEventId) || workspace.events[0];
const taskList = document.querySelector("#task-list");
const toast = document.querySelector("#toast");
const moneyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const shortDateFormatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });
const fullDateFormatter = new Intl.DateTimeFormat(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
const longDateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "long" });

let activeFilter = "all";
let visibleAllTasks = false;
let aiConfigured = false;
let curatedIdeaIndex = 0;
let activeIdeaController = null;
let toastTimer;

/**
 * Displays an accessible live status announcement via toast notification.
 * @param {string} message - Announcement text.
 */
function announce(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3000);
}

/**
 * Serializes and saves current workspace state to persistent browser storage.
 */
function persistState() {
  const savedStatus = document.querySelector("#saved-status");
  try {
    if (!browserStorage) throw new Error("Browser storage is unavailable.");
    workspace.activeEventId = state.id;
    planner.saveWorkspace(browserStorage, workspace);
    savedStatus.textContent = "Saved in this browser";
    savedStatus.classList.remove("save-error");
  } catch {
    savedStatus.textContent = "Not saved on this device";
    savedStatus.classList.add("save-error");
    announce("Your browser could not save this update. Check its storage settings.");
  }
}

/**
 * Returns today's date formatted as YYYY-MM-DD in the local timezone.
 * @returns {string} ISO date string.
 */
function getLocalDateValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/**
 * Computes a JSON signature for change detection during async operations.
 * @param {Object} plan - Event plan.
 * @returns {string} Stringified event and budget signature.
 */
function getEventSignature(plan) {
  return JSON.stringify({ ...plan.event, budget: plan.budget });
}

/**
 * Renders the sidebar event switcher navigation list.
 */
function renderEventNavigation() {
  const eventList = document.querySelector("#event-list");
  eventList.replaceChildren();
  workspace.events.forEach((event, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = `event-nav${event.id === state.id ? " active-event" : ""}`;
    if (event.id === state.id) button.setAttribute("aria-current", "true");
    const dot = document.createElement("span");
    dot.className = `event-dot ${index % 2 === 0 ? "dot-coral" : "dot-lilac"}`;
    dot.setAttribute("aria-hidden", "true");
    const copy = document.createElement("span");
    copy.className = "event-nav-copy";
    const name = document.createElement("strong");
    name.textContent = event.event.name;
    const detail = document.createElement("small");
    detail.textContent = `${event.event.kind} · ${shortDateFormatter.format(new Date(`${event.event.date}T12:00:00`))}`;
    copy.append(name, detail);
    button.append(dot, copy);
    button.addEventListener("click", () => {
      if (state.id === event.id) return;
      if (activeIdeaController) activeIdeaController.abort();
      const navigationWasOpen = document.querySelector("#sidebar").classList.contains("open");
      state = event;
      workspace.activeEventId = state.id;
      activeFilter = "all";
      visibleAllTasks = false;
      persistState();
      renderDashboard();
      closeMobileNavigation(false);
      if (navigationWasOpen) mobileMenu.focus();
      else document.querySelector("#event-list [aria-current='true']").focus();
    });
    item.append(button);
    eventList.append(item);
  });
}

/**
 * Orchestrates full rendering of all dashboard components.
 */
function renderDashboard() {
  renderEvent();
  renderBudget();
  updateTaskSummary();
  renderTasks();
  renderVendors();
  renderTimeline();
  curatedIdeaIndex += 1;
  setIdea(planner.getCuratedIdea(state.event, state.budget, curatedIdeaIndex));
}

/**
 * Renders the hero card containing event title, date, countdown, and art.
 */
function renderEvent() {
  const event = state.event;
  document.querySelector("#event-title-name").textContent = event.name;
  document.querySelector("#event-title-kind").textContent = event.kind;
  document.querySelector("#event-kind-label").textContent = `${event.kind.toUpperCase()} CELEBRATION`;
  document.querySelector(".breadcrumb strong").textContent = event.name;
  document.title = `${event.name} — Gatherly`;
  const birthdayAge = event.kind === "Birthday" ? event.name.match(/\b(\d{1,3})(?:st|nd|rd|th)\b/i) : null;
  const celebrationArt = event.kind === "Birthday" ? (birthdayAge ? `${birthdayAge[1]}!` : "PARTY!")
    : event.kind === "Wedding" ? "LOVE!"
      : event.kind === "Community event" ? "TOGETHER!"
        : event.kind === "Baby shower" ? "BABY!"
          : "CELEBRATE!";
  document.querySelector(".art-caption strong").textContent = celebrationArt;
  document.querySelector(".art-caption span:last-child").textContent = event.kind === "Wedding" ? "together" : "celebration";
  renderEventNavigation();
  const date = document.querySelector("#event-date-display");
  date.dateTime = event.date;
  date.textContent = fullDateFormatter.format(new Date(`${event.date}T12:00:00`));
  document.querySelector("#event-location-display").textContent = event.location || "Location to be decided";
  document.querySelector("#guest-count").textContent = event.guests.toLocaleString();

  const remaining = planner.daysUntil(event.date);
  const countdownLabel = document.querySelector(".countdown-label");
  if (remaining === 0) {
    document.querySelector("#days-count").textContent = "Today";
    countdownLabel.textContent = "IS THE BIG DAY";
    document.querySelector(".countdown-note").textContent = "Today’s the day! ✨";
  } else if (remaining > 0) {
    document.querySelector("#days-count").textContent = remaining.toLocaleString();
    countdownLabel.textContent = "DAYS TO GO";
    document.querySelector(".countdown-note").textContent = "Plenty of time to make magic ✨";
  } else {
    document.querySelector("#days-count").textContent = Math.abs(remaining).toLocaleString();
    countdownLabel.textContent = "DAYS SINCE";
    document.querySelector(".countdown-note").textContent = "Hope it was unforgettable! ✨";
  }
}

/**
 * Renders the budget overview card and progress bar.
 */
function renderBudget() {
  const { total, spent } = state.budget;
  const remaining = total - spent;
  const percent = planner.getBudgetProgress(spent, total);
  document.querySelector("#budget-spent").textContent = moneyFormatter.format(spent);
  document.querySelector("#budget-total").textContent = moneyFormatter.format(total);
  document.querySelector("#budget-remaining").textContent = `${moneyFormatter.format(Math.abs(remaining))} ${remaining < 0 ? "over budget" : "left"}`;
  document.querySelector("#budget-status-label").textContent = remaining < 0 ? "Over your budget" : remaining === 0 ? "Budget fully allocated" : "Looking good!";
  document.querySelector("#budget-status-dot").classList.toggle("over-budget", remaining < 0);
  const progress = document.querySelector("#budget-progress");
  progress.value = percent;
  progress.setAttribute("aria-valuetext", `${moneyFormatter.format(spent)} spent of ${moneyFormatter.format(total)}`);
}

/**
 * Compiles the list of default, event-specific, and custom checklist tasks.
 * @returns {Array<Object>} Unified task items.
 */
function getTasks() {
  const savedDone = state.completedTasks;
  const baseTasks = EVENT_TASKS[state.event.kind] || DEFAULT_TASKS;
  return [
    ...baseTasks.map((task) => ({
      ...task,
      done: Object.hasOwn(savedDone, task.title) ? savedDone[task.title] : !state.isNew && task.priority === "Done",
      due: Object.hasOwn(savedDone, task.title)
        ? savedDone[task.title] ? "Just completed" : "Coming up"
        : task.priority === "Done" && !state.isNew ? "Done" : "Coming up",
      priority: state.isNew && task.priority === "Done" ? "Must do" : task.priority,
    })),
    ...state.customTasks.map((title) => ({
      title,
      category: "THE LITTLE DETAILS",
      tag: "tag-style",
      due: savedDone[title] === true ? "Completed" : "Just added",
      priority: savedDone[title] === true ? "Done" : "Nice to do",
      filter: "later",
      done: savedDone[title] === true,
    })),
  ];
}

/**
 * Updates task counters in summary stat cards and navigation badges.
 */
function updateTaskSummary() {
  const tasks = getTasks();
  const completed = tasks.filter((task) => task.done).length;
  const percentage = Math.round((completed / Math.max(tasks.length, 1)) * 100);
  document.querySelector("#tasks-completed").textContent = completed;
  document.querySelector("#tasks-total").textContent = tasks.length;
  document.querySelector("#nav-count").textContent = tasks.length - completed;
  const progress = document.querySelector("#checklist-progress");
  progress.value = percentage;
}

/**
 * Renders checklist tasks according to active filter and expansion state.
 */
function renderTasks() {
  const allTasks = getTasks();
  const filtered = allTasks.filter((task) => {
    if (activeFilter === "this-week") return task.filter === "this-week" && !task.done;
    if (activeFilter === "done") return task.done;
    return true;
  });
  const shown = visibleAllTasks || activeFilter !== "all" ? filtered : filtered.slice(0, 4);
  taskList.replaceChildren();
  shown.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.done ? " completed-task" : ""}`;

    const check = document.createElement("button");
    check.type = "button";
    check.className = `task-check${task.done ? " checked" : ""}`;
    check.setAttribute("aria-pressed", String(task.done));
    check.setAttribute("aria-label", `Mark ${task.title} as ${task.done ? "incomplete" : "complete"}`);
    check.dataset.taskTitle = task.title;
    if (task.done) {
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      icon.setAttribute("viewBox", "0 0 16 16");
      icon.setAttribute("aria-hidden", "true");
      path.setAttribute("d", "m3.5 8 3 3 6-6");
      icon.append(path);
      check.append(icon);
    }
    check.addEventListener("click", () => {
      Object.defineProperty(state.completedTasks, task.title, { value: !task.done, enumerable: true, configurable: true, writable: true });
      persistState();
      updateTaskSummary();
      renderTasks();
      const nextCheck = [...taskList.querySelectorAll(".task-check")].find((button) => button.dataset.taskTitle === task.title);
      if (nextCheck) nextCheck.focus();
      else document.querySelector(".task-tab.selected").focus();
      announce(task.done ? "Task moved back to your list." : "Nice one — task completed!");
    });

    const copy = document.createElement("span");
    copy.className = "task-copy";
    const title = document.createElement("strong");
    title.textContent = task.title;
    const meta = document.createElement("small");
    const tag = document.createElement("span");
    tag.className = `category-tag ${task.tag}`;
    tag.textContent = task.category;
    const due = document.createElement("span");
    due.className = "task-due";
    due.textContent = task.due;
    meta.append(tag, due);
    copy.append(title, meta);

    const priority = document.createElement("span");
    priority.className = `task-priority${task.done ? " priority-done" : ""}`;
    priority.textContent = task.done ? "Done" : task.priority;
    item.append(check, copy, priority);
    taskList.append(item);
  });

  const viewAll = document.querySelector("#view-all-tasks");
  viewAll.hidden = activeFilter !== "all" || visibleAllTasks;
  viewAll.textContent = `View all ${allTasks.length} tasks →`;
  document.querySelectorAll(".task-tab").forEach((tab) => {
    const selected = tab.dataset.filter === activeFilter;
    tab.classList.toggle("selected", selected);
    tab.setAttribute("aria-pressed", String(selected));
    const count = tab.dataset.filter === "all" ? allTasks.length
      : tab.dataset.filter === "done" ? allTasks.filter((task) => task.done).length
        : allTasks.filter((task) => task.filter === "this-week" && !task.done).length;
    tab.querySelector("span").textContent = count;
  });
}

/**
 * Renders the vendor booking checklist and syncs cost estimates with budget.
 */
function renderVendors() {
  const vendorList = document.querySelector(".vendor-list");
  vendorList.replaceChildren();
  VENDORS.forEach((vendor, index) => {
    const booked = Boolean(state.vendorsBooked[index]);
    const item = document.createElement("li");
    const icon = document.createElement("span");
    icon.className = `vendor-list-icon ${booked ? "booked-vendor" : "pending-vendor"}`;
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = vendor.icon;
    const copy = document.createElement("span");
    copy.className = "vendor-list-copy";
    const name = document.createElement("strong");
    name.textContent = vendor.name;
    const detail = document.createElement("small");
    detail.textContent = vendor.detail;
    copy.append(name, detail);
    const cost = document.createElement("span");
    cost.className = "vendor-cost";
    cost.textContent = booked ? vendor.bookedLabel : "To find";
    const button = document.createElement("button");
    button.type = "button";
    button.className = `vendor-check${booked ? " booked" : ""}`;
    button.dataset.vendorIndex = String(index);
    button.setAttribute("aria-pressed", String(booked));
    button.setAttribute("aria-label", `Mark ${vendor.name} as ${booked ? "unbooked" : "booked"}`);
    button.textContent = booked ? "✓" : "+";
    button.addEventListener("click", () => {
      state.vendorsBooked[index] = !state.vendorsBooked[index];
      state.budget.spent = Math.max(0, Math.round((state.budget.spent + (state.vendorsBooked[index] ? vendor.cost : -vendor.cost)) * 100) / 100);
      persistState();
      renderBudget();
      renderVendors();
      document.querySelector(`[data-vendor-index="${index}"]`).focus();
      announce(`${vendor.name} ${state.vendorsBooked[index] ? "booked. The budget now includes its cost." : "removed from booked vendors and the budget."}`);
    });
    item.append(icon, copy, cost, button);
    vendorList.append(item);
  });
  const count = state.vendorsBooked.filter(Boolean).length;
  document.querySelector("#vendor-count").textContent = `${count} of ${VENDORS.length} booked`;
  document.querySelector("#vendor-wishlist-count").textContent = count === VENDORS.length ? "Your dream team is ready" : `${VENDORS.length - count} more to find`;
  document.querySelector("#vendor-booked-summary").textContent = count;
  document.querySelector("#vendor-remaining-summary").textContent = `${VENDORS.length - count} more to find`;
  document.querySelector(".vendor-avatars").setAttribute("aria-label", `${count} of ${VENDORS.length} vendors booked`);
}

/**
 * Sets current suggestion in the ideas card.
 * @param {{ text: string, tags: string[], source: "ai"|"curated" }} idea - Idea to display.
 */
function setIdea(idea) {
  document.querySelector("#idea-description").textContent = idea.text;
  document.querySelector("#idea-source").textContent = idea.source === "ai"
    ? "AI-generated for this event · AI responses can be inaccurate; review before acting."
    : "Curated starter idea · Configure OPENAI_API_KEY to enable AI-generated suggestions.";
  const tags = document.querySelector(".idea-tags");
  tags.replaceChildren(...idea.tags.map((text) => {
    const tag = document.createElement("span");
    tag.textContent = text;
    return tag;
  }));
  const saved = state.savedIdeas.includes(idea.text);
  document.querySelector("#save-idea").setAttribute("aria-pressed", String(saved));
  document.querySelector("#save-idea").setAttribute("aria-label", saved ? "Remove saved idea" : "Save this idea");
  renderSavedIdeas();
}

/**
 * Renders the saved ideas collection list inside details disclosure.
 */
function renderSavedIdeas() {
  const list = document.querySelector("#saved-ideas-list");
  list.replaceChildren();
  document.querySelector("#saved-ideas-summary").textContent = `Saved ideas (${state.savedIdeas.length})`;
  state.savedIdeas.forEach((idea, index) => {
    const item = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = idea;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "saved-idea-remove";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove saved idea ${index + 1}`);
    remove.addEventListener("click", () => {
      state.savedIdeas.splice(index, 1);
      persistState();
      renderSavedIdeas();
      const currentIdea = document.querySelector("#idea-description").textContent;
      if (currentIdea === idea) {
        document.querySelector("#save-idea").setAttribute("aria-pressed", "false");
        document.querySelector("#save-idea").setAttribute("aria-label", "Save this idea");
      }
      const nextRemove = document.querySelector("#saved-ideas-list .saved-idea-remove");
      (nextRemove || document.querySelector("#saved-ideas-summary")).focus();
      announce("Saved idea removed.");
    });
    item.append(text, remove);
    list.append(item);
  });
}

/**
 * Requests a new event planning suggestion via backend AI proxy or curated fallback.
 */
async function getEventIdea() {
  const button = document.querySelector("#refresh-idea");
  const eventId = state.id;
  const currentSignature = getEventSignature(state);
  const controller = new AbortController();
  let requestTimedOut = false;
  const timeout = window.setTimeout(() => {
    requestTimedOut = true;
    controller.abort();
  }, 18000);
  activeIdeaController = controller;
  button.disabled = true;
  document.querySelector("#generate-button").disabled = true;
  try {
    const response = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: currentSignature,
    });
    if (state.id !== eventId || getEventSignature(state) !== currentSignature) return;
    if (response.ok) {
      const idea = await response.json();
      if (state.id !== eventId || getEventSignature(state) !== currentSignature) return;
      if (idea && typeof idea.text === "string" && Array.isArray(idea.tags)) {
        setIdea({ text: idea.text.slice(0, 800), tags: idea.tags.filter((tag) => typeof tag === "string" && /^#[a-z0-9-]{1,30}$/i.test(tag)).slice(0, 4), source: "ai" });
        announce("A new AI-generated idea is ready.");
        return;
      }
      throw new Error("The idea service returned an invalid response.");
    }
    const result = await response.json().catch(() => ({}));
    if (response.status !== 503) throw new Error(result.error || "The idea service is unavailable.");
    aiConfigured = false;
  } catch (error) {
    if (requestTimedOut && state.id === eventId) {
      announce("The AI request took too long. Here’s a curated idea instead.");
    } else if (error.name !== "AbortError" && aiConfigured) {
      announce("AI is unavailable right now. Here’s a curated idea instead.");
    }
  } finally {
    window.clearTimeout(timeout);
    if (activeIdeaController === controller) activeIdeaController = null;
    button.disabled = false;
    document.querySelector("#generate-button").disabled = false;
  }
  if (state.id !== eventId || getEventSignature(state) !== currentSignature) return;
  curatedIdeaIndex += 1;
  setIdea(planner.getCuratedIdea(state.event, state.budget, curatedIdeaIndex));
}

document.querySelectorAll(".task-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    activeFilter = tab.dataset.filter;
    renderTasks();
  });
});

document.querySelector("#view-all-tasks").addEventListener("click", () => {
  visibleAllTasks = true;
  renderTasks();
});

document.querySelector("#add-task-button").addEventListener("click", () => {
  const title = window.prompt("What would you like to remember?");
  if (!title || !title.trim()) return;
  if (state.customTasks.length >= 40) {
    announce("Your checklist has reached its 40 custom-task limit.");
    return;
  }
  const cleanTitle = title.trim().slice(0, 80);
  if (getTasks().some((task) => task.title.toLocaleLowerCase() === cleanTitle.toLocaleLowerCase())) {
    announce("That task is already on your checklist.");
    return;
  }
  state.customTasks.push(cleanTitle);
  persistState();
  updateTaskSummary();
  renderTasks();
  announce("Your new task is on the list.");
});

document.querySelector("#add-moment").addEventListener("click", () => {
  const title = window.prompt("What should happen at your celebration?");
  if (!title || !title.trim()) return;
  if (state.customMoments.length >= 30) {
    announce("Your timeline is full. Remove a moment before adding another.");
    return;
  }
  state.customMoments.push(title.trim().slice(0, 100));
  persistState();
  renderTimeline();
  announce("Your moment is on the timeline.");
});

/**
 * Renders the day-of celebration timeline sequence.
 */
function renderTimeline() {
  const timeline = document.querySelector("#timeline-list");
  timeline.replaceChildren();
  const moments = TIMELINE_TEMPLATES[state.event.kind] || TIMELINE_TEMPLATES["Other celebration"];
  const entries = [...moments, ...state.customMoments.map((moment) => ["TBD", moment, "Added to your celebration timeline"])];
  entries.forEach(([timeText, titleText, detailText]) => {
    const item = document.createElement("li");
    const time = document.createElement("time");
    time.textContent = timeText;
    const dot = document.createElement("span");
    dot.className = "timeline-dot";
    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = titleText;
    const note = document.createElement("small");
    note.textContent = detailText;
    details.append(name, note);
    item.append(time, dot, details);
    timeline.append(item);
  });
}

document.querySelector("#refresh-idea").addEventListener("click", getEventIdea);
document.querySelector("#generate-button").addEventListener("click", () => {
  document.querySelector("#ideas").scrollIntoView({ behavior: "smooth", block: "center" });
  getEventIdea();
});

document.querySelector("#save-idea").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const idea = document.querySelector("#idea-description").textContent;
  const existingIndex = state.savedIdeas.indexOf(idea);
  if (existingIndex === -1) {
    state.savedIdeas.push(idea.slice(0, 800));
  } else {
    state.savedIdeas.splice(existingIndex, 1);
  }
  state.savedIdeas = state.savedIdeas.slice(-20);
  persistState();
  const saved = state.savedIdeas.includes(idea);
  button.setAttribute("aria-pressed", String(saved));
  button.setAttribute("aria-label", saved ? "Remove saved idea" : "Save this idea");
  announce(saved ? "Idea saved to your plan." : "Idea removed from your saved ideas.");
});

const eventDialog = document.querySelector("#event-dialog");
let creatingEvent = false;
let lastFocusedBeforeEventDialog = null;

/**
 * Opens the event editing or creation modal dialog with focus management.
 * @param {boolean} [createNew=false] - True to create a new event.
 */
function openEventDialog(createNew = false) {
  lastFocusedBeforeEventDialog = document.activeElement;
  creatingEvent = createNew;
  const titleFirst = document.querySelector("#dialog-title-first");
  const titleSecond = document.querySelector("#dialog-title-second");
  titleFirst.textContent = createNew ? "Start planning your" : "Let’s update your";
  titleSecond.textContent = createNew ? "next celebration." : "event details.";
  document.querySelector("#event-name").value = createNew ? "" : state.event.name;
  document.querySelector("#event-kind").value = createNew ? "Birthday" : state.event.kind;
  document.querySelector("#event-date").value = createNew ? getLocalDateValue() : state.event.date;
  document.querySelector("#event-location").value = createNew ? "" : state.event.location;
  document.querySelector("#event-guests").value = createNew ? 0 : state.event.guests;
  eventDialog.showModal();
  document.querySelector("#event-name").focus();
}

eventDialog.addEventListener("close", () => {
  if (lastFocusedBeforeEventDialog && typeof lastFocusedBeforeEventDialog.focus === "function") {
    lastFocusedBeforeEventDialog.focus();
  }
});

document.querySelector("#new-event-link").addEventListener("click", () => openEventDialog(true));
document.querySelector("#new-event-shortcut").addEventListener("click", () => openEventDialog(true));
document.querySelector("#edit-event-button").addEventListener("click", () => openEventDialog(false));
document.querySelector("#close-dialog").addEventListener("click", () => eventDialog.close());
document.querySelector("#cancel-event-dialog").addEventListener("click", () => eventDialog.close());
document.querySelector("#event-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const guests = Number(document.querySelector("#event-guests").value);
  if (!Number.isInteger(guests) || guests < 0 || guests > 100000) {
    document.querySelector("#event-guests").setCustomValidity("Enter a whole number from 0 to 100,000.");
    form.reportValidity();
    return;
  }
  document.querySelector("#event-guests").setCustomValidity("");
  const eventDetails = {
    name: document.querySelector("#event-name").value.trim().slice(0, 60),
    kind: planner.EVENT_KINDS.includes(document.querySelector("#event-kind").value) ? document.querySelector("#event-kind").value : "Other celebration",
    date: document.querySelector("#event-date").value,
    location: document.querySelector("#event-location").value.trim().slice(0, 100),
    guests,
  };
  if (!eventDetails.name || !planner.isValidDate(eventDetails.date)) {
    announce("Add an event name and a valid date before saving.");
    return;
  }
  if (creatingEvent) {
    if (workspace.events.length >= 20) {
      announce("Your workspace has reached its 20-event limit.");
      return;
    }
    const id = window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `event-${Date.now()}-${workspace.events.length}`;
    state = planner.createEventPlan(eventDetails, id);
    workspace.events.push(state);
  } else {
    state.event = eventDetails;
  }
  if (activeIdeaController) activeIdeaController.abort();
  activeFilter = "all";
  visibleAllTasks = false;
  persistState();
  renderDashboard();
  eventDialog.close();
  closeMobileNavigation(false);
  announce("Your event details are saved.");
});

const budgetDialog = document.querySelector("#budget-dialog");
let lastFocusedBeforeBudgetDialog = null;

/**
 * Opens the budget editing modal dialog with focus management.
 */
function openBudgetDialog() {
  lastFocusedBeforeBudgetDialog = document.activeElement;
  document.querySelector("#budget-total-input").value = state.budget.total;
  document.querySelector("#budget-spent-input").value = state.budget.spent;
  budgetDialog.showModal();
  document.querySelector("#budget-total-input").focus();
}

budgetDialog.addEventListener("close", () => {
  if (lastFocusedBeforeBudgetDialog && typeof lastFocusedBeforeBudgetDialog.focus === "function") {
    lastFocusedBeforeBudgetDialog.focus();
  }
});

document.querySelector("#budget-edit-button").addEventListener("click", openBudgetDialog);
document.querySelector("#close-budget-dialog").addEventListener("click", () => budgetDialog.close());
document.querySelector("#cancel-budget-dialog").addEventListener("click", () => budgetDialog.close());
document.querySelector("#budget-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const total = Number(document.querySelector("#budget-total-input").value);
  const spent = Number(document.querySelector("#budget-spent-input").value);
  if (!Number.isFinite(total) || !Number.isFinite(spent) || total < 0 || spent < 0 || total > 10000000 || spent > 10000000) {
    announce("Budgets must be between $0 and $10,000,000.");
    return;
  }
  state.budget = { total, spent };
  if (activeIdeaController) activeIdeaController.abort();
  persistState();
  renderBudget();
  budgetDialog.close();
  announce("Your budget is saved.");
});

document.querySelector("#share-button").addEventListener("click", async () => {
  const summary = `${state.event.name} · ${state.event.kind}\n${longDateFormatter.format(new Date(`${state.event.date}T12:00:00`))} · ${state.event.location || "Location to be decided"}\n${state.event.guests.toLocaleString()} guests invited`;
  if (navigator.share) {
    try {
      await navigator.share({ title: state.event.name, text: summary });
    } catch (error) {
      if (error.name !== "AbortError") announce("Sharing isn’t available right now.");
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(summary);
    announce("Event summary copied. Your private budget and checklist were not shared.");
  } catch {
    announce("Sharing isn’t available in this browser.");
  }
});

const mobileMenu = document.querySelector("#mobile-menu");

/**
 * Closes the slide-over mobile navigation sidebar.
 * @param {boolean} [focusMenu=true] - True to return focus to hamburger trigger.
 */
function closeMobileNavigation(focusMenu = true) {
  const sidebar = document.querySelector("#sidebar");
  const wasOpen = sidebar.classList.contains("open");
  sidebar.classList.remove("open");
  mobileMenu.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-label", "Open navigation");
  if (wasOpen && focusMenu) mobileMenu.focus();
}

mobileMenu.addEventListener("click", () => {
  const isOpen = document.querySelector("#sidebar").classList.toggle("open");
  mobileMenu.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
document.querySelectorAll(".sidebar a").forEach((link) => link.addEventListener("click", () => {
  closeMobileNavigation();
}));

document.querySelector("#event-guests").addEventListener("input", (event) => event.currentTarget.setCustomValidity(""));

/**
 * Checks backend AI provider availability and updates interface badge.
 */
async function checkAiAvailability() {
  try {
    const response = await fetch("/api/status", { signal: AbortSignal.timeout(3000) });
    if (!response.ok) return;
    const result = await response.json();
    aiConfigured = result.aiConfigured === true;
    if (aiConfigured) {
      document.querySelector(".ai-badge-label").textContent = "AI PLANNING BUDDY";
      document.querySelector("#idea-source").textContent = "AI is ready · Your event details are sent only when you request an idea.";
    } else {
      document.querySelector("#idea-source").textContent = "Curated starter ideas · Add OPENAI_API_KEY on the server to enable AI-generated suggestions.";
    }
  } catch {
    aiConfigured = false;
    document.querySelector("#idea-source").textContent = "Curated starter ideas available · Start the local server to enable optional AI-generated suggestions.";
  }
}

renderDashboard();
persistState();
checkAiAvailability();
