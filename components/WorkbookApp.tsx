"use client";

import { ChangeEvent, CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {
  createEmptyWorkbook,
  createDailyEnergyRecord,
  dayHours,
  energySteps,
  EnergyStepId,
  getTodayKey,
  loadWorkbook,
  metricLevels,
  metricRows,
  MetricId,
  MetricLevel,
  saveWorkbook,
  validateWorkbookImport,
  WorkbookData,
  WorkbookMode
} from "@/lib/workbook-storage";
import { LanguageToggle } from "@/components/language";

type SaveState = "loading" | "saved" | "saving" | "error";
type ActivePanel = "daily" | "questions";

export function WorkbookApp() {
  const [workbook, setWorkbook] = useState<WorkbookData>(() => createEmptyWorkbook());
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [importError, setImportError] = useState("");
  const [customCard, setCustomCard] = useState("");
  const [activePanel, setActivePanel] = useState<ActivePanel>("daily");
  const didLoad = useRef(false);
  const todayKey = getTodayKey();
  const dailyRecord = workbook.dailyRecords[todayKey] ?? createDailyEnergyRecord(todayKey);
  const hours = dayHours;

  const currentIndex = energySteps.findIndex((step) => step.id === workbook.currentStep);
  const currentStep = energySteps[currentIndex] ?? energySteps[0];
  const saveMessage = {
    loading: "Loading saved workbook",
    saving: "Saving on this device",
    saved: "Saved on this device",
    error: "Could not save in this browser"
  }[saveState];
  const visibleCards = useMemo(
    () => [...currentStep.suggestions, ...workbook.customCards[currentStep.id]],
    [currentStep, workbook.customCards]
  );

  useEffect(() => {
    loadWorkbook()
      .then((saved) => {
        if (saved) {
          setWorkbook(saved);
        }
        setSaveState("saved");
      })
      .catch(() => setSaveState("error"))
      .finally(() => {
        didLoad.current = true;
      });

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    } else if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
    }
  }, []);

  useEffect(() => {
    document.body.dataset.mode = workbook.mode;
  }, [workbook.mode]);

  useEffect(() => {
    if (!didLoad.current) {
      return;
    }

    setSaveState("saving");
    const timeout = window.setTimeout(() => {
      saveWorkbook(workbook)
        .then(() => setSaveState("saved"))
        .catch(() => setSaveState("error"));
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [workbook]);

  function updateWorkbook(updater: (draft: WorkbookData) => WorkbookData) {
    setWorkbook((current) => updater(current));
  }

  function setMode(mode: WorkbookMode) {
    updateWorkbook((current) => ({ ...current, mode }));
  }

  function setStep(id: EnergyStepId) {
    updateWorkbook((current) => ({ ...current, currentStep: id }));
  }

  function updateAnswer(value: string) {
    updateWorkbook((current) => ({
      ...current,
      energy: { ...current.energy, [currentStep.id]: value }
    }));
  }

  function updateDailyRecord(updater: (record: ReturnType<typeof createDailyEnergyRecord>) => ReturnType<typeof createDailyEnergyRecord>) {
    updateWorkbook((current) => {
      const existing = current.dailyRecords[todayKey] ?? createDailyEnergyRecord(todayKey);
      const nextRecord = updater(existing);

      return {
        ...current,
        dailyRecords: {
          ...current.dailyRecords,
          [todayKey]: nextRecord
        }
      };
    });
  }

  function nextMetricLevel(level: MetricLevel): MetricLevel {
    if (level === "") {
      return "low";
    }

    if (level === "low") {
      return "medium";
    }

    if (level === "medium") {
      return "high";
    }

    return "";
  }

  function setMetricLevel(metric: MetricId, hour: number, level: MetricLevel) {
    updateDailyRecord((record) => {
      const nextValues = [...record.metrics[metric]];
      nextValues[hour] = level;

      return {
        ...record,
        metrics: {
          ...record.metrics,
          [metric]: nextValues
        }
      };
    });
  }

  function cycleMetricLevel(metric: MetricId, hour: number) {
    const current = dailyRecord.metrics[metric][hour];
    setMetricLevel(metric, hour, nextMetricLevel(current));
  }

  function updateDailyText(field: "comment" | "summary", value: string) {
    updateDailyRecord((record) => ({
      ...record,
      [field]: value
    }));
  }

  function resetTodayRecord() {
    if (!window.confirm("Reset today's energy map on this device?")) {
      return;
    }

    updateWorkbook((current) => ({
      ...current,
      dailyRecords: {
        ...current.dailyRecords,
        [todayKey]: createDailyEnergyRecord(todayKey)
      }
    }));
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

  function downloadTodayJpg() {
    const scale = 2;
    const width = 1680;
    const outerMargin = 56;
    const contentX = 104;
    const contentWidth = width - contentX * 2;
    const rowLabelWidth = 260;
    const hourWidth = 48;
    const headerHeight = 230;
    const rowHeight = 122;
    const gridX = contentX;
    const gridY = headerHeight;
    const gridWidth = rowLabelWidth + hourWidth * hours.length;
    const gridHeight = 46 + rowHeight * metricRows.length;
    const notesTop = gridY + gridHeight + 58;
    const notesGap = 32;
    const noteBoxWidth = (contentWidth - notesGap) / 2;
    const notesHeight = 250;
    const height = notesTop + notesHeight + 104;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.scale(scale, scale);
    context.fillStyle = "#F3E8D2";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "#2A2521";
    context.lineWidth = 3;
    context.strokeRect(outerMargin, outerMargin, width - outerMargin * 2, height - outerMargin * 2);

    context.fillStyle = "#2A2521";
    context.font = "700 58px Arial";
    context.fillText("Mapping Me Energy Map", contentX, 128);
    context.font = "700 24px Arial";
    context.fillStyle = "#6B4A9E";
    context.fillText(todayKey, contentX, 170);
    context.font = "400 20px Arial";
    context.fillStyle = "#6B6457";
    context.fillText("Low dots sit lower, mid dots sit center, high dots sit higher.", contentX, 205);

    context.fillStyle = "#FFF9EC";
    context.strokeStyle = "#2A2521";
    context.lineWidth = 3;
    context.fillRect(gridX, gridY, gridWidth, gridHeight);
    context.strokeRect(gridX, gridY, gridWidth, gridHeight);

    context.fillStyle = "#166E66";
    context.fillRect(gridX, gridY, gridWidth, 46);
    context.fillStyle = "#FFF9EC";
    context.font = "700 16px Arial";
    context.fillText("Hour", gridX + 22, gridY + 30);

    hours.forEach((hour, index) => {
      const x = gridX + rowLabelWidth + index * hourWidth;
      context.strokeStyle = "#2A2521";
      context.lineWidth = 1;
      context.strokeRect(x, gridY, hourWidth, gridHeight);
      context.fillStyle = "#FFF9EC";
      context.font = "700 14px Arial";
      context.textAlign = "center";
      context.fillText(String(hour).padStart(2, "0"), x + hourWidth / 2, gridY + 30);
    });
    context.textAlign = "left";

    metricRows.forEach((metric, rowIndex) => {
      const y = gridY + 46 + rowIndex * rowHeight;
      context.strokeStyle = "#2A2521";
      context.lineWidth = 1;
      context.strokeRect(gridX, y, gridWidth, rowHeight);
      context.fillStyle = "#F8EDD9";
      context.fillRect(gridX, y, rowLabelWidth, rowHeight);
      context.fillStyle = "#2A2521";
      context.font = "700 22px Arial";
      context.fillText(metric.title, gridX + 22, y + 42);
      context.font = "400 15px Arial";
      context.fillStyle = "#6B6457";
      drawWrappedText(context, metric.description, gridX + 22, y + 72, rowLabelWidth - 44, 18);

      hours.forEach((hour, index) => {
        const level = dailyRecord.metrics[metric.id][hour];
        if (!level) {
          return;
        }

        const cellX = gridX + rowLabelWidth + index * hourWidth;
        const dotY =
          level === "high" ? y + 28 : level === "medium" ? y + rowHeight / 2 : y + rowHeight - 28;

        context.beginPath();
        context.fillStyle = metric.color;
        context.strokeStyle = "#2A2521";
        context.lineWidth = 3;
        context.arc(cellX + hourWidth / 2, dotY, 10, 0, Math.PI * 2);
        context.fill();
        context.stroke();
      });
    });

    const commentX = contentX;
    const summaryX = contentX + noteBoxWidth + notesGap;
    context.fillStyle = "#FFF9EC";
    context.strokeStyle = "#2A2521";
    context.lineWidth = 2;
    context.fillRect(commentX, notesTop, noteBoxWidth, notesHeight);
    context.strokeRect(commentX, notesTop, noteBoxWidth, notesHeight);
    context.fillRect(summaryX, notesTop, noteBoxWidth, notesHeight);
    context.strokeRect(summaryX, notesTop, noteBoxWidth, notesHeight);

    context.fillStyle = "#2A2521";
    context.font = "700 24px Arial";
    context.fillText("Comment", commentX + 26, notesTop + 44);
    context.font = "400 20px Arial";
    context.fillStyle = "#2A2521";
    drawWrappedText(
      context,
      dailyRecord.comment || "Blank for now.",
      commentX + 26,
      notesTop + 84,
      noteBoxWidth - 52,
      28
    );

    context.font = "700 24px Arial";
    context.fillText("Summary", summaryX + 26, notesTop + 44);
    context.font = "400 20px Arial";
    drawWrappedText(context, dailyRecord.summary || "Blank for now.", summaryX + 26, notesTop + 84, noteBoxWidth - 52, 28);

    const link = document.createElement("a");
    link.download = `mapping-me-energy-map-${todayKey}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  function downloadQuestionJpg(stepId: EnergyStepId) {
    const step = energySteps.find((item) => item.id === stepId) ?? energySteps[0];
    const selectedCards = workbook.selectedCards[stepId];
    const answer = workbook.energy[stepId] || "Blank for now.";
    const scale = 2;
    const width = 1200;
    const height = 900;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.scale(scale, scale);
    context.fillStyle = workbook.mode === "calm" ? "#ECE0CB" : "#F3E8D2";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#2A2521";
    context.lineWidth = 3;
    context.strokeRect(40, 40, width - 80, height - 80);

    context.fillStyle = "#2A2521";
    context.font = "700 26px Arial";
    context.fillText("Mapping Me Energy Map", 70, 92);
    context.font = "700 52px Arial";
    drawWrappedText(context, step.title, 70, 160, width - 140, 58);

    context.font = "400 24px Arial";
    context.fillStyle = "#6B6457";
    const afterPrompt = drawWrappedText(context, step.prompt, 70, 280, width - 140, 34);

    context.fillStyle = "#2A2521";
    context.font = "700 26px Arial";
    context.fillText("My notes", 70, afterPrompt + 42);
    context.font = "400 24px Arial";
    const afterAnswer = drawWrappedText(context, answer, 70, afterPrompt + 82, width - 140, 34);

    context.font = "700 26px Arial";
    context.fillText("Cards I picked", 70, afterAnswer + 46);
    context.font = "400 22px Arial";
    drawWrappedText(
      context,
      selectedCards.length > 0 ? selectedCards.join(", ") : "Blank for now.",
      70,
      afterAnswer + 86,
      width - 140,
      30
    );

    const link = document.createElement("a");
    link.download = `mapping-me-${stepId}-${todayKey}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  function toggleCard(label: string) {
    updateWorkbook((current) => {
      const selected = current.selectedCards[currentStep.id];
      const nextSelected = selected.includes(label) ? selected.filter((item) => item !== label) : [...selected, label];

      return {
        ...current,
        selectedCards: { ...current.selectedCards, [currentStep.id]: nextSelected }
      };
    });
  }

  function addCustomCard() {
    const label = customCard.trim();

    if (!label) {
      return;
    }

    updateWorkbook((current) => ({
      ...current,
      customCards: {
        ...current.customCards,
        [currentStep.id]: [...current.customCards[currentStep.id], label]
      },
      selectedCards: {
        ...current.selectedCards,
        [currentStep.id]: [...current.selectedCards[currentStep.id], label]
      }
    }));
    setCustomCard("");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(workbook, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mapping-me-workbook.json";
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
      .then((text) => validateWorkbookImport(JSON.parse(text)))
      .then((data) => setWorkbook(data))
      .catch((error: Error) => setImportError(error.message))
      .finally(() => {
        event.target.value = "";
      });
  }

  function resetSection() {
    if (!window.confirm("Reset this section on this device?")) {
      return;
    }

    updateWorkbook((current) => ({
      ...current,
      energy: { ...current.energy, [currentStep.id]: "" },
      selectedCards: { ...current.selectedCards, [currentStep.id]: [] },
      customCards: { ...current.customCards, [currentStep.id]: [] }
    }));
  }

  function resetWorkbook() {
    if (!window.confirm("Reset the whole workbook on this device? Export a backup first if you want to keep it.")) {
      return;
    }

    setWorkbook(createEmptyWorkbook());
  }

  return (
    <main className="shell" translate="no">
      <header className="topbar no-print">
        <div>
          <p className="eyebrow">Mapping Me</p>
          <h1>Mapping My Energy</h1>
        </div>
        <div className="topbar-controls">
          <LanguageToggle />
          <div className="mode-switch" aria-label="Presentation mode">
            <button className={workbook.mode === "lively" ? "active" : ""} onClick={() => setMode("lively")} type="button">
              Lively
            </button>
            <button className={workbook.mode === "calm" ? "active" : ""} onClick={() => setMode("calm")} type="button">
              Calm
            </button>
          </div>
        </div>
      </header>

      <section className="privacy-note no-print" aria-label="Privacy note">
        <strong>Private by default.</strong> Your answers save in this browser on this device. They are not uploaded.
        Export JSON if you want a backup or want to move devices.
      </section>

      <div className="workbook-panels no-print">
        <aside className="section-tabs" aria-label="Workbook sections">
          <button
            className={activePanel === "daily" ? "active" : ""}
            onClick={() => setActivePanel("daily")}
            type="button"
          >
            <span>1</span>
            Daily energy map
          </button>
          <button
            className={activePanel === "questions" ? "active" : ""}
            onClick={() => setActivePanel("questions")}
            type="button"
          >
            <span>2</span>
            Five questions
          </button>
          <div className="sidebar-tools">
            <button type="button" onClick={exportJson}>Export JSON</button>
            <label className="file-button">
              Import JSON
              <input type="file" accept="application/json" onChange={importJson} />
            </label>
            <button type="button" onClick={resetWorkbook}>Reset workbook</button>
            {importError && <p className="error" role="alert">{importError}</p>}
          </div>
        </aside>

        <div className="panel-stack">
      <section className="daily-map" aria-labelledby="daily-map-title" hidden={activePanel !== "daily"}>
        <div className="daily-map-header">
          <div>
            <p className="eyebrow">Daily mapping</p>
            <h2 id="daily-map-title">Record your energy today</h2>
            <p>
              Click a cell to cycle blank, low, mid, and high. Each colored dot marks one area: peacefulness, energy,
              or productivity. Leave hours blank when they do not need tracking.
            </p>
          </div>
          <div className="daily-map-tools">
            <div className="level-key" aria-label="Level key">
              {metricLevels.map((level) => (
                <span className="level-position" key={level.id}>
                  <span className={`level-marker ${level.id}`} />
                  {level.label}
                </span>
              ))}
            </div>
            <button type="button" onClick={downloadTodayJpg}>Save today JPG</button>
            <button type="button" onClick={resetTodayRecord}>Reset today</button>
            <p className="inline-save-status" aria-live="polite">{saveMessage}</p>
          </div>
        </div>

        <div className="metric-grid-wrap">
          <div className="metric-grid" role="table" aria-label="Hourly peacefulness, energy, and productivity map">
            <div className="metric-corner" role="columnheader">Hour</div>
            {hours.map((hour) => (
              <div className="metric-hour" role="columnheader" key={hour}>
                {String(hour).padStart(2, "0")}
              </div>
            ))}

            {metricRows.map((metric) => (
              <div className="metric-row" role="row" key={metric.id}>
                <div className="metric-label" role="rowheader">
                  <strong>{metric.title}</strong>
                  <span>{metric.description}</span>
                </div>
                {hours.map((hour) => {
                  const level = dailyRecord.metrics[metric.id][hour];
                  const levelLabel = level ? metricLevels.find((item) => item.id === level)?.label : "Blank";

                  return (
                    <button
                      aria-label={`${metric.title} at ${hour}:00, ${levelLabel}`}
                      className={`metric-cell ${level || "blank"}`}
                      key={`${metric.id}-${hour}`}
                      onClick={() => cycleMetricLevel(metric.id, hour)}
                      style={{ "--metric-color": metric.color } as CSSProperties}
                      title={`${metric.title} ${hour}:00`}
                      type="button"
                    >
                      <span className="metric-cell-track" aria-hidden="true">
                        <span className="metric-dot" />
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="daily-notes">
          <label>
            Comment
            <textarea
              value={dailyRecord.comment}
              onChange={(event) => updateDailyText("comment", event.target.value)}
              placeholder="Anything worth remembering about today: context, sleep, food, sensory load, transitions, support."
            />
          </label>
          <label>
            Summary
            <textarea
              value={dailyRecord.summary}
              onChange={(event) => updateDailyText("summary", event.target.value)}
              placeholder="A short reflection or pattern you noticed today."
            />
          </label>
        </div>
      </section>

      <section className="question-panel" hidden={activePanel !== "questions"}>
      <div className="questions-layout screen-workbook">
        <nav className="question-bar no-print" aria-label="Energy chapter steps">
          {energySteps.map((step, index) => (
            <button
              className={step.id === currentStep.id ? "active" : ""}
              key={step.id}
              onClick={() => setStep(step.id)}
              type="button"
            >
              <span>{index + 1}</span>
              {step.title}
            </button>
          ))}
        </nav>

        <section className="work-area" aria-labelledby="current-step-title">
          <div className="step-card">
            <p className="step-count">Step {currentIndex + 1} of {energySteps.length}</p>
            <h2 id="current-step-title">{currentStep.title}</h2>
            <p className="prompt">{currentStep.prompt}</p>

            <div className="suggestions no-print" aria-label="Suggestion cards">
              {visibleCards.map((label) => {
                const selected = workbook.selectedCards[currentStep.id].includes(label);

                return (
                  <button
                    className={selected ? "suggestion selected" : "suggestion"}
                    key={label}
                    onClick={() => toggleCard(label)}
                    type="button"
                    aria-pressed={selected}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="custom-card no-print">
              <label htmlFor="custom-card">Add my own card</label>
              <div>
                <input
                  id="custom-card"
                  value={customCard}
                  onChange={(event) => setCustomCard(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      addCustomCard();
                    }
                  }}
                />
                <button onClick={addCustomCard} type="button">Add</button>
              </div>
            </div>

            <label className="answer-label" htmlFor="answer">
              My notes
            </label>
            <textarea
              id="answer"
              value={workbook.energy[currentStep.id]}
              onChange={(event) => updateAnswer(event.target.value)}
              placeholder="Write in a way that works for you: words, fragments, lists, or reminders."
            />

            <div className="selected-list">
              <h3>Cards I picked</h3>
              <ul hidden={workbook.selectedCards[currentStep.id].length === 0}>
                {workbook.selectedCards[currentStep.id].map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
              <p hidden={workbook.selectedCards[currentStep.id].length > 0}>No cards picked yet.</p>
            </div>
          </div>

          <div className="actions no-print">
            <button
              type="button"
              onClick={() => setStep(energySteps[Math.max(0, currentIndex - 1)].id)}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setStep(energySteps[Math.min(energySteps.length - 1, currentIndex + 1)].id)}
              disabled={currentIndex === energySteps.length - 1}
            >
              Next
            </button>
            <button type="button" onClick={resetSection}>Reset section</button>
            <button type="button" onClick={() => downloadQuestionJpg(currentStep.id)}>Save JPG</button>
          </div>
        </section>
      </div>
      </section>

        </div>
      </div>
    </main>
  );
}
