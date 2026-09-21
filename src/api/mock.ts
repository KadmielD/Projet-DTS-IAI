import type {
  Activity,
  AppNotification,
  Culture,
  DiagnosticResult,
  Exploitation,
  PlatformSettings,
  Prediction,
  SoilAnalysis,
  User,
  WeatherDay,
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
    description: "Exploitation mixte mais, haricot et manioc.",
    latitude: 6.0,
    longitude: 10.42,
  },
  {
    id: "e2",
    name: "Parcelle Bambui",
    location: "Bambui, Nord-Ouest",
    areaHa: 4.2,
    description: "Cultures maraicheres et tomate.",
    latitude: 6.05,
    longitude: 10.25,
  },
];

export const mockCultures: Culture[] = [
  {
    id: "c1",
    name: "Mais",
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
    stage: "Planifie",
    startDate: "2024-07-01",
    endDate: "2025-03-01",
    status: "planifiee",
  },
];

export const mockActivities: Activity[] = [
  {
    id: "a1",
    type: "semis",
    title: "Semis de mais — Ferme de Ndop",
    date: "2024-05-02",
    exploitationId: "e1",
  },
  {
    id: "a2",
    type: "irrigation",
    title: "Irrigation — Parcelle Bambui",
    date: "2024-05-10",
    exploitationId: "e2",
  },
  {
    id: "a3",
    type: "diagnostic",
    title: "Diagnostic IA — taches foliaires (tomate)",
    date: "2024-05-12",
    exploitationId: "e2",
  },
  {
    id: "a4",
    type: "analyse_sol",
    title: "Analyse sol — Ferme de Ndop",
    date: "2024-05-14",
    exploitationId: "e1",
  },
  {
    id: "a5",
    type: "traitement",
    title: "Traitement phytosanitaire — haricot",
    date: "2024-05-18",
    exploitationId: "e1",
  },
  {
    id: "a6",
    type: "prediction",
    title: "Prediction rendement mais mise a jour",
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
      "Apport modere d'azote avant floraison du mais",
      "Maintenir le paillage pour stabiliser l'humidite",
      "pH legerement acide : amendement calcaire leger recommande",
    ],
  },
];

export const mockPredictions: Prediction[] = [
  {
    id: "p1",
    cultureId: "c1",
    cultureName: "Mais",
    yieldPredicted: 2.4,
    harvestDate: "2024-09-12",
    confidence: 87,
    months: ["Mai", "Juin", "Juil", "Aout", "Sept"],
    yieldObserved: [0.4, 0.9, 1.5, 2.0],
    yieldPredictedSeries: [0.5, 1.0, 1.6, 2.1, 2.4],
  },
];

export const mockPlanning = [
  { culture: "Mais", color: "#2E7D32", start: 0, span: 5 },
  { culture: "Haricot", color: "#4CAF50", start: 1, span: 3 },
  { culture: "Tomate", color: "#FF9800", start: 0.5, span: 4.5 },
  { culture: "Manioc", color: "#1976D2", start: 2, span: 4 },
];

export const planningMonths = ["Mai", "Juin", "Juil", "Aout", "Sept", "Oct"];

export const mockNotifications: AppNotification[] = [
  {
    id: "n1",
    type: "alerte",
    title: "Irrigation a preparer",
    message: "Irrigation prevue le 12 Mai — Parcelle Bambui.",
    date: "2024-05-11",
    read: false,
    href: "/app/planification",
  },
  {
    id: "n2",
    type: "info",
    title: "Diagnostic disponible",
    message: "Resultats du diagnostic tomate (Tasker yellow) a consulter.",
    date: "2024-05-12",
    read: false,
    href: "/app/diagnostic",
  },
  {
    id: "n3",
    type: "meteo",
    title: "Pluie attendue",
    message: "15 mm prevus dans 48h autour de Ndop — ajustez l'irrigation.",
    date: "2024-05-13",
    read: true,
    href: "/app/planification",
  },
  {
    id: "n4",
    type: "succes",
    title: "Analyse de sol enregistree",
    message: "Les recommandations pour Ferme de Ndop sont precises.",
    date: "2024-05-14",
    read: true,
    href: "/app/analyse-sol",
  },
];

export const mockWeather: WeatherDay[] = [
  {
    date: "2024-05-20",
    label: "Lun",
    tempMax: 28,
    tempMin: 18,
    precipMm: 0,
    condition: "soleil",
  },
  {
    date: "2024-05-21",
    label: "Mar",
    tempMax: 27,
    tempMin: 19,
    precipMm: 2,
    condition: "nuage",
  },
  {
    date: "2024-05-22",
    label: "Mer",
    tempMax: 25,
    tempMin: 18,
    precipMm: 12,
    condition: "pluie",
  },
  {
    date: "2024-05-23",
    label: "Jeu",
    tempMax: 26,
    tempMin: 17,
    precipMm: 5,
    condition: "nuage",
  },
  {
    date: "2024-05-24",
    label: "Ven",
    tempMax: 29,
    tempMin: 18,
    precipMm: 0,
    condition: "soleil",
  },
];

export const mockDiagnosticResults: DiagnosticResult[] = [
  {
    id: "d1",
    disease: "Tasker yellow",
    severity: "eleve",
    confidence: 92,
    recommendations: [
      "Isoler les plants atteints",
      "Appliquer un traitement adapte sous 48h",
      "Surveiller les parcelles voisines",
      "Eviter l'irrigation par aspersion sur les feuilles",
    ],
    photoName: "feuille-tomate.jpg",
    createdAt: "2024-05-12",
  },
];

export const mockPlatformStats = {
  activeUsers: 128,
  newSignups: 14,
  diagnosticsRun: 86,
  predictionsRun: 52,
  soilAnalyses: 31,
  moduleUsage: [
    { name: "Diagnostic", value: 86 },
    { name: "Prediction", value: 52 },
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
    { month: "Fev", value: 55 },
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
    "AgriIntelli — Plateforme intelligente pour une agriculture durable. Les predictions sont indicatives.",
};

export const farmerCredentials = {
  email: "jean.mbarga@ferme.cm",
  password: "farmer123",
};

export const adminCredentials = {
  email: "admin@agriintelli.cm",
  password: "admin123",
};
