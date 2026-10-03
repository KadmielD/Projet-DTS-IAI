import { API_BASE_URL, USE_MOCK } from "@/api/client";
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
  AiStatus,
  AppNotification,
  Culture,
  DiagnosticResult,
  Exploitation,
  Prediction,
  PredictionAIResponse,
  SoilAnalysis,
  SoilAnalysisAIResponse,
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

export async function getAiStatus(): Promise<AiStatus> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai/status`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      return (await res.json()) as AiStatus;
    }
  } catch {
    // Backend offline or unreachable
  }
  return {
    status: "fallback_mode",
    has_openai_key: false,
    vision_model: "gpt-4o",
    text_model: "gpt-4o-mini",
  };
}

export async function runDiagnostic(
  file?: File | null,
): Promise<DiagnosticResult> {
  // If file is provided, try sending to backend
  if (file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/api/ai/diagnostic`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return {
          id: `diag-${Date.now()}`,
          disease: data.disease,
          severity: data.severity as "faible" | "moyen" | "eleve",
          confidence: data.confidence,
          recommendations: data.recommendations,
          photoName: file.name,
          createdAt: new Date().toISOString().split("T")[0],
          symptoms: data.symptoms,
          source: data.source || "openai",
        };
      }
    } catch {
      // Backend not running -> fallback below
    }
  }

  // Realistic fallback with smart recognition based on filename
  await new Promise((r) => setTimeout(r, 700));
  const fname = (file?.name || "").toLowerCase();

  if (fname.includes("tomate") || fname.includes("mildew") || fname.includes("mildiou")) {
    return {
      id: `diag-${Date.now()}`,
      disease: "Mildiou de la tomate (Phytophthora infestans)",
      severity: "eleve",
      confidence: 94,
      photoName: file?.name ?? "feuille_tomate.jpg",
      symptoms: "Nécroses foliaires brunâtres irrégulières avec feutrage grisâtre sur la face inférieure.",
      recommendations: [
        "Éliminer et incinérer sans délai tous les tissus foliaires atteints",
        "Appliquer un bio-fongicide préventif à base de bouillie bordelaise ou purin de prêle",
        "Améliorer l'espacement et effeuiller le bas des tiges pour aérer le feuillage",
        "Interdire tout arrosage par aspersion et privilégier le goutte-à-goutte au pied",
      ],
      createdAt: new Date().toISOString().split("T")[0],
      source: "fallback_simulation",
    };
  }

  if (fname.includes("sol") || fname.includes("carence") || fname.includes("jaun")) {
    return {
      id: `diag-${Date.now()}`,
      disease: "Chlorose ferrique et déficit azoté",
      severity: "moyen",
      confidence: 88,
      photoName: file?.name ?? "echantillon_sol.jpg",
      symptoms: "Décoloration internervaire marquée sur les jeunes pousses due à un blocage racinaire.",
      recommendations: [
        "Effectuer un apport d'amendement organique composté mûr (2 t/ha)",
        "Corriger le pH du sol par chaulage fractionné si inférieur à 5.8",
        "Pulvériser un chélate de fer en application foliaire d'urgence",
        "Pailler la planche de culture pour stimuler l'activité microbiologique",
      ],
      createdAt: new Date().toISOString().split("T")[0],
      source: "fallback_simulation",
    };
  }

  // Default agronomic fallback: Rouille commune du Maïs
  return {
    id: `diag-${Date.now()}`,
    disease: "Rouille commune du Maïs (Puccinia sorghi)",
    severity: "moyen",
    confidence: 92,
    photoName: file?.name ?? mockDiagnosticResults[0].photoName,
    symptoms: "Pustules éruptives allongées brun-orangé réparties sur les deux faces des limbes foliaires.",
    recommendations: [
      "Appliquer un fongicide protecteur homologué dès l'apparition des premières pustules",
      "Sélectionner des variétés hybrides certifiées tolérantes pour le prochain cycle cultural",
      "Éviter les excès de fertilisation azotée tardive qui favorisent la prolifération mycélienne",
      "Détruire et enfouir profondément les résidus post-récolte pour rompre le cycle biologique",
    ],
    createdAt: new Date().toISOString().split("T")[0],
    source: "fallback_simulation",
  };
}

export async function analyzeSoilWithAI(payload: {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  humidity: number;
  culture?: string;
}): Promise<SoilAnalysisAIResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai/soil-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return (await res.json()) as SoilAnalysisAIResponse;
    }
  } catch {
    // Backend offline -> compute agronomic fallback
  }

  await new Promise((r) => setTimeout(r, 600));

  // Compute smart agronomic score
  const phBalance = 1 - Math.min(Math.abs(payload.ph - 6.5) / 3.0, 1);
  const nScore = Math.min(payload.nitrogen / 40.0, 1);
  const pScore = Math.min(payload.phosphorus / 30.0, 1);
  const kScore = Math.min(payload.potassium / 35.0, 1);
  const score = Math.round((phBalance * 0.4 + nScore * 0.25 + pScore * 0.15 + kScore * 0.2) * 100);

  const recos: string[] = [];
  if (payload.ph < 6.0) {
    recos.push("Apport de 300 à 500 kg/ha de dolomie ou chaux agricole pour corriger l'acidité");
  } else if (payload.ph > 7.5) {
    recos.push("Apport de soufre élémentaire ou compost d'écorces pour abaisser légèrement le pH");
  }
  if (payload.nitrogen < 25) {
    recos.push("Déficit en azote : apporter 50 kg/ha d'urée ou de lisier décomposé avant le semis");
  }
  if (payload.phosphorus < 15) {
    recos.push("Carence phosphorée : épandage de phosphate naturel (DAP/TSP) pour stimuler le racinement");
  }
  if (payload.potassium < 20) {
    recos.push("Potassium faible : apport de sulfate de potassium ou cendres de bois tamisées");
  }
  if (payload.humidity < 30) {
    recos.push("Stress hydrique détecté : programmer une irrigation de 25 mm et poser un paillage végétal");
  }
  if (recos.length === 0) {
    recos.push("Équilibre physico-chimique optimal : poursuivre la rotation culturale actuelle");
  }

  return {
    ph: payload.ph,
    nitrogen: payload.nitrogen,
    phosphorus: payload.phosphorus,
    potassium: payload.potassium,
    humidity: payload.humidity,
    fertilityScore: Math.max(20, Math.min(score, 98)),
    soilQuality: score >= 75 ? "Excellente fertilité" : score >= 50 ? "Fertilité moyenne à optimiser" : "Sol dégradé à amender",
    recommendations: recos,
    source: "fallback_simulation",
  };
}

export async function getAiYieldPrediction(payload: {
  culture: string;
  areaHa: number;
  location?: string;
}): Promise<PredictionAIResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai/prediction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return (await res.json()) as PredictionAIResponse;
    }
  } catch {
    // Fallback calculation
  }

  await new Promise((r) => setTimeout(r, 600));

  const baseYieldMap: Record<string, number> = {
    Maïs: 4.8,
    Tomate: 18.5,
    Manioc: 14.2,
    Riz: 5.4,
  };
  const baseYield = baseYieldMap[payload.culture] ?? 4.5;
  const yieldPredicted = Number((baseYield * (0.95 + Math.random() * 0.1)).toFixed(1));

  const series = [
    Number((baseYield * 0.3).toFixed(1)),
    Number((baseYield * 0.55).toFixed(1)),
    Number((baseYield * 0.78).toFixed(1)),
    Number((baseYield * 0.92).toFixed(1)),
    yieldPredicted,
    Number((yieldPredicted * 1.02).toFixed(1)),
  ];

  return {
    cultureName: payload.culture,
    yieldPredicted,
    confidence: 89,
    harvestDate: "15 Octobre 2026",
    yieldPredictedSeries: series,
    yieldObserved: [series[0], series[1], series[2], null, null, null],
    dailyTip: `Pour optimiser le rendement du ${payload.culture}, veillez à maintenir l'humidité du sol pendant la floraison.`,
    source: "fallback_simulation",
  };
}

export async function getDailyTip(culture: string = "Maïs"): Promise<{ tip: string; culture: string; source: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ai/daily-tip?culture=${encodeURIComponent(culture)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline
  }

  return {
    tip: `Optimisation ${culture} : Favorisez un binage superficiel après la pluie pour briser la croûte de battance et limiter l'évaporation racinaire.`,
    culture,
    source: "fallback_simulation",
  };
}

export async function markNotificationRead(
  id: string,
  list: AppNotification[],
): Promise<AppNotification[]> {
  return list.map((n) => (n.id === id ? { ...n, read: true } : n));
}
