"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "lively" | "calm";
type Answer = "a" | "b" | null;
type Dimension = "AR" | "SI" | "VV" | "SG";

type Question = {
  text: string;
  optionA: string;
  optionB: string;
  dimension: Dimension;
};

const storageKey = "mapping-me-learning-style-test";

const questions: Question[] = [
  { text: "I understand something better after I", optionA: "try it out", optionB: "think it through", dimension: "AR" },
  { text: "I would rather be considered", optionA: "realistic", optionB: "innovative", dimension: "SI" },
  { text: "When I think about what I did yesterday, I am most likely to get", optionA: "a picture", optionB: "words", dimension: "VV" },
  { text: "I tend to", optionA: "understand details of a subject but may be fuzzy about its overall structure", optionB: "understand the overall structure but may be fuzzy about details", dimension: "SG" },
  { text: "When I am learning something new, it helps me to", optionA: "talk about it", optionB: "think about it", dimension: "AR" },
  { text: "If I were a teacher, I would rather teach a course", optionA: "that deals with facts and real life situations", optionB: "that deals with ideas and theories", dimension: "SI" },
  { text: "I prefer to get new information in", optionA: "pictures, diagrams, graphs, or maps", optionB: "written directions or verbal information", dimension: "VV" },
  { text: "Once I understand", optionA: "all the parts, I understand the whole thing", optionB: "the whole thing, I see how the parts fit", dimension: "SG" },
  { text: "In a study group working on difficult material, I am more likely to", optionA: "jump in and contribute ideas", optionB: "sit back and listen", dimension: "AR" },
  { text: "I find it easier", optionA: "to learn facts", optionB: "to learn concepts", dimension: "SI" },
  { text: "In a book with lots of pictures and charts, I am likely to", optionA: "look over the pictures and charts carefully", optionB: "focus on the written text", dimension: "VV" },
  { text: "When I solve math problems", optionA: "I usually work my way to the solutions one step at a time", optionB: "I often just see the solutions but then have to struggle to figure out the steps", dimension: "SG" },
  { text: "In classes I have taken", optionA: "I have usually gotten to know many of the students", optionB: "I have rarely gotten to know many of the students", dimension: "AR" },
  { text: "In reading nonfiction, I prefer", optionA: "something that teaches me new facts or tells me how to do something", optionB: "something that gives me new ideas to think about", dimension: "SI" },
  { text: "I like teachers", optionA: "who put a lot of diagrams on the board", optionB: "who spend a lot of time explaining", dimension: "VV" },
  { text: "When I'm analyzing a story or a novel", optionA: "I think of the incidents and try to put them together to figure out the themes", optionB: "I just know what the themes are when I finish reading and then I have to go back and find the incidents that demonstrate them", dimension: "SG" },
  { text: "When I start a homework problem, I am more likely to", optionA: "start working on the solution immediately", optionB: "try to fully understand the problem first", dimension: "AR" },
  { text: "I prefer the idea of", optionA: "certainty", optionB: "theory", dimension: "SI" },
  { text: "I remember best", optionA: "what I see", optionB: "what I hear", dimension: "VV" },
  { text: "It is more important to me that an instructor", optionA: "lay out the material in clear sequential steps", optionB: "give me an overall picture and relate the material to other subjects", dimension: "SG" },
  { text: "I prefer to study", optionA: "in a study group", optionB: "alone", dimension: "AR" },
  { text: "I am more likely to be considered", optionA: "careful about the details of my work", optionB: "creative about how to do my work", dimension: "SI" },
  { text: "When I get directions to a new place, I prefer", optionA: "a map", optionB: "written instructions", dimension: "VV" },
  { text: "I learn", optionA: "at a fairly regular pace. If I study hard, I'll 'get it'", optionB: "in fits and starts. I'll be totally confused and then suddenly it all 'clicks'", dimension: "SG" },
  { text: "I would rather first", optionA: "try things out", optionB: "think about how I'm going to do it", dimension: "AR" },
  { text: "When I am reading for enjoyment, I like writers to", optionA: "clearly say what they mean", optionB: "say things in creative, interesting ways", dimension: "SI" },
  { text: "When I see a diagram or sketch in class, I am most likely to remember", optionA: "the picture", optionB: "what the instructor said about it", dimension: "VV" },
  { text: "When considering a body of information, I am more likely to", optionA: "focus on details and miss the big picture", optionB: "try to understand the big picture before getting into the details", dimension: "SG" },
  { text: "I more easily remember", optionA: "something I have done", optionB: "something I have thought a lot about", dimension: "AR" },
  { text: "When I have to perform a task, I prefer to", optionA: "master one way of doing it", optionB: "come up with new ways of doing it", dimension: "SI" },
  { text: "When someone is showing me data, I prefer", optionA: "charts or graphs", optionB: "text summarizing the results", dimension: "VV" },
  { text: "When writing a paper, I am more likely to", optionA: "work on (think about or write) the beginning of the paper and progress forward", optionB: "work on (think about or write) different parts of the paper and then order them", dimension: "SG" },
  { text: "When I have to work on a group project, I first want to", optionA: "have 'group brainstorming' where everyone contributes ideas", optionB: "brainstorm individually and then come together as a group to compare ideas", dimension: "AR" },
  { text: "I consider it higher praise to call someone", optionA: "sensible", optionB: "imaginative", dimension: "SI" },
  { text: "When I meet people at a party, I am more likely to remember", optionA: "what they looked like", optionB: "what they said about themselves", dimension: "VV" },
  { text: "When I am learning a new subject, I prefer to", optionA: "stay focused on that subject, learning as much about it as I can", optionB: "try to make connections between that subject and related subjects", dimension: "SG" },
  { text: "I am more likely to be considered", optionA: "outgoing", optionB: "reserved", dimension: "AR" },
  { text: "I prefer courses that emphasize", optionA: "concrete material (facts, data)", optionB: "abstract material (concepts, theories)", dimension: "SI" },
  { text: "For entertainment, I would rather", optionA: "watch television", optionB: "read a book", dimension: "VV" },
  { text: "Some teachers start their lectures with an outline of what they will cover. Such outlines are", optionA: "somewhat helpful to me", optionB: "very helpful to me", dimension: "SG" },
  { text: "The idea of doing homework in groups, with one grade for the entire group,", optionA: "appeals to me", optionB: "does not appeal to me", dimension: "AR" },
  { text: "When I am doing long calculations,", optionA: "I tend to repeat all my steps and check my work carefully", optionB: "I find checking my work tiresome and have to force myself to do it", dimension: "SI" },
  { text: "I tend to picture places I have been", optionA: "easily and fairly accurately", optionB: "with difficulty and without much detail", dimension: "VV" },
  { text: "When solving problems in a group, I would be more likely to", optionA: "think of the steps in the solution process", optionB: "think of possible consequences or applications of the solution in a wide range of areas", dimension: "SG" }
];

const dimensions: Array<{ key: Dimension; name: string; left: string; right: string; color: string }> = [
  { key: "AR", name: "Active / Reflective", left: "Active", right: "Reflective", color: "#EE5A3A" },
  { key: "SI", name: "Sensing / Intuitive", left: "Sensing", right: "Intuitive", color: "#166E66" },
  { key: "VV", name: "Visual / Verbal", left: "Visual", right: "Verbal", color: "#6B4A9E" },
  { key: "SG", name: "Sequential / Global", left: "Sequential", right: "Global", color: "#F4A82C" }
];

const interpretations: Record<
  Dimension,
  {
    positive: { name: string; description: string };
    negative: { name: string; description: string };
    balanced: string;
  }
> = {
  AR: {
    positive: {
      name: "Active",
      description: "You prefer to learn by doing, discussing, explaining, or applying information."
    },
    negative: {
      name: "Reflective",
      description: "You prefer to learn by thinking things through, working alone, and considering information carefully before acting."
    },
    balanced: "You are balanced between Active and Reflective learning. You can adapt between doing, discussing, pausing, and thinking."
  },
  SI: {
    positive: {
      name: "Sensing",
      description: "You prefer concrete, practical information and facts. You may like established methods and details."
    },
    negative: {
      name: "Intuitive",
      description: "You prefer abstract concepts, theories, meanings, innovation, and connections between ideas."
    },
    balanced: "You are balanced between Sensing and Intuitive learning. You can work with both concrete facts and abstract concepts."
  },
  VV: {
    positive: {
      name: "Visual",
      description: "You prefer visual representations such as pictures, diagrams, flowcharts, timelines, and demonstrations."
    },
    negative: {
      name: "Verbal",
      description: "You prefer written and spoken explanations, including lectures, discussions, and reading."
    },
    balanced: "You are balanced between Visual and Verbal learning. You can use both visual aids and written or spoken words."
  },
  SG: {
    positive: {
      name: "Sequential",
      description: "You prefer to learn in linear, orderly steps and follow logical paths in finding solutions."
    },
    negative: {
      name: "Global",
      description: "You prefer to learn in large jumps and often need the big picture before the details settle."
    },
    balanced: "You are balanced between Sequential and Global learning. You can work with step-by-step paths and big-picture thinking."
  }
};

function createEmptyAnswers(): Answer[] {
  return new Array(questions.length).fill(null);
}

function getPreferenceStrength(score: number) {
  const absScore = Math.abs(score);
  if (absScore <= 3) return { strength: "Balanced", className: "balanced" };
  if (absScore <= 5) return { strength: "Mild", className: "mild" };
  if (absScore <= 7) return { strength: "Moderate", className: "moderate" };
  return { strength: "Strong", className: "strong" };
}

function getPreferenceLabel(dimension: Dimension, score: number) {
  if (score === 0) return "Balanced";
  const item = dimensions.find((entry) => entry.key === dimension);
  return score > 0 ? item?.left ?? "" : item?.right ?? "";
}

export function LearningStyleTestApp() {
  const [mode, setMode] = useState<Mode>("lively");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(() => createEmptyAnswers());
  const [showingResults, setShowingResults] = useState(false);
  const [saveState, setSaveState] = useState("Saved on this device");

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  const scores = useMemo(() => {
    const nextScores: Record<Dimension, number> = { AR: 0, SI: 0, VV: 0, SG: 0 };
    answers.forEach((answer, index) => {
      if (answer === "a") {
        nextScores[questions[index].dimension] += 1;
      } else if (answer === "b") {
        nextScores[questions[index].dimension] -= 1;
      }
    });
    return nextScores;
  }, [answers]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as {
        answers?: Answer[];
        currentQuestionIndex?: number;
        showingResults?: boolean;
        mode?: Mode;
      };
      if (Array.isArray(parsed.answers)) {
        const nextAnswers = createEmptyAnswers();
        parsed.answers.slice(0, questions.length).forEach((answer, index) => {
          nextAnswers[index] = answer === "a" || answer === "b" ? answer : null;
        });
        setAnswers(nextAnswers);
      }
      setCurrentQuestionIndex(
        typeof parsed.currentQuestionIndex === "number"
          ? Math.min(Math.max(parsed.currentQuestionIndex, 0), questions.length - 1)
          : 0
      );
      setShowingResults(Boolean(parsed.showingResults));
      setMode(parsed.mode === "calm" ? "calm" : "lively");
    } catch {
      setSaveState("Could not load saved test");
    }
  }, []);

  useEffect(() => {
    document.body.dataset.mode = mode;
  }, [mode]);

  useEffect(() => {
    setSaveState("Saving on this device");
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, JSON.stringify({ answers, currentQuestionIndex, showingResults, mode }));
      setSaveState("Saved on this device");
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [answers, currentQuestionIndex, showingResults, mode]);

  function saveAnswer(value: Answer) {
    setAnswers((current) => current.map((answer, index) => (index === currentQuestionIndex ? value : answer)));
  }

  function previousQuestion() {
    setCurrentQuestionIndex((current) => Math.max(current - 1, 0));
  }

  function nextQuestion() {
    if (answers[currentQuestionIndex] === null) return;
    setCurrentQuestionIndex((current) => Math.min(current + 1, questions.length - 1));
  }

  function restartTest() {
    setCurrentQuestionIndex(0);
    setAnswers(createEmptyAnswers());
    setShowingResults(false);
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

    if (line) {
      context.fillText(line, x, currentY);
    }
  }

  function downloadTestJpg() {
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
    context.fillText("Index of Learning Styles", innerX, 126);
    context.font = "400 22px Arial";
    context.fillStyle = "#6B6457";
    context.fillText(`${answeredCount} of ${questions.length} questions answered`, innerX, 168);

    context.font = "700 30px Arial";
    context.fillStyle = "#2A2521";
    context.fillText("Learning style profile", innerX, 230);

    dimensions.forEach((dimension, index) => {
      const y = 280 + index * 150;
      const score = scores[dimension.key];
      const preference = getPreferenceLabel(dimension.key, score);
      const strength = getPreferenceStrength(score);

      context.fillStyle = "#FFF9EC";
      context.strokeStyle = "#2A2521";
      context.lineWidth = 3;
      context.fillRect(innerX, y, innerWidth, 120);
      context.strokeRect(innerX, y, innerWidth, 120);
      context.fillStyle = "#2A2521";
      context.font = "700 26px Arial";
      context.fillText(dimension.name, innerX + 24, y + 42);
      context.font = "400 22px Arial";
      context.fillText(`${score > 0 ? "+" : ""}${score} | ${preference} | ${strength.strength}`, innerX + 24, y + 82);
    });

    context.font = "700 28px Arial";
    context.fillText("References", innerX, 940);
    context.font = "400 18px Arial";
    context.fillStyle = "#6B6457";
    drawWrappedText(
      context,
      "Felder, R. M., & Silverman, L. K. (1988). Learning and teaching styles in engineering education. Engineering Education, 78(7), 674-681. Felder, R. M., & Spurlin, J. (2005). Applications, reliability and validity of the Index of Learning Styles. International Journal of Engineering Education, 21(1), 103-112. Soloman, B. A., & Felder, R. M. Index of Learning Styles. North Carolina State University.",
      innerX,
      982,
      innerWidth,
      26
    );

    const link = document.createElement("a");
    link.download = "mapping-me-index-of-learning-styles.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  return (
    <main className="shell sensory-shell" translate="no">
      <header className="topbar no-print">
        <div>
          <p className="eyebrow">Mapping Me</p>
          <h1>Index of Learning Styles</h1>
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
        <strong>Private by default.</strong> Your test answers save in this browser on this device. They are not uploaded.
      </section>

      <section className="sensory-panel ils-test-page no-print" aria-labelledby="ils-title">
        {!showingResults ? (
          <>
            <div className="sensory-panel-header">
              <div>
                <p className="eyebrow">Felder-Soloman Learning Style Assessment</p>
                <h2 id="ils-title">Index of Learning Styles</h2>
                <p className="prompt">
                  For each question, select the answer that best describes your preference. There are 44 questions total
                  covering four dimensions of learning styles.
                </p>
              </div>
              <div className="sensory-panel-actions">
                <button type="button" onClick={downloadTestJpg}>Save test JPG</button>
                <button type="button" onClick={restartTest}>Reset test</button>
              </div>
            </div>

            <div className="ils-progress" aria-live="polite">
              <div className="ils-progress-bar">
                <span style={{ width: `${progress}%` }} />
              </div>
              <p>
                <strong>{currentQuestionIndex + 1}</strong> of <strong>{questions.length}</strong>
              </p>
            </div>

            <article className="ils-question-card">
              <p className="question-number">Question {currentQuestionIndex + 1}</p>
              <h3>{currentQuestion.text}</h3>
              <div className="ils-options">
                <label className={answers[currentQuestionIndex] === "a" ? "active" : ""}>
                  <input
                    checked={answers[currentQuestionIndex] === "a"}
                    name="answer"
                    onChange={() => saveAnswer("a")}
                    type="radio"
                  />
                  <span>{currentQuestion.optionA}</span>
                </label>
                <label className={answers[currentQuestionIndex] === "b" ? "active" : ""}>
                  <input
                    checked={answers[currentQuestionIndex] === "b"}
                    name="answer"
                    onChange={() => saveAnswer("b")}
                    type="radio"
                  />
                  <span>{currentQuestion.optionB}</span>
                </label>
              </div>
            </article>

            <div className="ils-navigation">
              <button disabled={currentQuestionIndex === 0} onClick={previousQuestion} type="button">
                Previous
              </button>
              {currentQuestionIndex === questions.length - 1 ? (
                <button disabled={answeredCount < questions.length} onClick={() => setShowingResults(true)} type="button">
                  View Results
                </button>
              ) : (
                <button disabled={answers[currentQuestionIndex] === null} onClick={nextQuestion} type="button">
                  Next
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="sensory-panel-header">
              <div>
                <p className="eyebrow">Results</p>
                <h2>Your Learning Style Profile</h2>
                <p className="prompt">Based on the Index of Learning Styles.</p>
              </div>
              <div className="sensory-panel-actions">
                <button type="button" onClick={downloadTestJpg}>Save test JPG</button>
                <button type="button" onClick={restartTest}>Retake assessment</button>
              </div>
            </div>

            <div className="ils-chart" aria-label="Learning style preference chart">
              {dimensions.map((dimension) => {
                const score = scores[dimension.key];
                const offset = ((score + 11) / 22) * 100;
                return (
                  <div className="ils-chart-row" key={dimension.key}>
                    <div>
                      <strong>{dimension.left}</strong>
                      <span>{dimension.name}</span>
                      <strong>{dimension.right}</strong>
                    </div>
                    <div className="ils-chart-track">
                      <span className="ils-chart-mid" />
                      <span className="ils-chart-dot" style={{ left: `${offset}%`, background: dimension.color }} />
                    </div>
                    <p>{score > 0 ? "+" : ""}{score}</p>
                  </div>
                );
              })}
            </div>

            <div className="ils-score-grid">
              {dimensions.map((dimension) => {
                const score = scores[dimension.key];
                const strength = getPreferenceStrength(score);
                return (
                  <article className="ils-score-card" key={dimension.key}>
                    <h3>{dimension.name}</h3>
                    <strong>{score > 0 ? "+" : ""}{score}</strong>
                    <p>{getPreferenceLabel(dimension.key, score)}</p>
                    <span className={`preference-label ${strength.className}`}>{strength.strength}</span>
                  </article>
                );
              })}
            </div>

            <section className="ils-interpretation">
              <h3>Your Learning Style Profile</h3>
              {dimensions.map((dimension) => {
                const score = scores[dimension.key];
                const absScore = Math.abs(score);
                const strength = getPreferenceStrength(score);
                const copy =
                  absScore <= 3
                    ? { name: "Balanced", description: interpretations[dimension.key].balanced }
                    : score > 0
                      ? interpretations[dimension.key].positive
                      : interpretations[dimension.key].negative;

                return (
                  <article key={dimension.key}>
                    <h4>{dimension.name}</h4>
                    <p>
                      <strong>
                        {absScore <= 3 ? "You are balanced" : `You are ${copy.name.toUpperCase()} (${strength.strength} preference)`}
                      </strong>
                    </p>
                    <p>{copy.description}</p>
                  </article>
                );
              })}

              <h3>Understanding Preference Strength</h3>
              <ul>
                <li><strong>Balanced (1-3):</strong> You are flexible and can learn well in either mode.</li>
                <li><strong>Mild (5):</strong> You have a moderate preference for one learning mode.</li>
                <li><strong>Moderate (7):</strong> You have a clear preference and may have some difficulty with the opposite mode.</li>
                <li><strong>Strong (9-11):</strong> You have a very strong preference and may struggle significantly with the opposite mode.</li>
              </ul>

              <h3>Important Notes</h3>
              <ul>
                <li>Learning styles are preferences, not fixed abilities.</li>
                <li>Well-rounded learners can function in multiple modes.</li>
                <li>Understanding your preferences helps you identify effective learning strategies.</li>
                <li>Strong preferences may indicate areas where you need to develop flexibility.</li>
              </ul>

              <h3>References</h3>
              <p>
                Felder, R. M., & Silverman, L. K. (1988). Learning and teaching styles in engineering education.
                Engineering Education, 78(7), 674-681.
              </p>
              <p>
                Felder, R. M., & Spurlin, J. (2005). Applications, reliability and validity of the Index of Learning
                Styles. International Journal of Engineering Education, 21(1), 103-112.
              </p>
              <p>
                Soloman, B. A., & Felder, R. M. Index of Learning Styles. North Carolina State University.
              </p>
            </section>
          </>
        )}

        <p className="inline-save-status" aria-live="polite">{saveState}</p>
      </section>
    </main>
  );
}
