(function exposePlannerCore(root, factory) {
  const planner = factory();
  if (typeof module === "object" && module.exports) module.exports = planner;
  if (root) root.GatherlyPlanner = planner;
})(typeof globalThis === "undefined" ? this : globalThis, function createPlannerCore() {
  "use strict";

  const STORAGE_KEY = "gatherly-planner-v1";
  const MAX_EVENT_NAME = 60;
  const MAX_LOCATION = 100;
  const MAX_TASKS = 40;
  const MAX_TASK_TITLE = 80;
  const MAX_MOMENTS = 30;
  const MAX_MOMENT_TITLE = 100;
  const MAX_BUDGET = 10000000;
  const MAX_SAVED_IDEAS = 20;
  const MAX_SAVED_IDEA_LENGTH = 800;
  const MAX_WORKSPACE_EVENTS = 20;
  const MAX_VENDOR_SLOTS = 5;
  const EVENT_KINDS = ["Birthday", "Wedding", "Community event", "Baby shower", "Other celebration"];

  /**
   * Generates a pristine initial event plan state.
   * @returns {Object} Default event plan state.
   */
  function createInitialState() {
    return {
      version: 1,
      id: "emma-30th",
      isNew: false,
      event: {
        name: "Emma's 30th",
        kind: "Birthday",
        date: "2026-10-24",
        location: "Brooklyn, NY",
        guests: 38,
      },
      budget: { total: 5000, spent: 2840 },
      completedTasks: { "Pick a party theme": true, "Choose your playlist": true, "Book a photographer": true, "Set the party budget": true, "Make your guest list": true, "Pick a color palette": true, "Find a caterer": true, "Send save-the-dates": true },
      customTasks: [],
      customMoments: [],
      vendorsBooked: [true, true, true, false, false],
      savedIdeas: [],
    };
  }

  /**
   * Validates whether a value is an ISO YYYY-MM-DD calendar date.
   * @param {unknown} value - Value to test.
   * @returns {boolean} True if valid calendar date string.
   */
  function isValidDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  /**
   * Trims string and clamps to maximum allowed length.
   * @param {unknown} value - Input string candidate.
   * @param {number} maxLength - Maximum allowable length.
   * @returns {string} Cleaned, bounded string.
   */
  function cleanText(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
  }

  /**
   * Sanitizes untrusted event plan input and enforces schema invariants.
   * @param {unknown} input - Raw user or stored state.
   * @returns {Object} Validated, normalized event state.
   */
  function sanitizeState(input) {
    const defaults = createInitialState();
    if (!input || typeof input !== "object" || Array.isArray(input)) return defaults;

    const event = input.event && typeof input.event === "object" && !Array.isArray(input.event) ? input.event : {};
    const budget = input.budget && typeof input.budget === "object" && !Array.isArray(input.budget) ? input.budget : {};
    const completedTasks = {};
    if (input.completedTasks && typeof input.completedTasks === "object" && !Array.isArray(input.completedTasks)) {
      Object.entries(input.completedTasks).slice(0, MAX_TASKS).forEach(([name, done]) => {
        const title = cleanText(name, MAX_TASK_TITLE);
        if (title && typeof done === "boolean") {
          Object.defineProperty(completedTasks, title, { value: done, enumerable: true, configurable: true, writable: true });
        }
      });
    }

    const customTasks = Array.isArray(input.customTasks)
      ? input.customTasks.slice(0, MAX_TASKS).map((task) => cleanText(task, MAX_TASK_TITLE)).filter(Boolean)
      : [];
    const customMoments = Array.isArray(input.customMoments)
      ? input.customMoments.slice(0, MAX_MOMENTS).map((moment) => cleanText(moment, MAX_MOMENT_TITLE)).filter(Boolean)
      : [];
    const savedIdeas = Array.isArray(input.savedIdeas)
      ? input.savedIdeas.slice(0, MAX_SAVED_IDEAS).map((idea) => cleanText(idea, MAX_SAVED_IDEA_LENGTH)).filter(Boolean)
      : [];

    return {
      version: 1,
      id: typeof input.id === "string" && /^[a-z0-9-]{1,48}$/i.test(input.id) ? input.id : "event",
      isNew: input.isNew === true,
      event: {
        name: cleanText(event.name, MAX_EVENT_NAME) || defaults.event.name,
        kind: EVENT_KINDS.includes(event.kind) ? event.kind : defaults.event.kind,
        date: isValidDate(event.date) ? event.date : defaults.event.date,
        location: typeof event.location === "string" ? cleanText(event.location, MAX_LOCATION) : defaults.event.location,
        guests: Number.isInteger(event.guests) && event.guests >= 0 && event.guests <= 100000
          ? event.guests
          : defaults.event.guests,
      },
      budget: {
        total: Number.isFinite(budget.total) && budget.total >= 0 && budget.total <= MAX_BUDGET
          ? Math.round(budget.total * 100) / 100
          : defaults.budget.total,
        spent: Number.isFinite(budget.spent) && budget.spent >= 0 && budget.spent <= MAX_BUDGET
          ? Math.round(budget.spent * 100) / 100
          : defaults.budget.spent,
      },
      completedTasks,
      customTasks,
      customMoments,
      vendorsBooked: Array.isArray(input.vendorsBooked)
        ? input.vendorsBooked.slice(0, MAX_VENDOR_SLOTS).map((value) => value === true)
        : defaults.vendorsBooked,
      savedIdeas,
    };
  }

  /**
   * Safely loads an event state from a web storage implementation.
   * @param {{ getItem: (key: string) => string|null }} storage - Storage mechanism.
   * @returns {Object} Validated event state.
   */
  function loadState(storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      return raw ? sanitizeState(JSON.parse(raw)) : createInitialState();
    } catch {
      return createInitialState();
    }
  }

  /**
   * Persists an event state to web storage.
   * @param {{ setItem: (key: string, value: string) => void }} storage - Storage mechanism.
   * @param {Object} state - State to serialize.
   */
  function saveState(storage, state) {
    storage.setItem(STORAGE_KEY, JSON.stringify(sanitizeState(state)));
  }

  /**
   * Generates a community block party starter plan.
   * @returns {Object} Community celebration state.
   */
  function createCommunityEvent() {
    return {
      ...createInitialState(),
      id: "summer-block-party",
      event: {
        name: "Summer block party",
        kind: "Community event",
        date: "2027-06-14",
        location: "Brooklyn, NY",
        guests: 75,
      },
      budget: { total: 3000, spent: 600 },
      completedTasks: {},
      customTasks: [],
      customMoments: [],
      vendorsBooked: [false, false, false, false, false],
      savedIdeas: [],
      isNew: true,
    };
  }

  /**
   * Generates default multi-event workspace.
   * @returns {Object} Workspace with default events.
   */
  function createInitialWorkspace() {
    return {
      version: 1,
      activeEventId: "emma-30th",
      events: [createInitialState(), createCommunityEvent()],
    };
  }

  /**
   * Normalizes a multi-event workspace and migrates legacy single-event saves.
   * @param {unknown} input - Raw workspace or legacy event save.
   * @returns {Object} Validated workspace object.
   */
  function sanitizeWorkspace(input) {
    const defaults = createInitialWorkspace();
    if (!input || typeof input !== "object" || Array.isArray(input)) return defaults;
    if (!Array.isArray(input.events)) {
      const migratedPlan = sanitizeState(input);
      return { version: 1, activeEventId: migratedPlan.id, events: [migratedPlan] };
    }
    const seen = new Set();
    const events = input.events.slice(0, MAX_WORKSPACE_EVENTS).map((event, index) => {
      const plan = sanitizeState(event);
      let id = plan.id;
      let suffix = 1;
      while (seen.has(id)) {
        id = `event-${index + 1}-${suffix}`;
        suffix += 1;
      }
      seen.add(id);
      plan.id = id;
      return plan;
    });
    if (!events.length) return defaults;
    const activeEventId = events.some((event) => event.id === input.activeEventId)
      ? input.activeEventId
      : events[0].id;
    return { version: 1, activeEventId, events };
  }

  /**
   * Loads workspace from storage with fallback.
   * @param {{ getItem: (key: string) => string|null }} storage - Storage mechanism.
   * @returns {Object} Validated workspace.
   */
  function loadWorkspace(storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      return raw ? sanitizeWorkspace(JSON.parse(raw)) : createInitialWorkspace();
    } catch {
      return createInitialWorkspace();
    }
  }

  /**
   * Saves workspace to storage.
   * @param {{ setItem: (key: string, value: string) => void }} storage - Storage mechanism.
   * @param {Object} workspace - Workspace to serialize.
   */
  function saveWorkspace(storage, workspace) {
    storage.setItem(STORAGE_KEY, JSON.stringify(sanitizeWorkspace(workspace)));
  }

  /**
   * Instantiates a new celebration plan.
   * @param {Object} event - Event descriptor.
   * @param {string} id - Unique event identifier.
   * @returns {Object} New event plan state.
   */
  function createEventPlan(event, id) {
    const safeEvent = sanitizeState({ event }).event;
    return {
      ...createInitialState(),
      id: typeof id === "string" && /^[a-z0-9-]{1,48}$/i.test(id) ? id : "new-event",
      isNew: true,
      event: {
        name: cleanText(safeEvent.name, MAX_EVENT_NAME) || "My celebration",
        kind: safeEvent.kind,
        date: safeEvent.date,
        location: cleanText(event && event.location, MAX_LOCATION),
        guests: event && Number.isInteger(event.guests) && event.guests >= 0 && event.guests <= 100000 ? event.guests : 0,
      },
      budget: { total: 0, spent: 0 },
      completedTasks: {},
      customTasks: [],
      customMoments: [],
      vendorsBooked: [false, false, false, false, false],
      savedIdeas: [],
    };
  }

  /**
   * Computes budget percentage spent, bounded between 0 and 100.
   * @param {number} spent - Amount spent.
   * @param {number} total - Total budget.
   * @returns {number} Percentage (0-100).
   */
  function getBudgetProgress(spent, total) {
    if (!Number.isFinite(total) || total <= 0) {
      return Number.isFinite(spent) && spent > 0 ? 100 : 0;
    }
    if (!Number.isFinite(spent) || spent <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((spent / total) * 100)));
  }

  /**
   * Computes calendar days from today until an event date.
   * @param {string} date - ISO date string (YYYY-MM-DD).
   * @param {Date} [today] - Reference date (defaults to current date).
   * @returns {number|null} Whole days count or null if date is invalid.
   */
  function daysUntil(date, today) {
    if (!isValidDate(date)) return null;
    const currentDate = today || new Date();
    const currentUtc = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const eventUtc = Date.parse(`${date}T00:00:00Z`);
    return Math.round((eventUtc - currentUtc) / 86400000);
  }

  /**
   * Retrieves a curated, deterministic celebration idea based on event attributes.
   * @param {Object} event - Event descriptor.
   * @param {Object} [budget] - Event budget.
   * @param {number} [index=0] - Offset index for cycling suggestions.
   * @returns {{ text: string, tags: string[], source: "curated" }} Structured suggestion.
   */
  function getCuratedIdea(event, budget, index = 0) {
    const safeEvent = sanitizeState({ event, budget }).event;
    const name = safeEvent.name;
    const spend = budget && Number.isFinite(budget.total) ? budget.total : 0;
    const guestCount = safeEvent.guests;
    const birthdayIdeas = spend > 0 && spend < 1000
      ? [
        `Keep ${name} personal and on budget: ask each of your ${guestCount} guests to add one song to a shared playlist before the party.`,
        `Set out a jar and paper slips so your guests can share a favorite memory with ${name}. It makes a thoughtful keepsake at almost no cost.`,
        `Try a low-cost “how well do you know ${name}?” quiz with a few favorite photos and fun facts between courses.`,
      ]
      : [
        `Set up a “favorite memories with ${name}” board and invite your ${guestCount} guests to leave a photo or handwritten note.`,
        `Ask friends to each pick a song from a different year of ${name}'s life, then make a playlist to enjoy together.`,
        `Invite guests to write a birthday wish on a paper star and gather the notes into a sweet keepsake for ${name}.`,
      ];
    const ideasByKind = {
      Birthday: { texts: birthdayIdeas, tags: ["#birthday", "#personal", "#budget-friendly"] },
      Wedding: {
        texts: [
          "Invite guests to leave a short wish in a shared wedding guestbook, then keep the notes as an affordable, personal memento.",
          "Ask each table to suggest a favorite song for the reception playlist. It brings guests together without adding another vendor.",
          "Use seasonal greenery and reusable jars for simple table centerpieces that can suit a range of wedding budgets.",
        ],
        tags: ["#wedding", "#thoughtful", "#budget-friendly"],
      },
      "Community event": {
        texts: [
          `Set up a “what brings us together” board where your ${guestCount} neighbors can share a local memory or idea for the next get-together.`,
          "Host a neighbor-led skill swap: invite people to share a small hobby or tip in a relaxed, accessible corner of the event.",
          "Create a simple neighborhood map and invite guests to mark a favorite local spot or community resource.",
        ],
        tags: ["#community", "#welcoming", "#participatory"],
      },
      "Baby shower": {
        texts: [
          "Set up a gentle advice-and-wishes station where guests can leave kind notes for the growing family.",
          "Invite guests to bring a favorite childhood book and write a short note inside the cover as a keepsake.",
          "Offer a relaxed, optional onesie-decorating table with washable markers and no timed games.",
        ],
        tags: ["#baby-shower", "#heartfelt", "#inclusive"],
      },
      "Other celebration": {
        texts: [
          `Invite the guests at ${name} to add a favorite memory or kind wish to a shared keepsake board.`,
          "Ask guests to suggest one favorite song and build a playlist together before the event.",
          "Set up a low-pressure conversation prompt or activity that lets guests join in at their own pace.",
        ],
        tags: ["#celebrate", "#welcoming", "#budget-friendly"],
      },
    };
    const selection = ideasByKind[safeEvent.kind] || ideasByKind["Other celebration"];
    const len = selection.texts.length;
    const normalizedIndex = Number.isInteger(index) ? ((index % len) + len) % len : 0;
    return { text: selection.texts[normalizedIndex], tags: selection.tags, source: "curated" };
  }

  return Object.freeze({
    STORAGE_KEY,
    EVENT_KINDS: Object.freeze(EVENT_KINDS.slice()),
    createInitialState,
    sanitizeState,
    loadState,
    saveState,
    createInitialWorkspace,
    sanitizeWorkspace,
    loadWorkspace,
    saveWorkspace,
    createEventPlan,
    getBudgetProgress,
    daysUntil,
    getCuratedIdea,
    isValidDate,
  });
});
