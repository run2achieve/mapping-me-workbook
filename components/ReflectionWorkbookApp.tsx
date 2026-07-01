"use client";

import { ChangeEvent, CSSProperties, useEffect, useState } from "react";

type PanelId = "cards" | "prompts" | "moments" | "notes";
type Mode = "lively" | "calm";

type ReflectionCard = {
  id: string;
  title: string;
  text: string;
  notice: string;
  color: string;
};

type ReflectionPrompt = {
  id: string;
  title: string;
  prompt: string;
  examples: string[];
};

type ValueBankCategory = {
  id: string;
  title: string;
  values: string[];
};

type ChecklistCategory = {
  id: string;
  title: string;
  items: Array<{
    id: string;
    label: string;
  }>;
};

type ChecklistItem = ChecklistCategory["items"][number];

type ValueVote = "mine" | "maybe" | "";

type AppreciationMoment = {
  id: string;
  moment: string;
  reason: string;
};

type NoteEntry = {
  id: string;
  text: string;
  detail?: string;
};

export type ReflectionWorkbookConfig = {
  storageKey: string;
  title: string;
  eyebrow: string;
  description: string;
  privacyNote: string;
  cardsTabLabel?: string;
  cardsTitle: string;
  cardsIntro: string;
  promptsTabLabel?: string;
  promptsTitle: string;
  promptsIntro: string;
  notesTabLabel?: string;
  notesTitle: string;
  notesIntro: string;
  noteLabel: string;
  noteEntries?: {
    addButtonLabel: string;
    entryTitle: string;
    detailLabel?: string;
    detailPlaceholder?: string;
    placeholder: string;
    emptyText: string;
  };
  cards: ReflectionCard[];
  prompts: ReflectionPrompt[];
  checklist?: {
    categories: ChecklistCategory[];
  };
  valueBank?: {
    title: string;
    intro: string;
    categories: ValueBankCategory[];
  };
  moments?: {
    tabLabel: string;
    title: string;
    intro: string;
    momentLabel: string;
    reasonLabel: string;
    momentPlaceholder: string;
    reasonPlaceholder: string;
    addButtonLabel: string;
    saveJpgLabel: string;
    emptyText: string;
  };
};

type ReflectionWorkbookData = {
  savedCards: string[];
  cardComments: Record<string, string>;
  valueVotes: Record<string, ValueVote>;
  customValues: Record<string, string[]>;
  promptNotes: Record<string, string>;
  checklist: Record<string, boolean>;
  customChecklistItems: Record<string, ChecklistItem[]>;
  moments: AppreciationMoment[];
  noteEntries: NoteEntry[];
  freeNotes: string;
  mode: Mode;
};

function createEmptyPromptNotes(config: ReflectionWorkbookConfig) {
  return Object.fromEntries(config.prompts.map((prompt) => [prompt.id, ""])) as Record<string, string>;
}

function createEmptyData(config: ReflectionWorkbookConfig): ReflectionWorkbookData {
  return {
    savedCards: [],
    cardComments: {},
    valueVotes: {},
    customValues: {},
    promptNotes: createEmptyPromptNotes(config),
    checklist: {},
    customChecklistItems: {},
    moments: [],
    noteEntries: [],
    freeNotes: "",
    mode: "lively"
  };
}

function createMomentId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `moment-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ReflectionWorkbookApp({ config }: { config: ReflectionWorkbookConfig }) {
  const [activePanel, setActivePanel] = useState<PanelId>("cards");
  const [data, setData] = useState<ReflectionWorkbookData>(() => createEmptyData(config));
  const [saveState, setSaveState] = useState("Saved on this device");
  const [importError, setImportError] = useState("");
  const [animatedCard, setAnimatedCard] = useState("");
  const [customValueInputs, setCustomValueInputs] = useState<Record<string, string>>({});
  const [customChecklistInputs, setCustomChecklistInputs] = useState<Record<string, string>>({});
  const hasPrompts = config.prompts.length > 0 || Boolean(config.checklist);

  useEffect(() => {
    const saved = window.localStorage.getItem(config.storageKey);
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Partial<ReflectionWorkbookData>;
      setData({
        savedCards: Array.isArray(parsed.savedCards) ? parsed.savedCards : [],
        cardComments: normalizeStringRecord(parsed.cardComments),
        valueVotes: normalizeValueVotes(parsed.valueVotes),
        customValues: normalizeCustomValues(parsed.customValues, config),
        promptNotes: { ...createEmptyPromptNotes(config), ...parsed.promptNotes },
        checklist: normalizeBooleanRecord(parsed.checklist),
        customChecklistItems: normalizeCustomChecklistItems(parsed.customChecklistItems, config),
        moments: normalizeMoments(parsed.moments),
        noteEntries: normalizeNoteEntries(parsed.noteEntries),
        freeNotes: typeof parsed.freeNotes === "string" ? parsed.freeNotes : "",
        mode: parsed.mode === "calm" ? "calm" : "lively"
      });
    } catch {
      setSaveState(`Could not load saved ${config.title.toLowerCase()} workbook`);
    }
  }, [config]);

  useEffect(() => {
    document.body.dataset.mode = data.mode;
  }, [data.mode]);

  useEffect(() => {
    setSaveState("Saving on this device");
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(config.storageKey, JSON.stringify(data));
      setSaveState("Saved on this device");
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [config.storageKey, data]);

  function setMode(mode: Mode) {
    setData((current) => ({ ...current, mode }));
  }

  function toggleCard(cardId: string) {
    setData((current) => {
      const savedCards = current.savedCards.includes(cardId)
        ? current.savedCards.filter((id) => id !== cardId)
        : [...current.savedCards, cardId];

      return { ...current, savedCards };
    });
    setAnimatedCard(cardId);
    window.setTimeout(() => setAnimatedCard(""), 650);
  }

  function updateCardComment(cardId: string, value: string) {
    setData((current) => ({
      ...current,
      cardComments: {
        ...current.cardComments,
        [cardId]: value
      }
    }));
  }

  function normalizeStringRecord(raw: unknown): Record<string, string> {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(raw).flatMap(([key, value]) => (typeof value === "string" ? [[key, value]] : []))
    ) as Record<string, string>;
  }

  function normalizeValueVotes(raw: unknown): Record<string, ValueVote> {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(raw).flatMap(([value, vote]) => (vote === "mine" || vote === "maybe" ? [[value, vote]] : []))
    ) as Record<string, ValueVote>;
  }

  function normalizeBooleanRecord(raw: unknown): Record<string, boolean> {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(raw).flatMap(([key, value]) => (typeof value === "boolean" ? [[key, value]] : []))
    ) as Record<string, boolean>;
  }

  function normalizeCustomValues(raw: unknown, currentConfig: ReflectionWorkbookConfig): Record<string, string[]> {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return {};
    }

    const categoryIds = new Set(currentConfig.valueBank?.categories.map((category) => category.id) ?? []);

    return Object.fromEntries(
      Object.entries(raw).flatMap(([categoryId, values]) => {
        if (!categoryIds.has(categoryId) || !Array.isArray(values)) {
          return [];
        }

        const cleanValues = values
          .filter((value): value is string => typeof value === "string")
          .map((value) => value.trim())
          .filter(Boolean);

        return [[categoryId, Array.from(new Set(cleanValues))]];
      })
    ) as Record<string, string[]>;
  }

  function normalizeCustomChecklistItems(
    raw: unknown,
    currentConfig: ReflectionWorkbookConfig
  ): Record<string, ChecklistItem[]> {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return {};
    }

    const categoryIds = new Set(currentConfig.checklist?.categories.map((category) => category.id) ?? []);

    return Object.fromEntries(
      Object.entries(raw).flatMap(([categoryId, items]) => {
        if (!categoryIds.has(categoryId) || !Array.isArray(items)) {
          return [];
        }

        const cleanItems = items.flatMap((item): ChecklistItem[] => {
          if (!item || typeof item !== "object" || Array.isArray(item)) {
            return [];
          }

          const entry = item as Partial<ChecklistItem>;
          const label = typeof entry.label === "string" ? entry.label.trim() : "";
          if (!label) {
            return [];
          }

          return [{ id: typeof entry.id === "string" && entry.id ? entry.id : createMomentId(), label }];
        });

        return [[categoryId, cleanItems]];
      })
    ) as Record<string, ChecklistItem[]>;
  }

  function normalizeMoments(raw: unknown): AppreciationMoment[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.flatMap((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return [];
      }

      const entry = item as Partial<AppreciationMoment>;
      return [
        {
          id: typeof entry.id === "string" && entry.id ? entry.id : createMomentId(),
          moment: typeof entry.moment === "string" ? entry.moment : "",
          reason: typeof entry.reason === "string" ? entry.reason : ""
        }
      ];
    });
  }

  function normalizeNoteEntries(raw: unknown): NoteEntry[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.flatMap((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return [];
      }

      const entry = item as Partial<NoteEntry>;
      return [
        {
          id: typeof entry.id === "string" && entry.id ? entry.id : createMomentId(),
          text: typeof entry.text === "string" ? entry.text : "",
          detail: typeof entry.detail === "string" ? entry.detail : ""
        }
      ];
    });
  }

  function cycleValueVote(value: string) {
    setData((current) => {
      const currentVote = current.valueVotes[value] ?? "";
      const nextVote: ValueVote = currentVote === "" ? "mine" : currentVote === "mine" ? "maybe" : "";
      const nextVotes = { ...current.valueVotes };

      if (nextVote) {
        nextVotes[value] = nextVote;
      } else {
        delete nextVotes[value];
      }

      return { ...current, valueVotes: nextVotes };
    });
  }

  function addCustomValue(category: ValueBankCategory) {
    const value = (customValueInputs[category.id] ?? "").trim();
    if (!value) {
      return;
    }

    setData((current) => {
      const existingValues = new Set([...category.values, ...(current.customValues[category.id] ?? [])]);
      if (existingValues.has(value)) {
        return current;
      }

      return {
        ...current,
        customValues: {
          ...current.customValues,
          [category.id]: [...(current.customValues[category.id] ?? []), value]
        }
      };
    });
    setCustomValueInputs((current) => ({ ...current, [category.id]: "" }));
  }

  function addCustomChecklistItem(category: ChecklistCategory) {
    const label = (customChecklistInputs[category.id] ?? "").trim();
    if (!label) {
      return;
    }

    setData((current) => {
      const existingLabels = new Set(
        [...category.items, ...(current.customChecklistItems[category.id] ?? [])].map((item) => item.label.toLowerCase())
      );
      if (existingLabels.has(label.toLowerCase())) {
        return current;
      }

      return {
        ...current,
        customChecklistItems: {
          ...current.customChecklistItems,
          [category.id]: [...(current.customChecklistItems[category.id] ?? []), { id: createMomentId(), label }]
        }
      };
    });
    setCustomChecklistInputs((current) => ({ ...current, [category.id]: "" }));
  }

  function updatePromptNote(promptId: string, value: string) {
    setData((current) => ({
      ...current,
      promptNotes: {
        ...current.promptNotes,
        [promptId]: value
      }
    }));
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${config.storageKey}.json`;
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
        const parsed = JSON.parse(text) as Partial<ReflectionWorkbookData>;
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("Invalid workbook JSON");
        }

        setData({
          savedCards: Array.isArray(parsed.savedCards) ? parsed.savedCards : [],
          cardComments: normalizeStringRecord(parsed.cardComments),
          valueVotes: normalizeValueVotes(parsed.valueVotes),
          customValues: normalizeCustomValues(parsed.customValues, config),
          promptNotes: { ...createEmptyPromptNotes(config), ...parsed.promptNotes },
          checklist: normalizeBooleanRecord(parsed.checklist),
          customChecklistItems: normalizeCustomChecklistItems(parsed.customChecklistItems, config),
          moments: normalizeMoments(parsed.moments),
          noteEntries: normalizeNoteEntries(parsed.noteEntries),
          freeNotes: typeof parsed.freeNotes === "string" ? parsed.freeNotes : "",
          mode: parsed.mode === "calm" ? "calm" : "lively"
        });
      })
      .catch(() => setImportError("Could not import that JSON file."))
      .finally(() => {
        event.target.value = "";
      });
  }

  function resetWorkbook() {
    if (!window.confirm(`Reset your ${config.title.toLowerCase()} workbook on this device?`)) {
      return;
    }

    setData(createEmptyData(config));
  }

  function resetCardsTab() {
    if (!window.confirm("Reset the inspiration cards tab on this device?")) {
      return;
    }

    setData((current) => ({
      ...current,
      savedCards: [],
      cardComments: {},
      valueVotes: {},
      customValues: {}
    }));
    setCustomValueInputs({});
  }

  function resetPromptsTab() {
    if (!window.confirm("Reset the gentle prompts tab on this device?")) {
      return;
    }

    setData((current) => ({
      ...current,
      promptNotes: createEmptyPromptNotes(config),
      checklist: {}
    }));
  }

  function toggleChecklistItem(itemId: string) {
    setData((current) => ({
      ...current,
      checklist: {
        ...current.checklist,
        [itemId]: !current.checklist[itemId]
      }
    }));
  }

  function addMoment() {
    setData((current) => ({
      ...current,
      moments: [...current.moments, { id: createMomentId(), moment: "", reason: "" }]
    }));
  }

  function updateMoment(momentId: string, field: "moment" | "reason", value: string) {
    setData((current) => ({
      ...current,
      moments: current.moments.map((moment) => (moment.id === momentId ? { ...moment, [field]: value } : moment))
    }));
  }

  function deleteMoment(momentId: string) {
    setData((current) => ({
      ...current,
      moments: current.moments.filter((moment) => moment.id !== momentId)
    }));
  }

  function resetMomentsTab() {
    if (!window.confirm("Reset the recent moments tab on this device?")) {
      return;
    }

    setData((current) => ({
      ...current,
      moments: []
    }));
  }

  function resetNotesTab() {
    if (!window.confirm("Reset the open notes tab on this device?")) {
      return;
    }

    setData((current) => ({
      ...current,
      noteEntries: [],
      freeNotes: ""
    }));
  }

  function addNoteEntry() {
    setData((current) => ({
      ...current,
      noteEntries: [...current.noteEntries, { id: createMomentId(), text: "", detail: "" }]
    }));
  }

  function updateNoteEntry(noteId: string, field: "text" | "detail", value: string) {
    setData((current) => ({
      ...current,
      noteEntries: current.noteEntries.map((note) => (note.id === noteId ? { ...note, [field]: value } : note))
    }));
  }

  function deleteNoteEntry(noteId: string) {
    setData((current) => ({
      ...current,
      noteEntries: current.noteEntries.filter((note) => note.id !== noteId)
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

  function saveCardsTabJpg() {
    const scale = 2;
    const width = 1320;
    const margin = 56;
    const innerX = 92;
    const innerWidth = width - innerX * 2;
    const selectedValues = Object.entries(data.valueVotes);
    const cardComments = config.cards
      .map((card) => ({ title: card.title, comment: data.cardComments[card.id]?.trim() ?? "" }))
      .filter((item) => item.comment);
    const valueRows = selectedValues.length ? Math.ceil(selectedValues.length / 3) : 1;
    const commentRows = cardComments.length ? cardComments.length : 1;
    const height = 300 + valueRows * 58 + commentRows * 128 + 180;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.scale(scale, scale);
    context.fillStyle = data.mode === "calm" ? "#ECE4D6" : "#F3E8D2";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#2A2521";
    context.lineWidth = 3;
    context.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    context.fillStyle = "#2A2521";
    context.font = "700 56px Arial";
    context.fillText(config.title, innerX, 126);
    context.font = "700 24px Arial";
    context.fillStyle = data.mode === "calm" ? "#6C8981" : "#166E66";
    context.fillText("Inspiration cards", innerX, 166);
    context.font = "400 22px Arial";
    context.fillStyle = "#6B6457";
    context.fillText(config.cardsIntro, innerX, 206);

    let y = 270;
    context.fillStyle = "#2A2521";
    context.font = "700 30px Arial";
    context.fillText("Values marked", innerX, y);
    y += 36;

    if (selectedValues.length) {
      selectedValues.forEach(([value, vote], index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        const chipWidth = (innerWidth - 28) / 3;
        const x = innerX + column * (chipWidth + 14);
        const chipY = y + row * 58;
        context.fillStyle = vote === "mine" ? (data.mode === "calm" ? "#6C8981" : "#166E66") : "#F4A82C";
        context.strokeStyle = "#2A2521";
        context.lineWidth = 2;
        context.fillRect(x, chipY, chipWidth, 42);
        context.strokeRect(x, chipY, chipWidth, 42);
        context.fillStyle = vote === "mine" ? "#FFF9EC" : "#2A2521";
        context.font = "700 18px Arial";
        drawWrappedText(context, `${value} · ${vote === "mine" ? "This is my value" : "Maybe"}`, x + 14, chipY + 27, chipWidth - 28, 22);
      });
      y += valueRows * 58 + 42;
    } else {
      context.fillStyle = "#6B6457";
      context.font = "400 22px Arial";
      context.fillText("No values marked yet.", innerX, y);
      y += 74;
    }

    context.fillStyle = "#2A2521";
    context.font = "700 30px Arial";
    context.fillText("Card comments", innerX, y);
    y += 34;

    if (cardComments.length) {
      cardComments.forEach((item) => {
        context.fillStyle = "#FFF9EC";
        context.strokeStyle = "#2A2521";
        context.lineWidth = 2;
        context.fillRect(innerX, y, innerWidth, 104);
        context.strokeRect(innerX, y, innerWidth, 104);
        context.fillStyle = "#2A2521";
        context.font = "700 20px Arial";
        context.fillText(item.title, innerX + 20, y + 32);
        context.font = "400 19px Arial";
        drawWrappedText(context, item.comment, innerX + 20, y + 66, innerWidth - 40, 26);
        y += 128;
      });
    } else {
      context.fillStyle = "#6B6457";
      context.font = "400 22px Arial";
      context.fillText("No card comments yet.", innerX, y);
    }

    const link = document.createElement("a");
    link.download = `${config.storageKey}-inspiration-cards.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  function savePromptsTabJpg() {
    const scale = 2;
    const width = 1320;
    const margin = 56;
    const innerX = 92;
    const innerWidth = width - innerX * 2;
    const promptHeight = 170;
    const selectedValues = Object.entries(data.valueVotes);
    const checkedItems = config.checklist?.categories.flatMap((category) =>
      [...category.items, ...(data.customChecklistItems[category.id] ?? [])]
        .filter((item) => data.checklist[item.id])
        .map((item) => ({ category: category.title, label: item.label }))
    );
    const valueRows = selectedValues.length ? Math.ceil(selectedValues.length / 3) : 0;
    const valuesHeight = config.valueBank ? 94 + Math.max(valueRows, 1) * 54 : 0;
    const checklistRows = config.checklist ? Math.max(checkedItems?.length ?? 0, 1) : 0;
    const height = config.checklist
      ? 310 + checklistRows * 72 + 120
      : 270 + valuesHeight + config.prompts.length * promptHeight + 100;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.scale(scale, scale);
    context.fillStyle = data.mode === "calm" ? "#ECE4D6" : "#F3E8D2";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#2A2521";
    context.lineWidth = 3;
    context.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
    context.fillStyle = "#2A2521";
    context.font = "700 56px Arial";
    context.fillText(config.title, innerX, 126);
    context.font = "700 24px Arial";
    context.fillStyle = data.mode === "calm" ? "#6C8981" : "#166E66";
    context.fillText(config.promptsTitle, innerX, 166);
    context.font = "400 22px Arial";
    context.fillStyle = "#6B6457";
    context.fillText(config.promptsIntro, innerX, 206);

    let y = 270;
    if (config.checklist) {
      context.fillStyle = "#2A2521";
      context.font = "700 30px Arial";
      context.fillText("Checked items", innerX, y);
      y += 42;

      if (checkedItems?.length) {
        checkedItems.forEach((item, index) => {
          context.fillStyle = index % 2 === 0 ? "#FFF9EC" : "#F8EDD9";
          context.strokeStyle = "#2A2521";
          context.lineWidth = 2;
          context.fillRect(innerX, y, innerWidth, 52);
          context.strokeRect(innerX, y, innerWidth, 52);
          context.fillStyle = "#2A2521";
          context.font = "700 19px Arial";
          context.fillText(item.category, innerX + 18, y + 32);
          context.font = "400 19px Arial";
          context.fillText(item.label, innerX + 250, y + 32);
          y += 72;
        });
      } else {
        context.fillStyle = "#6B6457";
        context.font = "400 22px Arial";
        context.fillText("Nothing checked yet.", innerX, y);
      }

      const link = document.createElement("a");
      link.download = `${config.storageKey}-body-checklist.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.92);
      link.click();
      return;
    }

    if (config.valueBank) {
      y = drawValuesSummaryOnCanvas(context, selectedValues, innerX, y, innerWidth, data.mode);
    }

    config.prompts.forEach((prompt, index) => {
      const note = data.promptNotes[prompt.id] || "Blank for now.";
      context.fillStyle = index % 2 === 0 ? "#FFF9EC" : "#F8EDD9";
      context.strokeStyle = "#2A2521";
      context.lineWidth = 2;
      context.fillRect(innerX, y, innerWidth, promptHeight - 22);
      context.strokeRect(innerX, y, innerWidth, promptHeight - 22);
      context.fillStyle = "#2A2521";
      context.font = "700 22px Arial";
      context.fillText(prompt.title, innerX + 20, y + 34);
      context.font = "400 19px Arial";
      drawWrappedText(context, prompt.prompt, innerX + 20, y + 66, innerWidth - 40, 25);
      context.fillStyle = "#6B6457";
      drawWrappedText(context, note, innerX + 20, y + 112, innerWidth - 40, 24);
      y += promptHeight;
    });

    const link = document.createElement("a");
    link.download = `${config.storageKey}-gentle-prompts.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  function saveNotesTabJpg() {
    const scale = 2;
    const width = 1320;
    const margin = 56;
    const innerX = 92;
    const innerWidth = width - innerX * 2;
    const filledEntries = data.noteEntries.filter((note) => note.text.trim() || note.detail?.trim());
    const noteLength = config.noteEntries
      ? filledEntries.reduce((total, note) => total + note.text.trim().length + (note.detail?.trim().length ?? 0), 0)
      : data.freeNotes.trim().length;
    const entryHeight = 180;
    const height = config.noteEntries
      ? Math.max(720, 340 + Math.max(filledEntries.length, 1) * entryHeight + 80)
      : Math.max(720, 360 + Math.ceil(noteLength / 95) * 34);
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.scale(scale, scale);
    context.fillStyle = data.mode === "calm" ? "#ECE4D6" : "#F3E8D2";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#2A2521";
    context.lineWidth = 3;
    context.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
    context.fillStyle = "#2A2521";
    context.font = "700 56px Arial";
    context.fillText(config.title, innerX, 126);
    context.font = "700 24px Arial";
    context.fillStyle = data.mode === "calm" ? "#6C8981" : "#166E66";
    context.fillText(config.notesTitle, innerX, 166);
    context.font = "400 22px Arial";
    context.fillStyle = "#6B6457";
    context.fillText(config.notesIntro, innerX, 206);

    if (config.noteEntries) {
      let y = 280;
      if (filledEntries.length) {
        filledEntries.forEach((note, index) => {
          context.fillStyle = index % 2 === 0 ? "#FFF9EC" : "#F8EDD9";
          context.strokeStyle = "#2A2521";
          context.lineWidth = 2;
          context.fillRect(innerX, y, innerWidth, entryHeight - 24);
          context.strokeRect(innerX, y, innerWidth, entryHeight - 24);
          context.fillStyle = "#2A2521";
          context.font = "700 22px Arial";
          context.fillText(`${config.noteEntries?.entryTitle} ${index + 1}`, innerX + 20, y + 34);
          context.font = "400 20px Arial";
          const nextY = drawWrappedText(context, note.text || "Blank for now.", innerX + 20, y + 72, innerWidth - 40, 28);
          if (config.noteEntries?.detailLabel) {
            context.fillStyle = "#6B6457";
            drawWrappedText(context, note.detail || "No context or insight yet.", innerX + 20, nextY + 18, innerWidth - 40, 26);
          }
          y += entryHeight;
        });
      } else {
        context.fillStyle = "#FFF9EC";
        context.strokeStyle = "#2A2521";
        context.lineWidth = 2;
        context.fillRect(innerX, y, innerWidth, 140);
        context.strokeRect(innerX, y, innerWidth, 140);
        context.fillStyle = "#6B6457";
        context.font = "400 24px Arial";
        drawWrappedText(context, config.noteEntries.emptyText, innerX + 24, y + 58, innerWidth - 48, 32);
      }
    } else {
      context.fillStyle = "#FFF9EC";
      context.strokeStyle = "#2A2521";
      context.lineWidth = 2;
      context.fillRect(innerX, 270, innerWidth, height - 360);
      context.strokeRect(innerX, 270, innerWidth, height - 360);
      context.fillStyle = "#2A2521";
      context.font = "400 22px Arial";
      drawWrappedText(context, data.freeNotes || "Blank for now.", innerX + 24, 318, innerWidth - 48, 32);
    }

    const link = document.createElement("a");
    link.download = `${config.storageKey}-open-notes.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  function saveMomentsTabJpg() {
    if (!config.moments) {
      return;
    }

    const scale = 2;
    const width = 1320;
    const margin = 56;
    const innerX = 92;
    const innerWidth = width - innerX * 2;
    const filledMoments = data.moments.filter((moment) => moment.moment.trim() || moment.reason.trim());
    const rowCount = Math.max(filledMoments.length, 1);
    const height = 300 + rowCount * 180 + 120;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.scale(scale, scale);
    context.fillStyle = data.mode === "calm" ? "#ECE4D6" : "#F3E8D2";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#2A2521";
    context.lineWidth = 3;
    context.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    context.fillStyle = "#2A2521";
    context.font = "700 56px Arial";
    context.fillText(config.title, innerX, 126);
    context.font = "700 24px Arial";
    context.fillStyle = data.mode === "calm" ? "#6C8981" : "#166E66";
    context.fillText(config.moments.title, innerX, 166);
    context.font = "400 22px Arial";
    context.fillStyle = "#6B6457";
    drawWrappedText(context, config.moments.intro, innerX, 206, innerWidth, 30);

    let y = 300;
    if (filledMoments.length) {
      filledMoments.forEach((moment, index) => {
        context.fillStyle = index % 2 === 0 ? "#FFF9EC" : "#F8EDD9";
        context.strokeStyle = "#2A2521";
        context.lineWidth = 2;
        context.fillRect(innerX, y, innerWidth, 150);
        context.strokeRect(innerX, y, innerWidth, 150);
        context.fillStyle = "#2A2521";
        context.font = "700 22px Arial";
        context.fillText(`Moment ${index + 1}`, innerX + 20, y + 34);
        context.font = "400 20px Arial";
        const nextY = drawWrappedText(context, moment.moment || "Blank for now.", innerX + 20, y + 68, innerWidth - 40, 26);
        context.fillStyle = "#6B6457";
        drawWrappedText(context, moment.reason || "Why it mattered is still open.", innerX + 20, nextY + 20, innerWidth - 40, 25);
        y += 180;
      });
    } else {
      context.fillStyle = "#FFF9EC";
      context.strokeStyle = "#2A2521";
      context.lineWidth = 2;
      context.fillRect(innerX, y, innerWidth, 130);
      context.strokeRect(innerX, y, innerWidth, 130);
      context.fillStyle = "#6B6457";
      context.font = "400 24px Arial";
      drawWrappedText(context, config.moments.emptyText, innerX + 24, y + 56, innerWidth - 48, 32);
    }

    const link = document.createElement("a");
    link.download = `${config.storageKey}-recent-moments.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  function drawValuesSummaryOnCanvas(
    context: CanvasRenderingContext2D,
    selectedValues: Array<[string, ValueVote]>,
    x: number,
    y: number,
    width: number,
    mode: Mode
  ) {
    context.fillStyle = "#2A2521";
    context.font = "700 26px Arial";
    context.fillText("Values from the first tab", x, y);
    y += 36;

    if (!selectedValues.length) {
      context.fillStyle = "#6B6457";
      context.font = "400 20px Arial";
      context.fillText("No values marked yet.", x, y);
      return y + 58;
    }

    selectedValues.forEach(([value, vote], index) => {
      const column = index % 3;
      const row = Math.floor(index / 3);
      const chipWidth = (width - 28) / 3;
      const chipX = x + column * (chipWidth + 14);
      const chipY = y + row * 54;
      context.fillStyle = vote === "mine" ? (mode === "calm" ? "#6C8981" : "#166E66") : "#F4A82C";
      context.strokeStyle = "#2A2521";
      context.lineWidth = 2;
      context.fillRect(chipX, chipY, chipWidth, 40);
      context.strokeRect(chipX, chipY, chipWidth, 40);
      context.fillStyle = vote === "mine" ? "#FFF9EC" : "#2A2521";
      context.font = "700 17px Arial";
      drawWrappedText(context, `${value} · ${vote === "mine" ? "This is my value" : "Maybe"}`, chipX + 12, chipY + 26, chipWidth - 24, 20);
    });

    return y + Math.ceil(selectedValues.length / 3) * 54 + 44;
  }

  return (
    <main className="shell reflection-shell" translate="no">
      <header className="topbar no-print">
        <div>
          <p className="eyebrow">{config.eyebrow}</p>
          <h1>{config.title}</h1>
        </div>
        <div className="mode-switch" aria-label="Presentation mode">
          <button
            aria-pressed={data.mode === "lively"}
            className={data.mode === "lively" ? "active" : ""}
            onClick={() => setMode("lively")}
            type="button"
          >
            Lively
          </button>
          <button
            aria-pressed={data.mode === "calm"}
            className={data.mode === "calm" ? "active" : ""}
            onClick={() => setMode("calm")}
            type="button"
          >
            Calm
          </button>
        </div>
      </header>

      <section className="privacy-note no-print" aria-label="Privacy note">
        <strong>Private by default.</strong> {config.privacyNote}
      </section>

      <div className="workbook-panels no-print">
        <aside className="section-tabs" aria-label={`${config.title} sections`}>
          <button className={activePanel === "cards" ? "active" : ""} onClick={() => setActivePanel("cards")} type="button">
            <span>1</span>
            {config.cardsTabLabel ?? "Inspiration cards"}
          </button>
          {hasPrompts && (
            <button
              className={activePanel === "prompts" ? "active" : ""}
              onClick={() => setActivePanel("prompts")}
              type="button"
            >
              <span>2</span>
              {config.promptsTabLabel ?? "Gentle prompts"}
            </button>
          )}
          {config.moments && (
            <button
              className={activePanel === "moments" ? "active" : ""}
              onClick={() => setActivePanel("moments")}
              type="button"
            >
              <span>{hasPrompts ? "3" : "2"}</span>
              {config.moments.tabLabel}
            </button>
          )}
          <button className={activePanel === "notes" ? "active" : ""} onClick={() => setActivePanel("notes")} type="button">
            <span>{config.moments ? (hasPrompts ? "4" : "3") : hasPrompts ? "3" : "2"}</span>
            {config.notesTabLabel ?? "Open notes"}
          </button>

          <div className="sidebar-tools">
            <button type="button" onClick={exportJson}>Export JSON</button>
            <label className="file-button">
              Import JSON
              <input type="file" accept="application/json" onChange={importJson} />
            </label>
            <button type="button" onClick={resetWorkbook}>Reset workbook</button>
            {importError && <p className="error" role="alert">{importError}</p>}
            <p className="inline-save-status" aria-live="polite">{saveState}</p>
          </div>
        </aside>

        <div className="panel-stack">
          <section className="sensory-panel reflection-panel" hidden={activePanel !== "cards"} aria-labelledby="reflection-cards-title">
            <div className="sensory-panel-header">
              <div>
                <p className="eyebrow">{config.eyebrow}</p>
                <h2 id="reflection-cards-title">{config.cardsTitle}</h2>
                <p className="prompt">{config.cardsIntro}</p>
              </div>
              <div className="sensory-panel-actions">
                <button type="button" onClick={saveCardsTabJpg}>Save JPG</button>
                <button type="button" onClick={resetCardsTab}>Reset this tab</button>
              </div>
            </div>
            <div className="sensory-card-grid">
              {config.cards.map((card) => {
                return (
                  <article
                    className={`sensory-card reflection-card ${animatedCard === card.id ? "voted" : ""}`}
                    key={card.id}
                    style={{ "--sense-color": card.color } as CSSProperties}
                  >
                    <div className="sense-mark reflection-mark" aria-hidden="true" />
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                    <small>{card.notice}</small>
                    <label className="card-comment">
                      Comment
                      <textarea
                        value={data.cardComments[card.id] ?? ""}
                        onChange={(event) => updateCardComment(card.id, event.target.value)}
                        placeholder="What does this card make you notice?"
                      />
                    </label>
                  </article>
                );
              })}
            </div>

            {config.valueBank && (
              <section className="value-bank" aria-labelledby="value-bank-title">
                <div className="value-bank-header">
                  <div>
                    <h3 id="value-bank-title">{config.valueBank.title}</h3>
                    <p>{config.valueBank.intro}</p>
                  </div>
                  <div className="value-bank-key" aria-label="Value selection key">
                    <span className="value-key-mine">This is my value</span>
                    <span className="value-key-maybe">Maybe</span>
                  </div>
                </div>
                <div className="value-category-grid">
                  {config.valueBank.categories.map((category) => (
                    <section className="value-category" key={category.id}>
                      <h4>{category.title}</h4>
                      <div className="value-chip-grid">
                        {[...category.values, ...(data.customValues[category.id] ?? [])].map((value) => {
                          const vote = data.valueVotes[value] ?? "";
                          const label =
                            vote === "mine"
                              ? `${value}. Selected as this is my value. Click to mark maybe.`
                              : vote === "maybe"
                                ? `${value}. Marked maybe. Click to clear.`
                                : `${value}. Not selected. Click to mark this is my value.`;

                          return (
                            <button
                              aria-label={label}
                              className={vote ? `value-chip ${vote}` : "value-chip"}
                              key={value}
                              onClick={() => cycleValueVote(value)}
                              type="button"
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                      <div className="custom-value-add">
                        <input
                          aria-label={`Add a value to ${category.title}`}
                          value={customValueInputs[category.id] ?? ""}
                          onChange={(event) =>
                            setCustomValueInputs((current) => ({ ...current, [category.id]: event.target.value }))
                          }
                          placeholder="Add your own value"
                        />
                        <button type="button" onClick={() => addCustomValue(category)}>
                          Add
                        </button>
                      </div>
                    </section>
                  ))}
                </div>
              </section>
            )}
          </section>

          {hasPrompts && (
            <section className="sensory-panel reflection-panel" hidden={activePanel !== "prompts"} aria-labelledby="reflection-prompts-title">
              <div className="sensory-panel-header">
                <div>
                  <p className="eyebrow">{config.eyebrow}</p>
                  <h2 id="reflection-prompts-title">{config.promptsTitle}</h2>
                  <p className="prompt">{config.promptsIntro}</p>
                </div>
                <div className="sensory-panel-actions">
                  <button type="button" onClick={savePromptsTabJpg}>Save JPG</button>
                  <button type="button" onClick={resetPromptsTab}>Reset this tab</button>
                </div>
              </div>
              {config.valueBank && !config.checklist && (
                <section className="prompt-values-summary" aria-label="Values selected in the first tab">
                  <div>
                    <h3>This is my value</h3>
                    <ul>
                      {Object.entries(data.valueVotes).filter(([, vote]) => vote === "mine").length ? (
                        Object.entries(data.valueVotes)
                          .filter(([, vote]) => vote === "mine")
                          .map(([value]) => <li key={value}>{value}</li>)
                      ) : (
                        <li>Nothing selected yet</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3>Maybe</h3>
                    <ul>
                      {Object.entries(data.valueVotes).filter(([, vote]) => vote === "maybe").length ? (
                        Object.entries(data.valueVotes)
                          .filter(([, vote]) => vote === "maybe")
                          .map(([value]) => <li key={value}>{value}</li>)
                      ) : (
                        <li>Nothing marked maybe yet</li>
                      )}
                    </ul>
                  </div>
                </section>
              )}
              {config.checklist ? (
                <div className="body-checklist-grid">
                  {config.checklist.categories.map((category) => (
                    <section className="body-checklist-card" key={category.id}>
                      <h3>{category.title}</h3>
                      <div className="body-checklist-items">
                        {[...category.items, ...(data.customChecklistItems[category.id] ?? [])].map((item) => (
                          <label className="body-check-item" key={item.id}>
                            <input
                              checked={Boolean(data.checklist[item.id])}
                              onChange={() => toggleChecklistItem(item.id)}
                              type="checkbox"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="custom-check-add">
                        <input
                          aria-label={`Add a checklist item to ${category.title}`}
                          value={customChecklistInputs[category.id] ?? ""}
                          onChange={(event) =>
                            setCustomChecklistInputs((current) => ({ ...current, [category.id]: event.target.value }))
                          }
                          placeholder="Add your own check"
                        />
                        <button type="button" onClick={() => addCustomChecklistItem(category)}>
                          Add
                        </button>
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="sensory-test">
                  {config.prompts.map((prompt) => (
                    <section className="sensory-test-row reflection-prompt-row" key={prompt.id}>
                      <h3>{prompt.title}</h3>
                      <p className="reality-prompt">{prompt.prompt}</p>
                      <label className="profile-comment">
                        What feels true, interesting, or unfinished here?
                        <textarea
                          value={data.promptNotes[prompt.id] ?? ""}
                          onChange={(event) => updatePromptNote(prompt.id, event.target.value)}
                          placeholder="A few words are enough. You do not need to make a final statement."
                        />
                      </label>
                    </section>
                  ))}
                </div>
              )}
            </section>
          )}

          {config.moments && (
            <section
              className="sensory-panel reflection-panel"
              hidden={activePanel !== "moments"}
              aria-labelledby="reflection-moments-title"
            >
              <div className="sensory-panel-header">
                <div>
                  <p className="eyebrow">{config.eyebrow}</p>
                  <h2 id="reflection-moments-title">{config.moments.title}</h2>
                  <p className="prompt">{config.moments.intro}</p>
                </div>
                <div className="sensory-panel-actions">
                  <button type="button" onClick={saveMomentsTabJpg}>{config.moments.saveJpgLabel}</button>
                  <button type="button" onClick={resetMomentsTab}>Reset this tab</button>
                </div>
              </div>

              <div className="moment-toolbar">
                <button type="button" onClick={addMoment}>{config.moments.addButtonLabel}</button>
              </div>

              {data.moments.length ? (
                <div className="moment-list">
                  {data.moments.map((moment, index) => (
                    <article className="moment-card" key={moment.id}>
                      <div className="moment-card-header">
                        <h3>Moment {index + 1}</h3>
                        <button type="button" onClick={() => deleteMoment(moment.id)}>Delete</button>
                      </div>
                      <div className="moment-fields">
                        <label>
                          {config.moments?.momentLabel}
                          <textarea
                            value={moment.moment}
                            onChange={(event) => updateMoment(moment.id, "moment", event.target.value)}
                            placeholder={config.moments?.momentPlaceholder}
                          />
                        </label>
                        <label>
                          {config.moments?.reasonLabel}
                          <textarea
                            value={moment.reason}
                            onChange={(event) => updateMoment(moment.id, "reason", event.target.value)}
                            placeholder={config.moments?.reasonPlaceholder}
                          />
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="moment-empty">
                  <p>{config.moments.emptyText}</p>
                </div>
              )}
            </section>
          )}

          <section className="sensory-panel reflection-panel" hidden={activePanel !== "notes"} aria-labelledby="reflection-notes-title">
            <div className="sensory-panel-header">
              <div>
                <p className="eyebrow">{config.eyebrow}</p>
                <h2 id="reflection-notes-title">{config.notesTitle}</h2>
                <p className="prompt">{config.notesIntro}</p>
              </div>
              <div className="sensory-panel-actions">
                <button type="button" onClick={saveNotesTabJpg}>Save JPG</button>
                <button type="button" onClick={resetNotesTab}>Reset this tab</button>
              </div>
            </div>
            {config.noteEntries ? (
              <>
                <div className="note-entry-toolbar">
                  <button type="button" onClick={addNoteEntry}>{config.noteEntries.addButtonLabel}</button>
                </div>
                {data.noteEntries.length ? (
                  <div className="note-entry-list">
                    {data.noteEntries.map((note, index) => (
                      <article className="note-entry-card" key={note.id}>
                        <div className="note-entry-header">
                          <h3>{config.noteEntries?.entryTitle} {index + 1}</h3>
                          <button type="button" onClick={() => deleteNoteEntry(note.id)}>Delete</button>
                        </div>
                        <div className={config.noteEntries?.detailLabel ? "note-entry-fields two-column" : "note-entry-fields"}>
                          <label className="sensory-notes reflection-notes note-entry-field">
                            {config.noteLabel}
                            <textarea
                              value={note.text}
                              onChange={(event) => updateNoteEntry(note.id, "text", event.target.value)}
                              placeholder={config.noteEntries?.placeholder}
                            />
                          </label>
                          {config.noteEntries?.detailLabel && (
                            <label className="sensory-notes reflection-notes note-entry-field">
                              {config.noteEntries.detailLabel}
                              <textarea
                                value={note.detail ?? ""}
                                onChange={(event) => updateNoteEntry(note.id, "detail", event.target.value)}
                                placeholder={config.noteEntries?.detailPlaceholder}
                              />
                            </label>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="moment-empty">
                    <p>{config.noteEntries.emptyText}</p>
                  </div>
                )}
              </>
            ) : (
              <label className="sensory-notes reflection-notes">
                {config.noteLabel}
                <textarea
                  value={data.freeNotes}
                  onChange={(event) => setData((current) => ({ ...current, freeNotes: event.target.value }))}
                  placeholder="Fragments, images, questions, contradictions, small clues..."
                />
              </label>
            )}
            {config.valueBank && (
              <div className="selected-list reflection-kept-list">
                <strong>Values marked</strong>
                <ul>
                  {Object.entries(data.valueVotes).length ? (
                    Object.entries(data.valueVotes).map(([value, vote]) => (
                      <li key={value}>
                        {value} · {vote === "mine" ? "This is my value" : "Maybe"}
                      </li>
                    ))
                  ) : (
                    <li>No values marked yet</li>
                  )}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
