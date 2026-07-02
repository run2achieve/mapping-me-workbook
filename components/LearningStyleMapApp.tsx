"use client";

import { ChangeEvent, CSSProperties, useEffect, useState } from "react";

type PanelId = "learn" | "test" | "takeaways";
type Mode = "lively" | "calm";
type LearningDimensionId = "input" | "processing" | "social" | "engagement" | "support";
type ResonanceVote = "me" | "maybe" | "neutral" | "";

type ReflectionAnswers = Record<string, string>;
type LearningVotes = Record<string, ResonanceVote>;
type LearningStyleMapData = {
  reflectionAnswers: ReflectionAnswers;
  votes: LearningVotes;
  notes: string;
  mode: Mode;
};

const storageKey = "mapping-me-learning-style-map";

const learningDimensions: Array<{
  id: LearningDimensionId;
  title: string;
  examples: string[];
  short: string;
  notice: string;
  subtypes: Array<{ title: string; description: string }>;
  color: string;
}> = [
  {
    id: "input",
    title: "Input format",
    examples: ["Visual", "Auditory", "Reading / writing", "Kinesthetic", "Tactile", "Taste", "Smell"],
    short: "The format information arrives in can change how easy it is to understand and remember.",
    notice: "Input can include language, images, movement, touch, taste, smell, and combinations of several channels.",
    subtypes: [
      { title: "Visual", description: "Learns more easily through images, diagrams, color, layout, icons, maps, and spatial organization." },
      { title: "Auditory", description: "Benefits from spoken explanation, discussion, rhythm, listening, or saying ideas out loud." },
      { title: "Reading / writing", description: "Uses written words, notes, lists, captions, labels, and rewriting to organize understanding." },
      { title: "Kinesthetic", description: "Learns through body movement, acting things out, practicing actions, gestures, or physically doing the process." },
      { title: "Tactile", description: "Uses touch, texture, pressure, manipulatives, materials, or physical objects to make ideas more concrete." },
      { title: "Taste", description: "May connect learning to flavor, food-based examples, oral sensory experience, or taste-related memory cues." },
      { title: "Smell", description: "May notice scent strongly; familiar or low-scent environments can affect focus, memory, comfort, or access." },
      { title: "Multisensory", description: "Benefits when several channels work together, such as seeing, hearing, touching, moving, and naming at the same time." }
    ],
    color: "#EE5A3A"
  },
  {
    id: "processing",
    title: "Processing style",
    examples: ["Reflective", "Fast-paced", "Sequential", "Big-picture", "Detail-oriented", "Pattern-based"],
    short: "Processing style describes how information is organized, paced, connected, and turned into understanding.",
    notice: "This dimension is about the route thinking takes, not whether someone is quick, slow, good, or bad at learning.",
    subtypes: [
      { title: "Reflective", description: "Understanding develops through pauses, internal thinking, drafts, and time to form a response." },
      { title: "Fast-paced", description: "Thinking feels more available when there is momentum, challenge, and quick movement between ideas." },
      { title: "Sequential", description: "Information makes sense through ordered steps, clear progression, and cause-and-effect links." },
      { title: "Big-picture / conceptual", description: "The overall purpose, theme, or concept needs to be visible before details feel meaningful." },
      { title: "Detail-oriented", description: "Small facts, precision, exceptions, and exact wording are important parts of understanding." },
      { title: "Pattern-based", description: "Learning happens through noticing similarities, systems, categories, rules, or repeated structures." },
      { title: "Associative", description: "Ideas connect through memory, emotion, examples, side links, and non-linear relationships." }
    ],
    color: "#166E66"
  },
  {
    id: "social",
    title: "Social setting",
    examples: ["Independent", "One-to-one", "Small group", "Group-based", "Parallel"],
    short: "Social setting describes how the presence, role, and number of other people shape learning.",
    notice: "This dimension includes privacy, audience, feedback, collaboration, and whether other people add energy or demand.",
    subtypes: [
      { title: "Independent", description: "Learning happens mostly through private processing, self-direction, and reduced social interruption." },
      { title: "One-to-one", description: "Learning is shaped by direct exchange with one trusted person, mentor, teacher, or peer." },
      { title: "Small group", description: "A few familiar people create room for discussion without the intensity of a large audience." },
      { title: "Group-based", description: "Shared examples, multiple perspectives, social energy, and collaboration are part of the learning process." },
      { title: "Parallel", description: "Another person nearby may affect focus even when people are working on separate tasks." },
      { title: "Audience-sensitive", description: "Performance, confidence, or language access changes depending on who is watching or listening." }
    ],
    color: "#6B4A9E"
  },
  {
    id: "engagement",
    title: "Engagement needs",
    examples: ["Interactive", "Interest-led", "Movement-supported", "Novelty", "Challenge", "Autonomy"],
    short: "Engagement needs describe what makes attention, motivation, and participation easier to access.",
    notice: "This dimension is about what pulls the learner into the material and what makes the learning feel alive enough to stay with.",
    subtypes: [
      { title: "Interactive", description: "Attention is supported by participation, questions, feedback, experiments, and active exchange." },
      { title: "Interest-led", description: "Motivation is strongest when the topic connects to curiosity, fascination, or a deep interest." },
      { title: "Movement-supported", description: "Engagement is connected to body movement, gestures, fidgets, standing, walking, or physical action." },
      { title: "Novelty-seeking", description: "Newness, variety, surprise, or changing formats can make attention easier to sustain." },
      { title: "Challenge-based", description: "A clear puzzle, goal, problem, or level of difficulty can create focus and momentum." },
      { title: "Creative / expressive", description: "Making, designing, storytelling, humor, metaphor, or personal expression helps the material matter." },
      { title: "Autonomy-supported", description: "Engagement is shaped by having meaningful choice, control over approach, or ownership of the task." }
    ],
    color: "#F4A82C"
  },
  {
    id: "support",
    title: "Support needs",
    examples: ["Clear structure", "Examples", "Repetition", "Time to prepare", "Chunking", "Feedback"],
    short: "Support needs describe the scaffolds that reduce confusion, uncertainty, memory load, or pressure.",
    notice: "This dimension names the kind of scaffolding a learner may need; it is not a measure of ability.",
    subtypes: [
      { title: "Clear structure", description: "Understanding depends on explicit steps, expectations, boundaries, and what counts as complete." },
      { title: "Examples", description: "Models, samples, demonstrations, or comparison cases make abstract expectations more concrete." },
      { title: "Repetition", description: "Repeated exposure, reminders, and revisiting information are part of how learning settles." },
      { title: "Time to prepare", description: "Preview, planning, and reduced surprise affect readiness to participate or produce work." },
      { title: "Chunking", description: "Information is easier to hold when it is divided into smaller parts, stages, or checkpoints." },
      { title: "Feedback", description: "Response from another person, the task, or the environment helps calibrate what is understood." },
      { title: "Memory scaffolding", description: "External cues, labels, lists, prompts, or reminders reduce the load on working memory." }
    ],
    color: "#335F55"
  }
];

const reflectionPrompts: Array<{
  id: string;
  title: string;
  prompt: string;
  placeholder: string;
}> = [
  {
    id: "surprised",
    title: "What surprised me?",
    prompt: "After reading different learning styles,\nwhat felt unexpected, new,\nor more complicated than you thought?",
    placeholder: "Example: I thought I was only visual, but movement and repetition may matter more than I expected."
  },
  {
    id: "think",
    title: "What made me think?",
    prompt: "Which card made you pause, question an old label, or remember a real-life learning moment?",
    placeholder: "Example: The social setting cards made me realize I learn differently when someone is watching."
  },
  {
    id: "try-next",
    title: "What do I want to test in real life?",
    prompt: "Choose one small learning support or format\nyou want to try before deciding\nwhether it fits you.",
    placeholder: "Example: Next time I revise, I want to try speaking key ideas out loud and drawing a quick map."
  }
];

const learningOptions = learningDimensions.flatMap((dimension) =>
  dimension.subtypes.map((subtype, index) => ({
    id: `${dimension.id}-${index}`,
    dimensionId: dimension.id,
    dimensionTitle: dimension.title,
    color: dimension.color,
    title: subtype.title,
    description: subtype.description
  }))
);

const resonanceVotes: Array<{
  id: Exclude<ResonanceVote, "">;
  label: string;
}> = [
  { id: "me", label: "This is me" },
  { id: "maybe", label: "Maybe me" },
  { id: "neutral", label: "Not me" }
];

const takeaways: Record<LearningDimensionId, string[]> = {
  input: ["Ask for information in more than one format when possible.", "Notice whether visual, auditory, reading / writing, or hands-on input helps most for this task."],
  processing: ["Name the pace and structure that help: reflective, fast-paced, sequential, or big-picture.", "Ask for preview time, a concept map, or step-by-step order when the default pace does not fit."],
  social: ["Choose the social setting intentionally: independent, one-to-one, or group-based.", "Make group learning clearer with roles, turn-taking, and a way to ask questions safely."],
  engagement: ["Use interaction, interest, choice, and movement to make attention easier to access.", "Connect new material to something meaningful before expecting sustained focus."],
  support: ["Use clear structure, examples, repetition, and time to prepare as legitimate learning supports.", "Keep reusable scaffolds such as checklists, models, worked examples, and practice rounds."]
};

function createEmptyReflectionAnswers(): ReflectionAnswers {
  return Object.fromEntries(reflectionPrompts.map((prompt) => [prompt.id, ""])) as ReflectionAnswers;
}

function createEmptyVotes(): LearningVotes {
  return Object.fromEntries(learningOptions.map((option) => [option.id, ""])) as LearningVotes;
}

function normalizeVotes(raw: LearningVotes | undefined): LearningVotes {
  const nextVotes = createEmptyVotes();
  learningOptions.forEach((option) => {
    const vote = raw?.[option.id];
    nextVotes[option.id] = vote === "me" || vote === "maybe" || vote === "neutral" ? vote : "";
  });
  return nextVotes;
}

export function LearningStyleMapApp() {
  const [activePanel, setActivePanel] = useState<PanelId>("learn");
  const [mode, setMode] = useState<Mode>("lively");
  const [reflectionAnswers, setReflectionAnswers] = useState<ReflectionAnswers>(() => createEmptyReflectionAnswers());
  const [votes, setVotes] = useState<LearningVotes>(() => createEmptyVotes());
  const [animatedVoteCard, setAnimatedVoteCard] = useState("");
  const [notes, setNotes] = useState("");
  const [saveState, setSaveState] = useState("Saved on this device");
  const [importError, setImportError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as {
        reflectionAnswers?: ReflectionAnswers;
        votes?: LearningVotes;
        notes?: string;
        mode?: Mode;
      };
      setReflectionAnswers({ ...createEmptyReflectionAnswers(), ...parsed.reflectionAnswers });
      setVotes(normalizeVotes(parsed.votes));
      setNotes(parsed.notes ?? "");
      setMode(parsed.mode === "calm" ? "calm" : "lively");
    } catch {
      setSaveState("Could not load saved learning style map");
    }
  }, []);

  useEffect(() => {
    document.body.dataset.mode = mode;
  }, [mode]);

  useEffect(() => {
    setSaveState("Saving on this device");
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ reflectionAnswers, votes, notes, mode })
      );
      setSaveState("Saved on this device");
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [reflectionAnswers, votes, notes, mode]);

  function updateReflectionAnswer(promptId: string, value: string) {
    setReflectionAnswers((current) => ({
      ...current,
      [promptId]: value
    }));
  }

  function setVote(cardId: string, vote: ResonanceVote) {
    setVotes((current) => ({
      ...current,
      [cardId]: current[cardId] === vote ? "" : vote
    }));
    setAnimatedVoteCard(cardId);
    window.setTimeout(() => setAnimatedVoteCard(""), 650);
  }

  function getLearningStyleMapData(): LearningStyleMapData {
    return { reflectionAnswers, votes, notes, mode };
  }

  function drawWrappedText(
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(/\s+/);
    let line = "";
    let currentY = y;

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      if (context.measureText(testLine).width > maxWidth && line) {
        context.fillText(line, x, currentY);
        line = word;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }

    if (line) {
      context.fillText(line, x, currentY);
      currentY += lineHeight;
    }

    return currentY;
  }

  function downloadLearningVotesJpg() {
    const scale = 2;
    const width = 1320;
    const margin = 56;
    const innerX = 92;
    const innerWidth = width - innerX * 2;
    const cardGap = 24;
    const cardWidth = (innerWidth - cardGap * 2) / 3;
    const cardHeight = 620;
    const height = 980;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.scale(scale, scale);
    context.fillStyle = mode === "calm" ? "#ECE4D6" : "#F3E8D2";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#2A2521";
    context.lineWidth = 3;
    context.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    context.fillStyle = "#2A2521";
    context.font = "700 56px Arial";
    context.fillText("Mapping Me Learning Style Map", innerX, 126);
    context.font = "400 22px Arial";
    context.fillStyle = "#6B6457";
    context.fillText("Subtype card votes from the learning dimensions page.", innerX, 168);

    const voteGroups = [
      { title: "This is me", vote: "me", fill: mode === "calm" ? "#6C8981" : "#166E66", text: "#FFF9EC" },
      { title: "Maybe me", vote: "maybe", fill: mode === "calm" ? "#D6C7A8" : "#F4A82C", text: "#2A2521" },
      { title: "Not me", vote: "neutral", fill: mode === "calm" ? "#E8DCC2" : "#F8EDD9", text: "#2A2521" }
    ];

    voteGroups.forEach((group, index) => {
      const x = innerX + index * (cardWidth + cardGap);
      const selectedOptions = learningOptions
        .filter((option) => votes[option.id] === group.vote)
        .map((option) => `${option.title} (${option.dimensionTitle})`);

      context.fillStyle = group.fill;
      context.strokeStyle = "#2A2521";
      context.lineWidth = 3;
      context.fillRect(x, 230, cardWidth, cardHeight);
      context.strokeRect(x, 230, cardWidth, cardHeight);
      context.fillStyle = group.text;
      context.font = "700 28px Arial";
      context.fillText(group.title, x + 28, 282);
      context.font = "400 21px Arial";
      drawWrappedText(
        context,
        selectedOptions.length ? selectedOptions.join(", ") : "Blank for now.",
        x + 28,
        326,
        cardWidth - 56,
        32
      );
    });

    const link = document.createElement("a");
    link.download = "mapping-me-learning-style-votes.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  function downloadReflectionJpg() {
    const scale = 2;
    const width = 1320;
    const margin = 56;
    const innerX = 92;
    const innerWidth = width - innerX * 2;
    const sectionGap = 28;
    const cardHeight = 210;
    const height = 980;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.scale(scale, scale);
    context.fillStyle = mode === "calm" ? "#ECE4D6" : "#F3E8D2";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#2A2521";
    context.lineWidth = 3;
    context.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    context.fillStyle = "#2A2521";
    context.font = "700 56px Arial";
    context.fillText("Mapping Me Reflection Time", innerX, 126);
    context.font = "400 22px Arial";
    context.fillStyle = "#6B6457";
    context.fillText("Reflection before taking the learning style test.", innerX, 168);

    let y = 230;
    reflectionPrompts.forEach((reflectionPrompt, index) => {
      context.fillStyle = index === 1 ? "#F8EDD9" : index === 2 ? "#F7CFDA" : "#FFF9EC";
      context.strokeStyle = "#2A2521";
      context.lineWidth = 3;
      context.fillRect(innerX, y, innerWidth, cardHeight);
      context.strokeRect(innerX, y, innerWidth, cardHeight);

      context.fillStyle = "#2A2521";
      context.font = "700 28px Arial";
      context.fillText(reflectionPrompt.title, innerX + 28, y + 46);
      context.font = "400 21px Arial";
      context.fillStyle = "#6B6457";
      drawWrappedText(
        context,
        reflectionAnswers[reflectionPrompt.id] || "Blank for now.",
        innerX + 28,
        y + 88,
        innerWidth - 56,
        30
      );

      y += cardHeight + sectionGap;
    });

    const link = document.createElement("a");
    link.download = "mapping-me-learning-reflection.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  function applyLearningStyleMapData(
    data: Partial<{
      reflectionAnswers: ReflectionAnswers;
      votes: LearningVotes;
      notes: string;
      mode: Mode;
    }>
  ) {
    setReflectionAnswers({ ...createEmptyReflectionAnswers(), ...data.reflectionAnswers });
    setVotes(normalizeVotes(data.votes));
    setNotes(typeof data.notes === "string" ? data.notes : "");
    setMode(data.mode === "calm" ? "calm" : "lively");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(getLearningStyleMapData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mapping-me-learning-style-map.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setImportError("");

    if (!file) {
      return;
    }

    file
      .text()
      .then((text) => {
        const parsed = JSON.parse(text);

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("That JSON file does not look like a learning style map.");
        }

        applyLearningStyleMapData(parsed as Partial<LearningStyleMapData>);
      })
      .catch(() => setImportError("Could not import that JSON file."))
      .finally(() => {
        event.target.value = "";
      });
  }

  function resetLearningStyleMap() {
    if (!window.confirm("Reset your learning style map on this device?")) {
      return;
    }

    setReflectionAnswers(createEmptyReflectionAnswers());
    setVotes(createEmptyVotes());
    setNotes("");
  }

  function resetLearningVotes() {
    if (!window.confirm("Reset your learning style votes on this device?")) {
      return;
    }

    setVotes(createEmptyVotes());
  }

  function resetReflectionAnswers() {
    if (!window.confirm("Reset your reflection answers on this device?")) {
      return;
    }

    setReflectionAnswers(createEmptyReflectionAnswers());
  }

  return (
    <main className="shell sensory-shell" translate="no">
      <header className="topbar no-print">
        <div>
          <p className="eyebrow">Mapping Me</p>
          <h1>Learning Style Map</h1>
        </div>
        <div className="mode-switch" aria-label="Presentation mode">
          <button
            aria-pressed={mode === "lively"}
            className={mode === "lively" ? "active" : ""}
            onClick={() => setMode("lively")}
            type="button"
          >
            Lively
          </button>
          <button
            aria-pressed={mode === "calm"}
            className={mode === "calm" ? "active" : ""}
            onClick={() => setMode("calm")}
            type="button"
          >
            Calm
          </button>
        </div>
      </header>

      <section className="privacy-note no-print" aria-label="Privacy note">
        <strong>Private by default.</strong> Your learning style notes save in this browser on this device. They are not
        uploaded.
      </section>

      <div className="workbook-panels no-print">
        <aside className="section-tabs" aria-label="Learning style map sections">
          <button className={activePanel === "learn" ? "active" : ""} onClick={() => setActivePanel("learn")} type="button">
            <span>1</span>
            Understand styles
          </button>
          <button className={activePanel === "test" ? "active" : ""} onClick={() => setActivePanel("test")} type="button">
            <span>2</span>
            Reflect & test
          </button>
          <button
            className={activePanel === "takeaways" ? "active" : ""}
            onClick={() => setActivePanel("takeaways")}
            type="button"
          >
            <span>3</span>
            Take-away & notes
          </button>

          <div className="sidebar-tools">
            <button type="button" onClick={exportJson}>Export JSON</button>
            <label className="file-button">
              Import JSON
              <input type="file" accept="application/json" onChange={importJson} />
            </label>
            <button type="button" onClick={resetLearningStyleMap}>Reset learning map</button>
            {importError && <p className="error" role="alert">{importError}</p>}
            <p className="inline-save-status" aria-live="polite">{saveState}</p>
          </div>
        </aside>

        <div className="panel-stack">
          <section className="sensory-panel" hidden={activePanel !== "learn"} aria-labelledby="learn-style-title">
            <div className="sensory-panel-header">
              <div>
                <p className="eyebrow">Learning dimensions</p>
                <h2 id="learn-style-title">Learning style is more than input format</h2>
                <p className="prompt">
                  {"This map looks at several dimensions of learning.\nIt is not a fixed label.\nIt is a way to notice what makes learning clearer,\nmore available, and easier to use."}
                </p>
              </div>
              <div className="sensory-panel-actions">
                <button type="button" onClick={downloadLearningVotesJpg}>Save learning votes JPG</button>
                <button type="button" onClick={resetLearningVotes}>Reset learning votes</button>
              </div>
            </div>
            <div className="sensory-card-grid">
              {learningDimensions.map((dimension) => (
                <details
                  className="sensory-card learning-dimension-card"
                  key={dimension.id}
                  style={{ "--sense-color": dimension.color } as CSSProperties}
                >
                  <summary>
                    <div className="sense-mark learning-mark" aria-hidden="true" />
                    <h3>{dimension.title}</h3>
                    <p>{dimension.short}</p>
                    <small>{dimension.examples.join(", ")}</small>
                    <small>{dimension.notice}</small>
                    <span className="learning-card-toggle" aria-hidden="true">Open subtypes</span>
                  </summary>
                  <div className="learning-subtype-list">
                    {dimension.subtypes.map((subtype, index) => {
                      const subtypeId = `${dimension.id}-${index}`;

                      return (
                      <div
                        className={`learning-subtype ${votes[subtypeId] ? `vote-selected vote-${votes[subtypeId]}` : ""} ${
                          animatedVoteCard === subtypeId ? "voted" : ""
                        }`}
                        key={subtype.title}
                        style={{ "--sense-color": dimension.color } as CSSProperties}
                      >
                        <strong>{subtype.title}</strong>
                        <p>{subtype.description}</p>
                        <div className="card-vote-control">
                          <label>
                            Vote
                            <select
                              className={votes[subtypeId] ? `active vote-${votes[subtypeId]}` : ""}
                              value={votes[subtypeId]}
                              onChange={(event) => setVote(subtypeId, event.target.value as ResonanceVote)}
                            >
                              <option value="">Choose...</option>
                              {resonanceVotes.map((vote) => (
                                <option key={vote.id} value={vote.id}>
                                  {vote.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <button
                            hidden={!votes[subtypeId]}
                            onClick={() => setVote(subtypeId, votes[subtypeId])}
                            type="button"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="sensory-panel" hidden={activePanel !== "test"} aria-labelledby="learning-test-title">
            <p className="eyebrow">After learning</p>
            <h2 id="learning-test-title">Reflection time</h2>
            <p className="prompt">
              {"Before taking a test, pause with your own experience.\nThe goal is not to find one perfect label.\nNotice what feels familiar,\nwhat feels new,\nand what you may want to try."}
            </p>

            <div className="reflection-question-grid">
              {reflectionPrompts.map((reflectionPrompt) => (
                <label className="reflection-question-card" key={reflectionPrompt.id}>
                  <span>{reflectionPrompt.title}</span>
                  <small>{reflectionPrompt.prompt}</small>
                  <textarea
                    value={reflectionAnswers[reflectionPrompt.id]}
                    onChange={(event) => updateReflectionAnswer(reflectionPrompt.id, event.target.value)}
                    placeholder={reflectionPrompt.placeholder}
                  />
                </label>
              ))}
            </div>

            <div className="learning-test-intro">
              <p className="eyebrow">Self-understanding test</p>
              <h3 className="awareness-title">Take this test to understand yourself better</h3>
              <p>
                Open the full learning style test in a new tab, then come back here to write down anything useful.
              </p>
              <div className="sensory-panel-actions learning-test-actions">
                <a
                  className="test-link-button"
                  href="/workbook/learning_style_test"
                >
                  Open learning style test
                </a>
                <button type="button" onClick={downloadReflectionJpg}>Save reflection JPG</button>
                <button type="button" onClick={resetReflectionAnswers}>Reset reflection</button>
              </div>
            </div>
          </section>

          <section className="sensory-panel" hidden={activePanel !== "takeaways"} aria-labelledby="takeaways-title">
            <p className="eyebrow">Take-away</p>
            <h2 id="takeaways-title">What I can take from this</h2>

            <div className="support-grid">
              {learningDimensions.map((dimension) => (
                <article className="support-card" key={dimension.id}>
                  <h3>{dimension.title}</h3>
                  <p>{dimension.notice}</p>
                  <ul>
                    {takeaways[dimension.id].map((takeaway) => (
                      <li key={takeaway}>{takeaway}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <label className="sensory-notes">
              My notes
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Examples: what helps me learn, what makes learning harder, what I want teachers or teammates to know, one support I want to try."
              />
            </label>
          </section>
        </div>
      </div>
    </main>
  );
}
