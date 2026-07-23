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
    title: "Recipient Experience",
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
      "Owns service workflows and assignments",
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
    title: "Coordinator",
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
const architectureToggles = [...document.querySelectorAll(".architecture-toggle")];

function selectCard(id) {
  cards.forEach((card) => {
    card.classList.toggle("active", card.dataset.id === id);
  });
}

cards.forEach((card) => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.addEventListener("click", () => selectCard(card.dataset.id));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectCard(card.dataset.id);
    }
  });
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

const embeddedAssetScript = document.querySelector("#pronto-cares-agentic-food-rescue");
const embeddedAssetPreview = document.querySelector("#asset-script-preview");
const assetFlowCanvas = document.querySelector("#asset-flow-canvas");
const assetFlowNarration = document.querySelector("#asset-flow-narration");
const assetFlowStep = document.querySelector("#asset-flow-step");
const assetFlowPrev = document.querySelector("#asset-flow-prev");
const assetFlowNext = document.querySelector("#asset-flow-next");

if (embeddedAssetScript) {
  try {
    const embeddedAssetJson = JSON.parse(embeddedAssetScript.textContent || "{}");
    if (embeddedAssetPreview) {
      embeddedAssetPreview.textContent = JSON.stringify(embeddedAssetJson, null, 2);
    }
    renderAssetFlow(embeddedAssetJson);
  } catch (error) {
    if (embeddedAssetPreview) {
      embeddedAssetPreview.textContent = "Unable to parse embedded asset JSON.";
    }
  }
}

function renderAssetFlow(data) {
  if (
    !assetFlowCanvas ||
    !assetFlowNarration ||
    !assetFlowStep ||
    !assetFlowPrev ||
    !assetFlowNext ||
    !Array.isArray(data.nodes) ||
    !Array.isArray(data.edges) ||
    !Array.isArray(data.steps)
  ) {
    return;
  }

  const nodeById = new Map(data.nodes.map((node) => [node.id, node]));
  const edgeById = new Map(data.edges.map((edge) => [edge.id, edge]));
  const bounds = data.nodes.reduce(
    (acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      minY: Math.min(acc.minY, node.y),
      maxX: Math.max(acc.maxX, node.x),
      maxY: Math.max(acc.maxY, node.y),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );

  const pad = 120;
  const width = Math.max(960, bounds.maxX - bounds.minX + pad * 2);
  const height = Math.max(520, bounds.maxY - bounds.minY + pad * 2);

  const layer = document.createElement("div");
  layer.className = "asset-flow-layer";
  layer.style.width = `${width}px`;
  layer.style.height = `${height}px`;

  const svgNS = "http://www.w3.org/2000/svg";
  const edgeSvg = document.createElementNS(svgNS, "svg");
  edgeSvg.setAttribute("class", "asset-flow-edges");
  edgeSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  edgeSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const edgeEls = new Map();
  data.edges.forEach((edge) => {
    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);
    if (!from || !to) return;
    const x1 = from.x - bounds.minX + pad;
    const y1 = from.y - bounds.minY + pad;
    const x2 = to.x - bounds.minX + pad;
    const y2 = to.y - bounds.minY + pad;

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(y2));
    line.setAttribute("class", `asset-edge asset-edge-${edge.style || "solid"}`);
    edgeSvg.appendChild(line);
    edgeEls.set(edge.id, line);
  });

  const nodeLayer = document.createElement("div");
  nodeLayer.className = "asset-flow-nodes";
  const nodeEls = new Map();
  data.nodes.forEach((node) => {
    const x = node.x - bounds.minX + pad;
    const y = node.y - bounds.minY + pad;
    const el = document.createElement("article");
    el.className = "asset-node";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.borderColor = node.color || "#066AFE";
    el.innerHTML = `
      <div class="asset-node-icon">${node.icon || "●"}</div>
      <h3>${node.label}</h3>
    `;
    nodeLayer.appendChild(el);
    nodeEls.set(node.id, el);
  });

  layer.appendChild(edgeSvg);
  layer.appendChild(nodeLayer);
  assetFlowCanvas.innerHTML = "";
  assetFlowCanvas.appendChild(layer);

  let stepIndex = 0;
  const totalSteps = data.steps.length;
  const canvasEl = assetFlowCanvas;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scrollStepIntoView = (activeNodeIds) => {
    if (!canvasEl || activeNodeIds.size === 0) return;

    const positions = [];
    activeNodeIds.forEach((id) => {
      const node = nodeById.get(id);
      if (!node) return;
      const x = node.x - bounds.minX + pad;
      const y = node.y - bounds.minY + pad;
      positions.push({ x, y });
    });
    if (positions.length === 0) return;

    const avgX = positions.reduce((sum, p) => sum + p.x, 0) / positions.length;
    const avgY = positions.reduce((sum, p) => sum + p.y, 0) / positions.length;

    const targetLeft = Math.max(0, avgX - canvasEl.clientWidth / 2);
    const targetTop = Math.max(0, avgY - canvasEl.clientHeight / 2);

    canvasEl.scrollTo({
      left: targetLeft,
      top: targetTop,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const renderStep = (index) => {
    const step = data.steps[index];
    if (!step) return;
    const activeNodeIds = new Set(step.activeNodeIds || []);
    const activeEdgeIds = new Set(step.activeEdgeIds || []);

    nodeEls.forEach((el, id) => {
      el.classList.toggle("active", activeNodeIds.has(id));
    });
    edgeEls.forEach((el, id) => {
      const edgeMeta = edgeById.get(id);
      el.classList.toggle("active", activeEdgeIds.has(id));
      el.classList.toggle("is-animated", !!(edgeMeta && edgeMeta.animated && activeEdgeIds.has(id)));
    });

    assetFlowNarration.textContent = step.narration || "";
    assetFlowStep.textContent = `Step ${index + 1} of ${totalSteps}`;
    assetFlowPrev.disabled = index === 0;
    assetFlowNext.disabled = index === totalSteps - 1;
    scrollStepIntoView(activeNodeIds);
  };

  assetFlowPrev.onclick = () => {
    stepIndex = Math.max(0, stepIndex - 1);
    renderStep(stepIndex);
  };

  assetFlowNext.onclick = () => {
    stepIndex = Math.min(totalSteps - 1, stepIndex + 1);
    renderStep(stepIndex);
  };

  renderStep(stepIndex);
}

selectCard("rescueMatchDispatch");
