const copy = {
  rescueMatchDispatch: {
    title: "Rescue Match & Dispatch",
    body: "Operational agent that determines the fastest safe handoff path from donation to recipient.",
    bullets: [
      "Uses telemetry to match donation → need → driver",
      "Coordinates timing and route-level distribution updates",
      "Mission link: turns surplus into on-time meals with dignity",
    ],
  },
  safeToEatGuardian: {
    title: "Safe-to-Eat Guardian",
    body: "Safety agent that validates allergen and cold-chain constraints before delivery routing.",
    bullets: [
      "Grounded in ADL policy documents with citation paths",
      "Escalates risky combinations before dispatch",
      "Mission link: food as medicine, do no harm",
    ],
  },
  wellBeingCheckIn: {
    title: "Well-Being Check-In",
    body: "Recipient-facing support agent for confirmations, missed-meal flags, and follow-up help.",
    bullets: [
      "Runs across web, voice, and Slack channels",
      "Flags missed handoffs for priority intervention",
      "Mission link: keeps delivery human, warm, and reliable",
    ],
  },
  salesforceOrg: {
    title: "Salesforce Org",
    body: "Core operational system where agent actions, case context, and workflow orchestration live.",
    bullets: [
      "Owns service workflows and assignment",
      "Anchors the architecture for governance",
      "Best demo line: the trusted source of execution truth",
    ],
  },
  snowflake: {
    title: "Snowflake Telemetry",
    body: "Live order and driver telemetry that powers late/lost incident reasoning.",
    bullets: [
      "Zero-copy connector for real-time updates",
      "Critical for dispatch and ETA confidence",
      "Best demo line: the differentiator data source already live",
    ],
  },
  amazonS3: {
    title: "Amazon S3 Enrichment",
    body: "External attributes supporting match quality and policy-aware routing.",
    bullets: [
      "Fast to load for demos",
      "Supports donor/recipient enrichment",
      "Best demo line: lightweight external context for better decisions",
    ],
  },
  dataCloudDmos: {
    title: "Data Cloud DMOs",
    body: "Unified model combining recipients, donors, rescued items, and dispatches into one reasoning surface.",
    bullets: [
      "Cross-domain context for agent decisions",
      "Supports segmentation and activation",
      "Best demo line: one graph, many stakeholders",
    ],
  },
  tableau: {
    title: "Tableau / Analytics",
    body: "Observation layer for outcomes, quality, and operational trends.",
    bullets: [
      "Monitors agent impact over time",
      "Feeds stakeholder reporting",
      "Best demo line: explainability and measurable value",
    ],
  },
  adlPrimary: {
    title: "Einstein Data Library (ADL)",
    body: "Primary RAG grounding source for policy-safe, citation-backed responses.",
    bullets: [
      "Structured ingestion of safety docs",
      "Powers Guardian citations",
      "Best demo line: policy-grounded answers with traceability",
    ],
  },
  customMetadata: {
    title: "Custom Metadata Fallback",
    body: "Deterministic backup for decision-code citations when dynamic retrieval is unavailable.",
    bullets: [
      "Keeps behavior stable under degraded conditions",
      "Supports strict safety decision paths",
      "Best demo line: resilient trust layer fallback",
    ],
  },
  personaDonor: {
    title: "Donor",
    body: "Contributes surplus food and wants confidence that it reaches real households quickly.",
    bullets: [
      "Pain: good food wasted due to logistics friction",
      "Need: transparent routing and pickup confidence",
      "Outcome: measurable social impact from each donation",
    ],
  },
  personaDriver: {
    title: "Driver",
    body: "Executes safe handoffs and needs clear route, timing, and exception context.",
    bullets: [
      "Pain: fragmented dispatch and unclear delivery notes",
      "Need: real-time telemetry and guided handoff steps",
      "Outcome: fewer failed deliveries and faster turnaround",
    ],
  },
  personaRecipient: {
    title: "Recipient",
    body: "Relies on reliable meal delivery with dignity and clear communication.",
    bullets: [
      "Pain: missed windows and inconsistent updates",
      "Need: safety-first matching and warm support",
      "Outcome: trusted, on-time meals and better well-being",
    ],
  },
};

const cards = [...document.querySelectorAll(".clickable")];
const reviewBadge = document.getElementById("reviewBadge");
const architectureToggles = [...document.querySelectorAll(".architecture-toggle")];

function selectCard(id) {
  cards.forEach((card) => {
    card.classList.toggle("active", card.dataset.id === id);
  });
}

cards.forEach((card) => {
  card.addEventListener("click", () => selectCard(card.dataset.id));
});

architectureToggles.forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const card = toggle.closest(".architecture-card");
    if (!card) return;
    const next = !card.classList.contains("expanded");
    card.classList.toggle("expanded", next);
    toggle.setAttribute("aria-expanded", next ? "true" : "false");
    toggle.textContent = next ? "Hide flow details" : "View flow details";
  });
});

reviewBadge.addEventListener("click", () => {
  alert("Review mode: click cards to validate architecture narrative and demo talk track.");
});

selectCard("rescueMatchDispatch");
