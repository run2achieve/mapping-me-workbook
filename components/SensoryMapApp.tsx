"use client";

import { ChangeEvent, useEffect, useState } from "react";

type PanelId = "learn" | "profile" | "supports";
type Mode = "lively" | "calm";
type ProfileLevel = "low" | "mixed" | "high" | "";
type ResonanceVote = "me" | "maybe" | "neutral" | "";

type SensoryProfile = Record<string, ProfileLevel>;
type SensoryVotes = Record<string, ResonanceVote>;
type SensoryComments = Record<string, string>;
type SupportComments = Record<string, string>;
type SensoryMapData = {
  profile: SensoryProfile;
  profileComments: SensoryComments;
  supportComments: SupportComments;
  votes: SensoryVotes;
  learnNotes: string;
  notes: string;
  supportNotes: string;
  mode: Mode;
};

const storageKey = "mapping-me-sensory-map";

const senses = [
  {
    id: "visual",
    title: "Visual",
    short: "Light, color, patterns, movement, and visual clutter.",
    notice: "Screens, fluorescent lights, busy rooms, tiny details, sudden movement.",
    color: "#EE5A3A"
  },
  {
    id: "auditory",
    title: "Auditory",
    short: "Sound volume, tone, rhythm, background noise, and surprise sounds.",
    notice: "Alarms, overlapping voices, humming appliances, music, silence.",
    color: "#166E66"
  },
  {
    id: "tactile",
    title: "Tactile",
    short: "Touch, texture, pressure, temperature, clothing, and skin sensations.",
    notice: "Tags, seams, hair, hugs, sticky hands, heat, cold, light touch.",
    color: "#6B4A9E"
  },
  {
    id: "vestibular",
    title: "Vestibular",
    short: "Balance, spinning, swinging, speed, and head position.",
    notice: "Car rides, escalators, swings, leaning back, quick turns, dizziness.",
    color: "#F4A82C"
  },
  {
    id: "proprioceptive",
    title: "Proprioceptive",
    short: "Body position, pressure, weight, force, and muscle feedback.",
    notice: "Pushing, carrying, stretching, pressure, bumping into things.",
    color: "#FF8FB1"
  },
  {
    id: "interoceptive",
    title: "Interoceptive",
    short: "Inside-body signals like hunger, thirst, pain, heartbeat, and fatigue.",
    notice: "Forgetting to eat, noticing pain late, sudden overwhelm, body check-ins.",
    color: "#335F55"
  },
  {
    id: "taste-smell",
    title: "Taste & smell",
    short: "Flavors, food textures, smells, nausea, and scent memories.",
    notice: "Perfume, cooking smells, toothpaste, food texture, aftertaste.",
    color: "#C85C43"
  }
];

const profileLevels: Array<{
  id: Exclude<ProfileLevel, "">;
  title: string;
  helper: string;
}> = [
  { id: "low", title: "Often avoid", helper: "This input often costs energy or feels too much." },
  { id: "mixed", title: "Depends", helper: "Context, timing, or control changes the experience." },
  { id: "high", title: "Often seek", helper: "This input often helps you feel regulated or present." }
];

const resonanceVotes: Array<{
  id: Exclude<ResonanceVote, "">;
  label: string;
}> = [
  { id: "me", label: "This is me" },
  { id: "maybe", label: "Maybe me" },
  { id: "neutral", label: "Not me" }
];

const supportIdeas = [
  {
    id: "visual",
    sense: "Visual",
    try: ["Softer lighting", "A less busy desk", "Screen brightness that feels easier", "One clear focus area"],
    watch: "Bright or flickering light can drain energy before it feels obvious."
  },
  {
    id: "auditory",
    sense: "Auditory",
    try: ["Quieter background sound", "A short quiet break", "Clear warning before loud sounds", "Captions when helpful"],
    watch: "Layered sound can make simple tasks feel much harder."
  },
  {
    id: "tactile",
    sense: "Tactile",
    try: ["Clothes that feel comfortable", "Fewer irritating textures", "A preferred blanket or layer", "A backup outfit for long days"],
    watch: "Small tactile irritations can become big when tired or stressed."
  },
  {
    id: "vestibular",
    sense: "Vestibular",
    try: ["Slower transitions", "A stable seat", "Gentle movement breaks", "Warning before sudden movement"],
    watch: "Balance input can be calming for some people and nauseating for others."
  },
  {
    id: "proprioceptive",
    sense: "Proprioceptive",
    try: ["A short walk", "Stretching in a comfortable way", "Holding something grounding", "Tasks that use the body gently"],
    watch: "Body feedback can help when thoughts feel scattered or floaty."
  },
  {
    id: "interoceptive",
    sense: "Interoceptive",
    try: ["Simple body check-ins", "Water and snack reminders", "Noticing pain or fatigue earlier", "A personal energy scale"],
    watch: "Body signals may arrive late, quietly, or all at once."
  },
  {
    id: "taste-smell",
    sense: "Taste & smell",
    try: ["Lower-scent spaces", "Reliable foods", "Texture choices that feel okay", "Fresh air when smells build up"],
    watch: "Smell and taste can strongly affect focus, nausea, and mood."
  }
];

function createEmptyProfile(): SensoryProfile {
  return Object.fromEntries(senses.map((sense) => [sense.id, ""])) as SensoryProfile;
}

function createEmptyVotes(): SensoryVotes {
  return Object.fromEntries(senses.map((sense) => [sense.id, ""])) as SensoryVotes;
}

function createEmptyComments(): SensoryComments {
  return Object.fromEntries(senses.map((sense) => [sense.id, ""])) as SensoryComments;
}

function createEmptySupportComments(): SupportComments {
  return Object.fromEntries(supportIdeas.map((support) => [support.id, ""])) as SupportComments;
}

export function SensoryMapApp() {
  const [activePanel, setActivePanel] = useState<PanelId>("learn");
  const [mode, setMode] = useState<Mode>("lively");
  const [profile, setProfile] = useState<SensoryProfile>(() => createEmptyProfile());
  const [profileComments, setProfileComments] = useState<SensoryComments>(() => createEmptyComments());
  const [supportComments, setSupportComments] = useState<SupportComments>(() => createEmptySupportComments());
  const [votes, setVotes] = useState<SensoryVotes>(() => createEmptyVotes());
  const [animatedVoteCard, setAnimatedVoteCard] = useState("");
  const [learnNotes, setLearnNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [supportNotes, setSupportNotes] = useState("");
  const [saveState, setSaveState] = useState("Saved on this device");
  const [importError, setImportError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as {
        profile?: SensoryProfile;
        profileComments?: SensoryComments;
        supportComments?: SupportComments;
        votes?: SensoryVotes;
        learnNotes?: string;
        notes?: string;
        supportNotes?: string;
        mode?: Mode;
      };
      setProfile({ ...createEmptyProfile(), ...parsed.profile });
      setProfileComments({ ...createEmptyComments(), ...parsed.profileComments });
      setSupportComments({ ...createEmptySupportComments(), ...parsed.supportComments });
      setVotes({ ...createEmptyVotes(), ...parsed.votes });
      setLearnNotes(parsed.learnNotes ?? "");
      setNotes(parsed.notes ?? "");
      setSupportNotes(parsed.supportNotes ?? "");
      setMode(parsed.mode === "calm" ? "calm" : "lively");
    } catch {
      setSaveState("Could not load saved sensory map");
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
        JSON.stringify({ profile, profileComments, supportComments, votes, learnNotes, notes, supportNotes, mode })
      );
      setSaveState("Saved on this device");
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [profile, profileComments, supportComments, votes, learnNotes, notes, supportNotes, mode]);

  function setProfileLevel(senseId: string, level: ProfileLevel) {
    setProfile((current) => ({
      ...current,
      [senseId]: current[senseId] === level ? "" : level
    }));
  }

  function updateProfileComment(senseId: string, value: string) {
    setProfileComments((current) => ({
      ...current,
      [senseId]: value
    }));
  }

  function updateSupportComment(supportId: string, value: string) {
    setSupportComments((current) => ({
      ...current,
      [supportId]: value
    }));
  }

  function setVote(senseId: string, vote: ResonanceVote) {
    setVotes((current) => ({
      ...current,
      [senseId]: current[senseId] === vote ? "" : vote
    }));
    setAnimatedVoteCard(senseId);
    window.setTimeout(() => setAnimatedVoteCard(""), 650);
  }

  function getSensoryMapData(): SensoryMapData {
    return {
      profile,
      profileComments,
      supportComments,
      votes,
      learnNotes,
      notes,
      supportNotes,
      mode
    };
  }

  function applySensoryMapData(data: Partial<SensoryMapData>) {
    setProfile({ ...createEmptyProfile(), ...data.profile });
    setProfileComments({ ...createEmptyComments(), ...data.profileComments });
    setSupportComments({ ...createEmptySupportComments(), ...data.supportComments });
    setVotes({ ...createEmptyVotes(), ...data.votes });
    setLearnNotes(typeof data.learnNotes === "string" ? data.learnNotes : "");
    setNotes(typeof data.notes === "string" ? data.notes : "");
    setSupportNotes(typeof data.supportNotes === "string" ? data.supportNotes : "");
    setMode(data.mode === "calm" ? "calm" : "lively");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(getSensoryMapData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mapping-me-sensory-map.json";
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
          throw new Error("That JSON file does not look like a sensory map.");
        }

        applySensoryMapData(parsed as Partial<SensoryMapData>);
      })
      .catch(() => setImportError("Could not import that JSON file."))
      .finally(() => {
        event.target.value = "";
      });
  }

  function resetSensoryMap() {
    if (!window.confirm("Reset your sensory map on this device?")) {
      return;
    }

    setProfile(createEmptyProfile());
    setProfileComments(createEmptyComments());
    setSupportComments(createEmptySupportComments());
    setVotes(createEmptyVotes());
    setLearnNotes("");
    setNotes("");
    setSupportNotes("");
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

  function downloadSensoryMapJpg() {
    const scale = 2;
    const width = 1320;
    const margin = 56;
    const innerX = 92;
    const innerWidth = width - innerX * 2;
    const cardGap = 24;
    const cardWidth = (innerWidth - cardGap * 2) / 3;
    const cardHeight = 430;
    const height = 1040;
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
    context.font = "700 58px Arial";
    context.fillText("Mapping Me Sensory Map", innerX, 128);
    context.font = "400 22px Arial";
    context.fillStyle = "#6B6457";
    context.fillText("Understand sensory: my card votes and notes.", innerX, 170);

    let y = 230;
    context.font = "700 30px Arial";
    context.fillStyle = "#2A2521";
    context.fillText("My sensory card conclusions", innerX, y);
    y += 34;

    const voteGroups = [
      { title: "This is me", vote: "me", fill: mode === "calm" ? "#6C8981" : "#166E66", text: "#FFF9EC" },
      { title: "Maybe me", vote: "maybe", fill: mode === "calm" ? "#D6C7A8" : "#F4A82C", text: "#2A2521" },
      { title: "Not me", vote: "neutral", fill: mode === "calm" ? "#E8DCC2" : "#F8EDD9", text: "#2A2521" }
    ];

    voteGroups.forEach((group, index) => {
      const x = innerX + index * (cardWidth + cardGap);
      const selectedSenses = senses.filter((sense) => votes[sense.id] === group.vote).map((sense) => sense.title);
      context.fillStyle = group.fill;
      context.strokeStyle = "#2A2521";
      context.lineWidth = 3;
      context.fillRect(x, y, cardWidth, cardHeight);
      context.strokeRect(x, y, cardWidth, cardHeight);
      context.fillStyle = group.text;
      context.font = "700 28px Arial";
      context.fillText(group.title, x + 28, y + 52);
      context.font = "400 22px Arial";
      drawWrappedText(context, selectedSenses.length ? selectedSenses.join(", ") : "Blank for now.", x + 28, y + 96, cardWidth - 56, 34);
    });

    y += cardHeight + 58;
    const noteHeight = 230;
    context.fillStyle = "#FFF9EC";
    context.strokeStyle = "#2A2521";
    context.lineWidth = 3;
    context.fillRect(innerX, y, innerWidth, noteHeight);
    context.strokeRect(innerX, y, innerWidth, noteHeight);
    context.fillStyle = "#2A2521";
    context.font = "700 28px Arial";
    context.fillText("Notes while learning about my sensory systems", innerX + 28, y + 52);
    context.font = "400 22px Arial";
    drawWrappedText(context, learnNotes || "Blank for now.", innerX + 28, y + 96, innerWidth - 56, 32);

    const link = document.createElement("a");
    link.download = "mapping-me-sensory-card-conclusions.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  function downloadProfileTestJpg() {
    const scale = 2;
    const width = 1320;
    const margin = 56;
    const innerX = 92;
    const innerWidth = width - innerX * 2;
    const rowHeight = 118;
    const rowsTop = 254;
    const rowsHeight = rowHeight * senses.length;
    const height = rowsTop + rowsHeight + 96;
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
    context.fillText("Your sensory profile", innerX, 126);
    context.font = "700 26px Arial";
    context.fillStyle = mode === "calm" ? "#6C8981" : "#166E66";
    context.fillText("Awareness check", innerX, 168);
    context.font = "400 22px Arial";
    context.fillStyle = "#6B6457";
    context.fillText("How does your sensory profile impact you?", innerX, 204);

    senses.forEach((sense, index) => {
      const y = rowsTop + index * rowHeight;
      const level = profileLevels.find((item) => item.id === profile[sense.id])?.title ?? "Blank";
      const comment = profileComments[sense.id] || "Blank for now.";

      context.fillStyle = index % 2 === 0 ? "#FFF9EC" : "#F8EDD9";
      context.strokeStyle = "#2A2521";
      context.lineWidth = 2;
      context.fillRect(innerX, y, innerWidth, rowHeight);
      context.strokeRect(innerX, y, innerWidth, rowHeight);
      context.fillStyle = mode === "calm" ? "#6C8981" : sense.color;
      context.beginPath();
      context.arc(innerX + 30, y + 35, 11, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = "#2A2521";
      context.font = "700 22px Arial";
      context.fillText(sense.title, innerX + 56, y + 42);
      context.font = "700 20px Arial";
      context.fillText(level, innerX + 360, y + 42);
      context.font = "400 19px Arial";
      context.fillStyle = "#2A2521";
      drawWrappedText(context, comment, innerX + 56, y + 76, innerWidth - 92, 25);
    });

    const link = document.createElement("a");
    link.download = "mapping-me-sensory-profile.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  return (
    <main className="shell sensory-shell" translate="no">
      <header className="topbar no-print">
        <div>
          <p className="eyebrow">Mapping Me</p>
          <h1>Sensory Map</h1>
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
        <strong>Private by default.</strong> Your sensory notes save in this browser on this device. They are not
        uploaded.
      </section>

      <div className="workbook-panels no-print">
        <aside className="section-tabs" aria-label="Sensory map sections">
          <button className={activePanel === "learn" ? "active" : ""} onClick={() => setActivePanel("learn")} type="button">
            <span>1</span>
            Understand sensory
          </button>
          <button
            className={activePanel === "profile" ? "active" : ""}
            onClick={() => setActivePanel("profile")}
            type="button"
          >
            <span>2</span>
            Sensory profile
          </button>
          <button
            className={activePanel === "supports" ? "active" : ""}
            onClick={() => setActivePanel("supports")}
            type="button"
          >
            <span>3</span>
            Sensory supports
          </button>

          <div className="sidebar-tools">
            <button type="button" onClick={exportJson}>Export JSON</button>
            <label className="file-button">
              Import JSON
              <input type="file" accept="application/json" onChange={importJson} />
            </label>
            {importError && <p className="error" role="alert">{importError}</p>}
            <p className="inline-save-status" aria-live="polite">{saveState}</p>
          </div>
        </aside>

        <div className="panel-stack">
          <section className="sensory-panel" hidden={activePanel !== "learn"} aria-labelledby="learn-sensory-title">
            <div className="sensory-panel-header">
              <div>
                <p className="eyebrow">Sensory systems</p>
                <h2 id="learn-sensory-title">Exploring different sensory channels</h2>
                <p className="prompt">
                  This is not a test or diagnosis. It is a way to notice which inputs cost energy, which ones help, and
                  which ones depend on context.
                </p>
              </div>
              <div className="sensory-panel-actions">
                <button type="button" onClick={downloadSensoryMapJpg}>Save sensory map JPG</button>
                <button type="button" onClick={resetSensoryMap}>Reset sensory map</button>
              </div>
            </div>
            <div className="sensory-card-grid">
              {senses.map((sense) => (
                <article
                  className={`sensory-card ${votes[sense.id] ? `vote-selected vote-${votes[sense.id]}` : ""} ${
                    animatedVoteCard === sense.id ? "voted" : ""
                  }`}
                  key={sense.id}
                  style={{ "--sense-color": sense.color } as React.CSSProperties}
                >
                  <div className="sense-mark" aria-hidden="true" />
                  <h3>{sense.title}</h3>
                  <p>{sense.short}</p>
                  <small>{sense.notice}</small>
                  <div className="card-vote-control">
                    <label>
                      Vote
                      <select
                        className={votes[sense.id] ? `active vote-${votes[sense.id]}` : ""}
                        value={votes[sense.id]}
                        onChange={(event) => setVote(sense.id, event.target.value as ResonanceVote)}
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
                      hidden={!votes[sense.id]}
                      onClick={() => setVote(sense.id, votes[sense.id])}
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <label className="sensory-notes">
              Notes while learning about my sensory systems
              <textarea
                value={learnNotes}
                onChange={(event) => setLearnNotes(event.target.value)}
                placeholder="What feels familiar? What do you want to observe this week?"
              />
            </label>
          </section>

          <section className="sensory-panel" hidden={activePanel !== "profile"} aria-labelledby="profile-title">
            <div className="sensory-panel-header">
              <div>
                <p className="eyebrow">Sensory profile</p>
                <h2 id="profile-title">Your sensory profile</h2>
                <h3 className="awareness-title">Awareness check</h3>
                <p className="prompt">
                  How does your sensory profile impact you? Pick what is most true right now, then add a short comment
                  under each sensory channel.
                </p>
              </div>
              <button type="button" onClick={downloadProfileTestJpg}>Save sensory profile JPG</button>
            </div>

            <div className="sensory-test">
              {senses.map((sense) => (
                <fieldset className="sensory-test-row" key={sense.id}>
                  <legend>
                    <span className="sense-dot" style={{ "--sense-color": sense.color } as React.CSSProperties} />
                    {sense.title}
                  </legend>
                  <div>
                    {profileLevels.map((level) => (
                      <button
                        className={profile[sense.id] === level.id ? "active" : ""}
                        key={level.id}
                        onClick={() => setProfileLevel(sense.id, level.id)}
                        type="button"
                      >
                        <strong>{level.title}</strong>
                        <span>{level.helper}</span>
                      </button>
                    ))}
                  </div>
                  <label className="profile-comment">
                    Comment
                    <textarea
                      value={profileComments[sense.id]}
                      onChange={(event) => updateProfileComment(sense.id, event.target.value)}
                      placeholder={`How does ${sense.title.toLowerCase()} input affect your energy, focus, comfort, or choices?`}
                    />
                  </label>
                </fieldset>
              ))}
            </div>

            <div className="learning-test-intro sensory-profile-test-link">
              <p className="eyebrow">Self-understanding test</p>
              <h3 className="awareness-title">Take the Sensory Perception Quotient</h3>
              <p>
                Open the SPQ assessment in a workbook-styled page, then come back here to connect the result with your
                own sensory profile notes.
              </p>
              <a className="test-link-button" href="/workbook/sensory_perception_test">
                Open sensory perception test
              </a>
            </div>
          </section>

          <section className="sensory-panel" hidden={activePanel !== "supports"} aria-labelledby="supports-title">
            <p className="eyebrow">Supports</p>
            <h2 id="supports-title">Things to notice and try</h2>
            <p className="prompt">
              These are starting points, not rules. The useful question is: does this make the environment easier to
              be in?
            </p>
            <div className="support-grid">
              {supportIdeas.map((support) => (
                <article className="support-card" key={support.id}>
                  <h3>{support.sense}</h3>
                  <p>{support.watch}</p>
                  <ul>
                    {support.try.map((idea) => (
                      <li key={idea}>{idea}</li>
                    ))}
                  </ul>
                  <label className="support-note">
                    Notes
                    <textarea
                      value={supportComments[support.id]}
                      onChange={(event) => updateSupportComment(support.id, event.target.value)}
                      placeholder="What do I want to try? What helps, what does not, and when?"
                    />
                  </label>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
