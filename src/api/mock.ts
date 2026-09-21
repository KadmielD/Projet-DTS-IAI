import type {
  Activity,
  Culture,
  Exploitation,
  PlatformSettings,
  Prediction,
  SoilAnalysis,
  User,
} from "@/types";

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Jean Mbarga",
    email: "jean.mbarga@ferme.cm",
    role: "agriculteur",
    status: "actif",
    createdAt: "2024-01-12",
  },
  {
    id: "u2",
    name: "Amina Ngo",
    email: "amina.ngo@agri.cm",
    role: "agriculteur",
    status: "actif",
    createdAt: "2024-02-03",
  },
  {
    id: "u3",
    name: "Paul Technicien",
    email: "paul.tech@agriintelli.cm",
    role: "technicien",
    status: "actif",
    createdAt: "2024-03-15",
  },
  {
    id: "u4",
    name: "Admin AgriIntelli",
    email: "admin@agriintelli.cm",
    role: "admin",
    status: "actif",
    createdAt: "2023-11-01",
  },
  {
    id: "u5",
    name: "Marie Fotso",
    email: "marie.fotso@ferme.cm",
    role: "agriculteur",
    status: "inactif",
    createdAt: "2024-04-20",
  },
];

export const mockExploitations: Exploitation[] = [
  {
    id: "e1",
    name: "Ferme de Ndop",
    location: "Ndop, Nord-Ouest, Cameroun",
    areaHa: 12.5,
    description: "Exploitation mixte maÃ¯s, haricot et manioc.",
  },
  {
    id: "e2",
    name: "Parcelle Bambui",
    location: "Bambui, Nord-Ouest",
    areaHa: 4.2,
    description: "Cultures maraÃ®chÃ¨res et tomate.",
  },
];

export const mockCultures: Culture[] = [
  {
    id: "c1",
    name: "MaÃ¯s",
    exploitationId: "e1",
    stage: "Floraison",
    startDate: "2024-05-01",
    endDate: "2024-09-15",
    status: "en_cours",
  },
  {
    id: "c2",
    name: "Haricot",
    exploitationId: "e1",
    stage: "Croissance",
    startDate: "2024-06-01",
    endDate: "2024-08-30",
    status: "en_cours",
  },
  {
    id: "c3",
    name: "Tomate",
    exploitationId: "e2",
    stage: "Plantation",
    startDate: "2024-05-15",
    endDate: "2024-10-01",
    status: "en_cours",
  },
  {
    id: "c4",
    name: "Manioc",
    exploitationId: "e1",
    stage: "PlanifiÃ©",
    startDate: "2024-07-01",
    endDate: "2025-03-01",
    status: "planifiee",
  },
];

export const mockActivities: Activity[] = [
  {
    id: "a1",
    type: "semis",
    title: "Semis de maÃ¯s â€” Ferme de Ndop",
    date: "2024-05-02",
    exploitationId: "e1",
  },
  {
    id: "a2",
    type: "irrigation",
    title: "Irrigation â€” Parcelle Bambui",
    date: "2024-05-10",
    exploitationId: "e2",
  },
  {
    id: "a3",
    type: "diagnostic",
    title: "Diagnostic IA â€” taches foliaires (tomate)",
    date: "2024-05-12",
    exploitationId: "e2",
  },
  {
    id: "a4",
    type: "analyse_sol",
    title: "Analyse sol â€” Ferme de Ndop",
    date: "2024-05-14",
    exploitationId: "e1",
  },
  {
    id: "a5",
    type: "traitement",
    title: "Traitement phytosanitaire â€” haricot",
    date: "2024-05-18",
    exploitationId: "e1",
  },
  {
    id: "a6",
    type: "prediction",
    title: "PrÃ©diction rendement maÃ¯s mise Ã  jour",
    date: "2024-05-20",
    exploitationId: "e1",
  },
];

export const mockSoilAnalyses: SoilAnalysis[] = [
  {
    id: "s1",
    exploitationId: "e1",
    date: "2024-05-14",
    ph: 6.2,
    nitrogen: 28,
    phosphorus: 18,
    potassium: 22,
    humidity: 34,
    recommendations: [
      "Apport modÃ©rÃ© d'azote avant floraison du maÃ¯s",
      "Maintenir le paillage pour stabiliser l'humiditÃ©",
      "pH lÃ©gÃ¨rement acide : amendement calcaire lÃ©ger recommandÃ©",
    ],
  },
];

export const mockPredictions: Prediction[] = [
  {
    id: "p1",
    cultureId: "c1",
    cultureName: "MaÃ¯s",
    yieldPredicted: 2.4,
    harvestDate: "2024-09-12",
    confidence: 87,
    months: ["Mai", "Juin", "Juil", "AoÃ»t", "Sept"],
    yieldObserved: [0.4, 0.9, 1.5, 2.0],
    yieldPredictedSeries: [0.5, 1.0, 1.6, 2.1, 2.4],
  },
];

export const mockPlanning = [
  { culture: "MaÃ¯s", color: "#2E7D32", start: 0, span: 5 },
  { culture: "Haricot", color: "#4CAF50", start: 1, span: 3 },
  { culture: "Tomate", color: "#FF9800", start: 0.5, span: 4.5 },
  { culture: "Manioc", color: "#1976D2", start: 2, span: 4 },
];

export const planningMonths = ["Mai", "Juin", "Juil", "AoÃ»t", "Sept", "Oct"];

export const mockPlatformStats = {
  activeUsers: 128,
  newSignups: 14,
  diagnosticsRun: 86,
  predictionsRun: 52,
  soilAnalyses: 31,
  moduleUsage: [
    { name: "Diagnostic", value: 86 },
    { name: "PrÃ©diction", value: 52 },
    { name: "Analyse sol", value: 31 },
    { name: "Planification", value: 44 },
  ],
  roleDistribution: [
    { role: "Agriculteur", count: 102 },
    { role: "Technicien", count: 18 },
    { role: "Administrateur", count: 8 },
  ],
  activityByMonth: [
    { month: "Jan", value: 40 },
    { month: "FÃ©v", value: 55 },
    { month: "Mar", value: 62 },
    { month: "Avr", value: 70 },
    { month: "Mai", value: 88 },
  ],
};

export const defaultSettings: PlatformSettings = {
  alertThresholdYield: 1.8,
  maintenanceMode: false,
  modulesEnabled: {
    diagnostic: true,
    prediction: true,
    soilAnalysis: true,
    planning: true,
  },
  legalNotice:
    "AgriIntelli â€” Plateforme intelligente pour une agriculture durable. Les prÃ©dictions sont indicatives.",
};

export const farmerCredentials = {
  email: "jean.mbarga@ferme.cm",
  password: "farmer123",
};

export const adminCredentials = {
  email: "admin@agriintelli.cm",
  password: "admin123",
};

