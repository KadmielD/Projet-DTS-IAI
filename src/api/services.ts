import { USE_MOCK } from "@/api/client";
import {
  mockActivities,
  mockCultures,
  mockDiagnosticResults,
  mockExploitations,
  mockNotifications,
  mockPredictions,
  mockSoilAnalyses,
  mockWeather,
} from "@/api/mock";
import type {
  Activity,
  AppNotification,
  Culture,
  DiagnosticResult,
  Exploitation,
  Prediction,
  SoilAnalysis,
  WeatherDay,
} from "@/types";

/** In-memory store so CRUD works while USE_MOCK is true. */
let farmsStore: Exploitation[] = structuredClone(mockExploitations);
let culturesStore: Culture[] = structuredClone(mockCultures);

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function getExploitations(): Promise<Exploitation[]> {
  if (USE_MOCK) return structuredClone(farmsStore);
  return structuredClone(farmsStore);
}

export async function createExploitation(
  data: Omit<Exploitation, "id">,
): Promise<Exploitation> {
  const farm: Exploitation = { ...data, id: uid("e") };
  farmsStore = [farm, ...farmsStore];
  return structuredClone(farm);
}

export async function updateExploitation(
  id: string,
  data: Partial<Omit<Exploitation, "id">>,
): Promise<Exploitation> {
  const idx = farmsStore.findIndex((f) => f.id === id);
  if (idx < 0) throw new Error("Exploitation introuvable");
  farmsStore[idx] = { ...farmsStore[idx], ...data };
  return structuredClone(farmsStore[idx]);
}

export async function deleteExploitation(id: string): Promise<void> {
  farmsStore = farmsStore.filter((f) => f.id !== id);
  culturesStore = culturesStore.filter((c) => c.exploitationId !== id);
}

export async function getCultures(): Promise<Culture[]> {
  if (USE_MOCK) return structuredClone(culturesStore);
  return structuredClone(culturesStore);
}

export async function createCulture(
  data: Omit<Culture, "id">,
): Promise<Culture> {
  const culture: Culture = { ...data, id: uid("c") };
  culturesStore = [culture, ...culturesStore];
  return structuredClone(culture);
}

export async function updateCulture(
  id: string,
  data: Partial<Omit<Culture, "id">>,
): Promise<Culture> {
  const idx = culturesStore.findIndex((c) => c.id === id);
  if (idx < 0) throw new Error("Culture introuvable");
  culturesStore[idx] = { ...culturesStore[idx], ...data };
  return structuredClone(culturesStore[idx]);
}

export async function deleteCulture(id: string): Promise<void> {
  culturesStore = culturesStore.filter((c) => c.id !== id);
}

export async function getActivities(): Promise<Activity[]> {
  if (USE_MOCK) return structuredClone(mockActivities);
  return structuredClone(mockActivities);
}

export async function getPredictions(): Promise<Prediction[]> {
  if (USE_MOCK) return structuredClone(mockPredictions);
  return structuredClone(mockPredictions);
}

export async function getSoilAnalyses(): Promise<SoilAnalysis[]> {
  if (USE_MOCK) return structuredClone(mockSoilAnalyses);
  return structuredClone(mockSoilAnalyses);
}

export async function getNotifications(): Promise<AppNotification[]> {
  if (USE_MOCK) return structuredClone(mockNotifications);
  return structuredClone(mockNotifications);
}

export async function getWeatherForecast(): Promise<WeatherDay[]> {
  if (USE_MOCK) return structuredClone(mockWeather);
  return structuredClone(mockWeather);
}

export async function runDiagnostic(
  _file?: File | null,
): Promise<DiagnosticResult> {
  await new Promise((r) => setTimeout(r, 800));
  if (USE_MOCK) return structuredClone(mockDiagnosticResults[0]);
  return structuredClone(mockDiagnosticResults[0]);
}

export async function markNotificationRead(
  id: string,
  list: AppNotification[],
): Promise<AppNotification[]> {
  return list.map((n) => (n.id === id ? { ...n, read: true } : n));
}
