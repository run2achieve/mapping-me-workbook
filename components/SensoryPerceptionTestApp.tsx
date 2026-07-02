"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";

type Mode = "lively" | "calm";
type Version = "short" | "full";
type Domain = "Vision" | "Hearing" | "Touch" | "Taste" | "Smell" | "Movement";
type Answer = 1 | 2 | 3 | 4 | undefined;

type SpqQuestion = {
  text: string;
  domain: Domain;
  reverse?: boolean;
};

const storageKey = "mapping-me-sensory-perception-test";

const domainMeta: Record<Domain, { color: string; helper: string }> = {
  Vision: { color: "#EE5A3A", helper: "Light, visual detail, patterns, glare, movement, and visual clutter." },
  Hearing: { color: "#166E66", helper: "Sound, volume, pitch, background noise, and location of sounds." },
  Touch: { color: "#6B4A9E", helper: "Texture, clothing, skin sensation, temperature, and light touch." },
  Taste: { color: "#F4A82C", helper: "Flavor, food texture, spice, aftertaste, and changes in familiar foods." },
  Smell: { color: "#C85C43", helper: "Scent detection, perfume, chemicals, smoke, food smells, and odor sensitivity." },
  Movement: { color: "#335F55", helper: "Motion, balance, vibration, body position, and changes in movement." }
};

const shortQuestions: SpqQuestion[] = [
  { text: "I notice small changes in the environment that others miss", domain: "Vision" },
  { text: "I am bothered by bright lights", domain: "Vision" },
  { text: "I notice patterns and details in things that others overlook", domain: "Vision" },
  { text: "Fluorescent lights bother me", domain: "Vision" },
  { text: "I am sensitive to visual distractions", domain: "Vision" },
  { text: "I notice sounds that others don't seem to hear", domain: "Hearing" },
  { text: "I can easily tune out background noises when I need to concentrate", domain: "Hearing", reverse: true },
  { text: "I am bothered by sudden loud noises", domain: "Hearing" },
  { text: "I can identify where sounds are coming from", domain: "Hearing" },
  { text: "I am sensitive to certain frequencies or pitches", domain: "Hearing" },
  { text: "I notice when electrical equipment is making noise", domain: "Hearing" },
  { text: "I am bothered by background noises", domain: "Hearing" },
  { text: "I am bothered by certain clothing textures", domain: "Touch" },
  { text: "I notice textures that others might miss", domain: "Touch" },
  { text: "I am sensitive to temperature changes", domain: "Touch" },
  { text: "I don't like being touched unexpectedly", domain: "Touch" },
  { text: "I am bothered by tags in clothing", domain: "Touch" },
  { text: "I can feel when my clothing is not quite right", domain: "Touch" },
  { text: "I am sensitive to light touch", domain: "Touch" },
  { text: "I notice when something feels different against my skin", domain: "Touch" },
  { text: "I have strong preferences about food textures", domain: "Taste" },
  { text: "I notice subtle flavors in food that others miss", domain: "Taste" },
  { text: "I am sensitive to spicy foods", domain: "Taste" },
  { text: "I can detect small changes in familiar foods", domain: "Taste" },
  { text: "I have very specific food preferences", domain: "Taste" },
  { text: "I notice smells that others don't seem to detect", domain: "Smell" },
  { text: "I am bothered by certain perfumes or scents", domain: "Smell" },
  { text: "I can identify what someone has been eating by smell", domain: "Smell" },
  { text: "Strong smells bother me", domain: "Smell" },
  { text: "I notice when someone is wearing perfume from far away", domain: "Smell" },
  { text: "I get motion sick easily", domain: "Movement" },
  { text: "I am sensitive to changes in movement or motion", domain: "Movement" },
  { text: "I notice when I'm not quite balanced", domain: "Movement" },
  { text: "I am bothered by rocking or swaying motions", domain: "Movement" },
  { text: "I have a good sense of where my body is in space", domain: "Movement" }
];

const fullQuestions: SpqQuestion[] = [
  ...shortQuestions.slice(0, 5),
  { text: "I see things that others miss", domain: "Vision" },
  { text: "I notice when someone gets a haircut", domain: "Vision" },
  { text: "I notice when furniture has been moved", domain: "Vision" },
  { text: "I am good at spotting errors in written material", domain: "Vision" },
  { text: "I notice small changes in people's appearance", domain: "Vision" },
  { text: "I am bothered by flickering lights", domain: "Vision" },
  { text: "I notice visual details in movies that others miss", domain: "Vision" },
  { text: "I am sensitive to glare", domain: "Vision" },
  { text: "I notice when colors don't match properly", domain: "Vision" },
  { text: "I am bothered by busy visual patterns", domain: "Vision" },
  ...shortQuestions.slice(5, 12),
  { text: "I can hear conversations from far away", domain: "Hearing" },
  { text: "I notice when someone is walking behind me", domain: "Hearing" },
  { text: "I am bothered by repetitive sounds", domain: "Hearing" },
  { text: "I can distinguish between similar sounds", domain: "Hearing" },
  { text: "I notice when appliances are running", domain: "Hearing" },
  { text: "I am sensitive to high-pitched sounds", domain: "Hearing" },
  { text: "I can identify people by their footsteps", domain: "Hearing" },
  { text: "I am bothered by ticking clocks", domain: "Hearing" },
  { text: "I notice when music is slightly out of tune", domain: "Hearing" },
  { text: "I hear sounds that interrupt my concentration", domain: "Hearing" },
  { text: "I can detect very quiet sounds", domain: "Hearing" },
  { text: "I am bothered by crowds because of the noise", domain: "Hearing" },
  { text: "I notice sound echoes in rooms", domain: "Hearing" },
  ...shortQuestions.slice(12, 20),
  { text: "I am bothered by certain fabrics", domain: "Touch" },
  { text: "I can feel very light touches", domain: "Touch" },
  { text: "I notice changes in air pressure", domain: "Touch" },
  { text: "I am sensitive to humidity", domain: "Touch" },
  { text: "I can feel when clothing seams are twisted", domain: "Touch" },
  { text: "I notice when someone barely touches me", domain: "Touch" },
  { text: "I am bothered by sticky or gooey textures", domain: "Touch" },
  { text: "I can distinguish between very similar textures", domain: "Touch" },
  { text: "I notice when my skin feels dry", domain: "Touch" },
  { text: "I am sensitive to different water temperatures", domain: "Touch" },
  { text: "I can feel tiny particles on my skin", domain: "Touch" },
  { text: "I notice when my hair is touching my skin", domain: "Touch" },
  ...shortQuestions.slice(20, 25),
  { text: "I can taste ingredients that others can't identify", domain: "Taste" },
  { text: "I notice when food tastes slightly different than usual", domain: "Taste" },
  { text: "I am sensitive to bitter tastes", domain: "Taste" },
  { text: "I can detect artificial flavors", domain: "Taste" },
  { text: "I notice aftertastes that others miss", domain: "Taste" },
  { text: "I am bothered by certain food textures in my mouth", domain: "Taste" },
  { text: "I can distinguish between very similar flavors", domain: "Taste" },
  ...shortQuestions.slice(25, 30),
  { text: "I can detect very faint odors", domain: "Smell" },
  { text: "I notice when someone has changed their soap or shampoo", domain: "Smell" },
  { text: "I am bothered by cleaning product smells", domain: "Smell" },
  { text: "I can identify locations by their smell", domain: "Smell" },
  { text: "I notice when food is starting to spoil by smell", domain: "Smell" },
  { text: "I am sensitive to chemical odors", domain: "Smell" },
  { text: "I can distinguish between very similar scents", domain: "Smell" },
  { text: "I notice body odors that others seem to miss", domain: "Smell" },
  { text: "I am bothered by smoke smells", domain: "Smell" },
  { text: "I can smell things cooking from far away", domain: "Smell" },
  ...shortQuestions.slice(30, 35),
  { text: "I can detect small changes in elevation", domain: "Movement" },
  { text: "I am sensitive to vibrations", domain: "Movement" },
  { text: "I notice when floors are slightly uneven", domain: "Movement" },
  { text: "I am bothered by elevator movements", domain: "Movement" },
  { text: "I can sense when a vehicle is accelerating or decelerating", domain: "Movement" }
];

const questionSets: Record<Version, SpqQuestion[]> = {
  short: shortQuestions,
  full: fullQuestions
};

function createAnswers(length: number): Answer[] {
  return new Array(length).fill(undefined);
}

function getSensitivityLevel(average: number) {
  if (average <= 2.0) return { label: "Low Sensitivity", className: "low" };
  if (average <= 2.5) return { label: "Typical Sensitivity", className: "typical" };
  if (average <= 3.5) return { label: "High Sensitivity", className: "high" };
  return { label: "Very High Sensitivity", className: "very-high" };
}

export function SensoryPerceptionTestApp() {
  const [mode, setMode] = useState<Mode>("lively");
  const [selectedVersion, setSelectedVersion] = useState<Version | "">("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [stage, setStage] = useState<"welcome" | "test" | "results">("welcome");
  const [saveState, setSaveState] = useState("Saved on this device");

  const currentQuestions = selectedVersion ? questionSets[selectedVersion] : [];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const answeredCount = answers.filter((answer) => answer !== undefined).length;
  const questionProgress = currentQuestions.length ? ((currentQuestionIndex + 1) / currentQuestions.length) * 100 : 0;
  const answerProgress = currentQuestions.length ? (answeredCount / currentQuestions.length) * 100 : 0;

  const domainScores = useMemo(() => {
    const initial = Object.fromEntries(
      Object.keys(domainMeta).map((domain) => [domain, { title: domain, total: 0, count: 0, average: 0 }])
    ) as Record<Domain, { title: Domain; total: number; count: number; average: number }>;

    currentQuestions.forEach((question, index) => {
      const rawAnswer = answers[index];
      if (rawAnswer === undefined) return;
      const score = question.reverse ? 5 - rawAnswer : rawAnswer;
      initial[question.domain].total += score;
      initial[question.domain].count += 1;
    });

    Object.values(initial).forEach((domain) => {
      domain.average = domain.count ? domain.total / domain.count : 0;
    });

    return initial;
  }, [answers, currentQuestions]);

  const totalScore = Object.values(domainScores).reduce((sum, domain) => sum + domain.total, 0);
  const overallAverage = answeredCount ? totalScore / answeredCount : 0;

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as {
        mode?: Mode;
        selectedVersion?: Version;
        currentQuestionIndex?: number;
        answers?: Answer[];
        stage?: "welcome" | "test" | "results";
      };
      setMode(parsed.mode === "calm" ? "calm" : "lively");
      if (parsed.selectedVersion === "short" || parsed.selectedVersion === "full") {
        const length = questionSets[parsed.selectedVersion].length;
        const nextAnswers = createAnswers(length);
        parsed.answers?.slice(0, length).forEach((answer, index) => {
          nextAnswers[index] = answer === 1 || answer === 2 || answer === 3 || answer === 4 ? answer : undefined;
        });
        setSelectedVersion(parsed.selectedVersion);
        setAnswers(nextAnswers);
        setCurrentQuestionIndex(
          typeof parsed.currentQuestionIndex === "number"
            ? Math.min(Math.max(parsed.currentQuestionIndex, 0), length - 1)
            : 0
        );
        setStage(parsed.stage === "test" || parsed.stage === "results" ? parsed.stage : "welcome");
      }
    } catch {
      setSaveState("Could not load saved SPQ");
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
        JSON.stringify({ mode, selectedVersion, currentQuestionIndex, answers, stage })
      );
      setSaveState("Saved on this device");
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [mode, selectedVersion, currentQuestionIndex, answers, stage]);

  function startTest() {
    if (!selectedVersion) return;
    setAnswers(createAnswers(questionSets[selectedVersion].length));
    setCurrentQuestionIndex(0);
    setStage("test");
  }

  function setAnswer(value: Answer) {
    setAnswers((current) => current.map((answer, index) => (index === currentQuestionIndex ? value : answer)));
  }

  function resetTest() {
    if (!window.confirm("Reset your SPQ answers on this device?")) return;
    setSelectedVersion("");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setStage("welcome");
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
    words.forEach((word) => {
      const testLine = line ? `${line} ${word}` : word;
      if (context.measureText(testLine).width > maxWidth && line) {
        context.fillText(line, x, currentY);
        line = word;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    });
    if (line) context.fillText(line, x, currentY);
  }

  function downloadSpqJpg() {
    const scale = 2;
    const width = 1320;
    const margin = 56;
    const innerX = 92;
    const innerWidth = width - innerX * 2;
    const height = 1180;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(scale, scale);
    context.fillStyle = mode === "calm" ? "#ECE4D6" : "#F3E8D2";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#2A2521";
    context.lineWidth = 3;
    context.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    context.fillStyle = "#2A2521";
    context.font = "700 54px Arial";
    context.fillText("Sensory Perception Quotient", innerX, 126);
    context.font = "400 22px Arial";
    context.fillStyle = "#6B6457";
    context.fillText(`SPQ-${selectedVersion === "short" ? "35" : "92"} | ${answeredCount} answered`, innerX, 168);

    context.font = "700 30px Arial";
    context.fillStyle = "#2A2521";
    context.fillText("Sensory domain profile", innerX, 235);

    Object.values(domainScores).forEach((domain, index) => {
      const y = 285 + index * 112;
      const level = getSensitivityLevel(domain.average);
      context.fillStyle = "#FFF9EC";
      context.strokeStyle = "#2A2521";
      context.lineWidth = 3;
      context.fillRect(innerX, y, innerWidth, 84);
      context.strokeRect(innerX, y, innerWidth, 84);
      context.fillStyle = "#2A2521";
      context.font = "700 24px Arial";
      context.fillText(domain.title, innerX + 24, y + 34);
      context.font = "400 20px Arial";
      context.fillText(`${domain.average.toFixed(1)}/4.0 | ${level.label}`, innerX + 24, y + 64);
    });

    context.font = "700 28px Arial";
    context.fillText("Reference", innerX, 1010);
    context.font = "400 18px Arial";
    context.fillStyle = "#6B6457";
    drawWrappedText(
      context,
      "Ritvo, R. A., Ritvo, E. R., Guthrie, D., et al. (2011). The Sensory Perception Quotient (SPQ): Development and validation of a new sensory questionnaire for adults with and without autism. Molecular Autism, 2, 28. DOI: 10.1186/2040-2392-2-28",
      innerX,
      1052,
      innerWidth,
      26
    );

    const link = document.createElement("a");
    link.download = "mapping-me-sensory-perception-quotient.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  function getOverallInterpretation() {
    if (overallAverage <= 2.0) {
      return {
        level: "Low Sensory Sensitivity",
        text: "Your responses suggest relatively low sensory sensitivity across most answered domains."
      };
    }
    if (overallAverage <= 2.5) {
      return {
        level: "Typical Sensory Sensitivity",
        text: "Your responses suggest typical sensory sensitivity."
      };
    }
    if (overallAverage <= 3.5) {
      return {
        level: "High Sensory Sensitivity",
        text: "Your responses suggest higher than typical sensory sensitivity across several domains."
      };
    }
    return {
      level: "Very High Sensory Sensitivity",
      text: "Your responses suggest very high sensory sensitivity across multiple domains."
    };
  }

  const overallInterpretation = getOverallInterpretation();

  return (
    <main className="shell sensory-shell" translate="no">
      <header className="topbar no-print">
        <div>
          <p className="eyebrow">Mapping Me</p>
          <h1>Sensory Perception Quotient</h1>
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
        <strong>Private by default.</strong> Your SPQ answers save in this browser on this device. They are not uploaded.
      </section>

      <section className="sensory-panel spq-page no-print" aria-labelledby="spq-title">
        {stage === "welcome" && (
          <>
            <div className="sensory-panel-header">
              <div>
                <p className="eyebrow">SPQ Assessment</p>
                <h2 id="spq-title">Select a version</h2>
                <p className="prompt">
                  {"This questionnaire measures sensory perception differences in adults.\nSelect the version you would like to complete."}
                </p>
              </div>
              <div className="sensory-panel-actions">
                <button type="button" onClick={downloadSpqJpg}>Save SPQ JPG</button>
                <button type="button" onClick={resetTest}>Reset SPQ</button>
              </div>
            </div>

            <div className="spq-version-grid">
              {[
                { id: "short" as const, title: "SPQ-35", description: "Short version, 35 questions" },
                { id: "full" as const, title: "SPQ-92", description: "Full version, 92 questions" }
              ].map((version) => (
                <button
                  className={selectedVersion === version.id ? "active" : ""}
                  key={version.id}
                  onClick={() => setSelectedVersion(version.id)}
                  type="button"
                >
                  <strong>{version.title}</strong>
                  <span>{version.description}</span>
                </button>
              ))}
            </div>
            <div className="panel-actions">
              <button disabled={!selectedVersion} onClick={startTest} type="button">
                Start assessment
              </button>
            </div>
          </>
        )}

        {stage === "test" && currentQuestion && (
          <>
            <div className="sensory-panel-header">
              <div>
                <p className="eyebrow">Sensory Perception Assessment</p>
                <h2>Rate how much each statement applies to you</h2>
              </div>
              <div className="sensory-panel-actions">
                <button type="button" onClick={downloadSpqJpg}>Save SPQ JPG</button>
                <button type="button" onClick={resetTest}>Reset SPQ</button>
              </div>
            </div>

            <div className="spq-progress" aria-live="polite">
              <div className="spq-progress-bar">
                <span style={{ width: `${questionProgress}%` }} />
              </div>
              <p>{Math.round(questionProgress)}% complete</p>
            </div>

            <article className="spq-question-card">
              <p className="question-number">Question {currentQuestionIndex + 1} of {currentQuestions.length}</p>
              <h3>{currentQuestion.text}</h3>
              <div className="spq-options">
                {[1, 2, 3, 4].map((value) => (
                  <button
                    aria-pressed={answers[currentQuestionIndex] === value}
                    className={answers[currentQuestionIndex] === value ? "active" : ""}
                    key={value}
                    onClick={() => setAnswer(value as Answer)}
                    type="button"
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="spq-scale-labels">
                <span>Definitely disagree</span>
                <span>Slightly disagree</span>
                <span>Slightly agree</span>
                <span>Definitely agree</span>
              </div>
            </article>

            <div className="ils-navigation">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((current) => Math.max(current - 1, 0))}
                type="button"
              >
                Previous
              </button>
              {currentQuestionIndex === currentQuestions.length - 1 ? (
                <button
                  disabled={answers[currentQuestionIndex] === undefined}
                  onClick={() => setStage("results")}
                  type="button"
                >
                  View Results
                </button>
              ) : (
                <button
                  disabled={answers[currentQuestionIndex] === undefined}
                  onClick={() => setCurrentQuestionIndex((current) => Math.min(current + 1, currentQuestions.length - 1))}
                  type="button"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}

        {stage === "results" && (
          <>
            <div className="sensory-panel-header">
              <div>
                <p className="eyebrow">Results</p>
                <h2>Your SPQ results</h2>
                <p className="prompt">Sensory Perception Assessment Summary</p>
              </div>
              <div className="sensory-panel-actions">
                <button type="button" onClick={downloadSpqJpg}>Save SPQ JPG</button>
                <button type="button" onClick={resetTest}>Take assessment again</button>
              </div>
            </div>

            <div className="spq-radar" aria-label="Sensory domain averages">
              {Object.values(domainScores).map((domain) => {
                const percent = domain.average ? (domain.average / 4) * 100 : 0;
                return (
                  <div className="spq-radar-row" key={domain.title}>
                    <strong>{domain.title}</strong>
                    <span>
                      <i
                        style={
                          {
                            "--sense-color": domainMeta[domain.title].color,
                            width: `${percent}%`
                          } as CSSProperties
                        }
                      />
                    </span>
                    <em>{domain.average ? domain.average.toFixed(1) : "0.0"}</em>
                  </div>
                );
              })}
            </div>

            <div className="spq-score-grid">
              <article className="spq-score-card total">
                <h3>Total SPQ Score</h3>
                <strong>{totalScore}/{currentQuestions.length * 4}</strong>
                <p>Overall sensory sensitivity: {overallAverage.toFixed(1)}/4.0</p>
              </article>
              {Object.values(domainScores).map((domain) => {
                const level = getSensitivityLevel(domain.average);
                return (
                  <article className="spq-score-card" key={domain.title}>
                    <h3>{domain.title}</h3>
                    <strong>{domain.average ? domain.average.toFixed(1) : "0.0"}/4.0</strong>
                    <p className={level.className}>{level.label}</p>
                  </article>
                );
              })}
            </div>

            <section className="spq-interpretation">
              <h3>Overall Assessment</h3>
              <p><strong>Version completed:</strong> SPQ-{selectedVersion === "short" ? "35" : "92"}</p>
              <p><strong>Total score:</strong> {totalScore}/{currentQuestions.length * 4}</p>
              <p><strong>Average score:</strong> {overallAverage.toFixed(1)}/4.0</p>
              <p><strong>Level:</strong> {overallInterpretation.level}</p>
              <p>{overallInterpretation.text}</p>

              <h3>Score interpretation</h3>
              <ul>
                <li><strong>1.0-2.0:</strong> Low sensitivity</li>
                <li><strong>2.0-2.5:</strong> Typical sensitivity</li>
                <li><strong>2.5-3.5:</strong> High sensitivity</li>
                <li><strong>3.5-4.0:</strong> Very high sensitivity</li>
              </ul>

              <div className="disclaimer">
                <strong>Important disclaimer:</strong> This assessment is for informational and educational purposes
                only. It should not be used for self-diagnosis or as a substitute for professional clinical evaluation.
              </div>

              <h3>Reference</h3>
              <p>
                Ritvo, R. A., Ritvo, E. R., Guthrie, D., et al. (2011). The Sensory Perception Quotient (SPQ):
                Development and validation of a new sensory questionnaire for adults with and without autism.
                <em> Molecular Autism</em>, 2, 28. DOI: 10.1186/2040-2392-2-28
              </p>
            </section>
          </>
        )}

        <p className="inline-save-status" aria-live="polite">{saveState}</p>
      </section>
    </main>
  );
}
