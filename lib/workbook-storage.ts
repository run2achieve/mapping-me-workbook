export type EnergyStepId =
  | "givesEnergy"
  | "usesEnergy"
  | "lowEnergyBody"
  | "recharge"
  | "summary";

export type WorkbookMode = "lively" | "calm";
export type MetricId = "peacefulness" | "energy" | "productivity";
export type MetricLevel = "low" | "medium" | "high" | "";

export type DailyEnergyRecord = {
  date: string;
  metrics: Record<MetricId, MetricLevel[]>;
  comment: string;
  summary: string;
};

export type WorkbookData = {
  version: 1;
  updatedAt: string;
  mode: WorkbookMode;
  currentStep: EnergyStepId;
  energy: Record<EnergyStepId, string>;
  selectedCards: Record<EnergyStepId, string[]>;
  customCards: Record<EnergyStepId, string[]>;
  dailyRecords: Record<string, DailyEnergyRecord>;
};

const DB_NAME = "mapping-me-workbook";
const STORE_NAME = "workbook";
const WORKBOOK_KEY = "current";

export const energySteps: Array<{
  id: EnergyStepId;
  title: string;
  prompt: string;
  suggestions: string[];
}> = [
  {
    id: "givesEnergy",
    title: "What gives me energy?",
    prompt: "Notice people, places, routines, interests, and tiny moments that help you feel more available.",
    suggestions: ["Quiet time", "Movement", "Special interests", "Being outside", "Music", "Predictable plans"]
  },
  {
    id: "usesEnergy",
    title: "What uses up my energy?",
    prompt: "Name things that take effort. This is not about blame or weakness.",
    suggestions: ["Noise", "Transitions", "Masking", "Unclear instructions", "Crowds", "Too many choices"]
  },
  {
    id: "lowEnergyBody",
    title: "How does low energy feel in my body?",
    prompt: "Describe body signals that tell you your energy is getting low.",
    suggestions: ["Heavy limbs", "Tight chest", "Headache", "Hard to speak", "Restless", "Sensitive to touch"]
  },
  {
    id: "recharge",
    title: "What helps me recharge?",
    prompt: "List supports, boundaries, and conditions that help energy come back.",
    suggestions: ["Dim lights", "Food or water", "No talking", "A known routine", "Pressure blanket", "A short walk"]
  },
  {
    id: "summary",
    title: "My Energy Map summary",
    prompt: "Pull together what you want to remember about your energy.",
    suggestions: ["I want others to know", "My early signals", "My best recharge options", "One change to try"]
  }
];

export const metricRows: Array<{
  id: MetricId;
  title: string;
  description: string;
  color: string;
}> = [
  {
    id: "peacefulness",
    title: "Peacefulness",
    description: "How settled, safe, or easeful the hour feels.",
    color: "#166E66"
  },
  {
    id: "energy",
    title: "Energy",
    description: "How available your body and mind feel.",
    color: "#EE5A3A"
  },
  {
    id: "productivity",
    title: "Productivity",
    description: "How much you were able to move things forward.",
    color: "#6B4A9E"
  }
];

export const metricLevels: Array<{
  id: Exclude<MetricLevel, "">;
  label: string;
}> = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Mid" },
  { id: "high", label: "High" }
];

export const dayHours = Array.from({ length: 24 }, (_, index) => (index + 5) % 24);

export function getTodayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function createDailyEnergyRecord(date = getTodayKey()): DailyEnergyRecord {
  return {
    date,
    metrics: {
      peacefulness: Array(24).fill(""),
      energy: Array(24).fill(""),
      productivity: Array(24).fill("")
    },
    comment: "",
    summary: ""
  };
}

export function createEmptyWorkbook(): WorkbookData {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    mode: "lively",
    currentStep: "givesEnergy",
    energy: {
      givesEnergy: "",
      usesEnergy: "",
      lowEnergyBody: "",
      recharge: "",
      summary: ""
    },
    selectedCards: {
      givesEnergy: [],
      usesEnergy: [],
      lowEnergyBody: [],
      recharge: [],
      summary: []
    },
    customCards: {
      givesEnergy: [],
      usesEnergy: [],
      lowEnergyBody: [],
      recharge: [],
      summary: []
    },
    dailyRecords: {}
  };
}

export function normalizeWorkbook(value: Partial<WorkbookData> | null | undefined): WorkbookData {
  const empty = createEmptyWorkbook();

  if (!value) {
    return empty;
  }

  const normalizedRecords = Object.fromEntries(
    Object.entries(value.dailyRecords ?? {}).map(([date, record]) => {
      const fallback = createDailyEnergyRecord(date);
      const legacyMetrics = record.metrics as Partial<Record<MetricId | "emotion", MetricLevel[]>> | undefined;

      return [
        date,
        {
          ...fallback,
          ...record,
          date,
          metrics: {
            peacefulness: [...fallback.metrics.peacefulness].map(
              (_, index) => legacyMetrics?.peacefulness?.[index] ?? legacyMetrics?.emotion?.[index] ?? ""
            ),
            energy: [...fallback.metrics.energy].map((_, index) => legacyMetrics?.energy?.[index] ?? ""),
            productivity: [...fallback.metrics.productivity].map(
              (_, index) => legacyMetrics?.productivity?.[index] ?? ""
            )
          }
        }
      ];
    })
  );

  return {
    ...empty,
    ...value,
    version: 1,
    mode: value.mode === "calm" ? "calm" : "lively",
    currentStep: energySteps.some((step) => step.id === value.currentStep) ? value.currentStep! : "givesEnergy",
    energy: { ...empty.energy, ...value.energy },
    selectedCards: { ...empty.selectedCards, ...value.selectedCards },
    customCards: { ...empty.customCards, ...value.customCards },
    dailyRecords: normalizedRecords
  };
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadWorkbook(): Promise<WorkbookData | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(WORKBOOK_KEY);

    request.onsuccess = () => resolve(normalizeWorkbook(request.result ?? null));
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function saveWorkbook(data: WorkbookData): Promise<void> {
  const db = await openDatabase();
  const stamped = { ...data, updatedAt: new Date().toISOString() };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const request = transaction.objectStore(STORE_NAME).put(stamped, WORKBOOK_KEY);

    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

export function validateWorkbookImport(value: unknown): WorkbookData {
  if (!value || typeof value !== "object") {
    throw new Error("Import file must contain a workbook object.");
  }

  const data = value as Partial<WorkbookData>;
  const empty = createEmptyWorkbook();
  const stepIds = energySteps.map((step) => step.id);

  if (data.version !== 1) {
    throw new Error("Unsupported workbook version.");
  }

  if (data.mode !== "lively" && data.mode !== "calm") {
    throw new Error("Workbook mode is missing or invalid.");
  }

  for (const id of stepIds) {
    if (typeof data.energy?.[id] !== "string") {
      throw new Error(`Missing text answer for ${id}.`);
    }
  }

  return normalizeWorkbook({
    ...empty,
    ...data,
    updatedAt: new Date().toISOString(),
    currentStep: stepIds.includes(data.currentStep as EnergyStepId) ? (data.currentStep as EnergyStepId) : "givesEnergy"
  });
}
