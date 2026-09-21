export type Role = "agriculteur" | "admin" | "technicien";

export type UserStatus = "actif" | "inactif";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface Exploitation {
  id: string;
  name: string;
  location: string;
  areaHa: number;
  image?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

export type CultureStatus = "en_cours" | "planifiee" | "recoltee";

export interface Culture {
  id: string;
  name: string;
  exploitationId: string;
  stage: string;
  startDate: string;
  endDate: string;
  status: CultureStatus;
}

export interface Activity {
  id: string;
  type:
    | "semis"
    | "irrigation"
    | "diagnostic"
    | "analyse_sol"
    | "traitement"
    | "prediction";
  title: string;
  date: string;
  exploitationId?: string;
}

export interface SoilAnalysis {
  id: string;
  exploitationId: string;
  date: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  humidity: number;
  recommendations: string[];
  photoName?: string;
}

export interface Prediction {
  id: string;
  cultureId: string;
  cultureName: string;
  yieldPredicted: number;
  yieldObserved: number[];
  yieldPredictedSeries: number[];
  months: string[];
  harvestDate: string;
  confidence: number;
}

export interface PlatformSettings {
  alertThresholdYield: number;
  maintenanceMode: boolean;
  modulesEnabled: {
    diagnostic: boolean;
    prediction: boolean;
    soilAnalysis: boolean;
    planning: boolean;
  };
  legalNotice: string;
}

export type NotificationType = "alerte" | "info" | "succes" | "meteo";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  href?: string;
}

export interface DiagnosticResult {
  id: string;
  disease: string;
  severity: "faible" | "moyen" | "eleve";
  confidence: number;
  recommendations: string[];
  photoName?: string;
  createdAt: string;
}

export interface WeatherDay {
  date: string;
  label: string;
  tempMax: number;
  tempMin: number;
  precipMm: number;
  condition: "soleil" | "nuage" | "pluie";
}
