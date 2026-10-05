# 🌾 AgriIntelli — Plateforme d'Intelligence Agronomique & Télédétection

[![Frontend](https://img.shields.io/badge/Frontend-Vite%20%7C%20React%2018%20%7C%20TailwindCSS-059669?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20SQLAlchemy%20%7C%20PostgreSQL-0284c7?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%202.0%20%7C%20OpenAI%20GPT--4o-7c3aed?style=flat-square&logo=google)](https://ai.google.dev/)
[![Design](https://img.shields.io/badge/Design-Épuré%20%7C%20Normes%20FAO%20%7C%20GlobalGAP-16a34a?style=flat-square)](#)

> **AgriIntelli** est une solution SaaS agritech de pointe conçue pour moderniser le pilotage des exploitations agricoles en Afrique subsaharienne et à l'international. Elle combine vision par ordinateur, intelligence artificielle multimodale générative et modélisation agro-climatique pour optimiser la santé des cultures et maximiser les rendements.

---

## 🚀 Fonctionnalités Majeures

### 1. 🌿 Diagnostic Phytosanitaire par Vision Multimodale
- **Inspection foliaire instantanée** à partir de photos prises sur le terrain (smartphone ou appareil connecté).
- **Moteur IA Hybride :** Inférence multimodale via **Google Gemini 2.0 Flash** et **OpenAI GPT-4o Vision**.
- **Rapport d'expertise automatique :** Détection de l'agent pathogène (ex: *Rouille commune du maïs*, *Mildiou de la tomate*, chloroses), gravité catégorisée, indice de confiance en % et protocole de traitement raisonné / biologique étape par étape.
- **Moteur de secours local :** En cas d'indisponibilité réseau ou de dépassement de quota API, basculement transparent vers un moteur de règles agronomiques expert évitant tout crash.

### 2. 🧪 Analyse Physico-Chimique des Sols & Fertilisation
- Évaluation des ratios **N-P-K** (Azote, Phosphore, Potassium), du **pH** et de l'humidité résiduelle.
- Calcul de l'**Indice Global de Fertilité (0 à 100)** avec jauge visuelle dynamique.
- Recommandations sur-mesure de fertilisation : doses d'engrais (DAP, urée, sulfate de potassium), chaulage dolomitique pour corriger l'acidité et amendements organiques.

### 3. 📈 Modélisation Prédictive des Récoltes
- Projections de rendement en tonnes par hectare adaptées à chaque spéculation (*Maïs grain, Tomate plein champ, Manioc amélioré, Riz pluvial*).
- Estimation de la date optimale de récolte et calendrier prévisionnel.
- Histogramme dynamique d'accumulation de biomasse comparant les prédictions algorithmiques aux observations terrain sur 6 mois.

### 4. 📊 Tableau de Bord Agriculteur & Traçabilité
- Synthèse en temps réel des exploitations, des parcelles et des calendriers d'activités (semis, irrigation, traitements).
- **Conseil agronomique du jour propulsé par l'IA**, synchronisé avec la météo locale.
- Gestion des alertes sanitaires et notifications d'irrigation.

### 5. ✨ Vitrine Publique & Design Épuré
- **Design System AgTech d'exception :** Palette émeraude, sable chaud et terre arable avec typographie ultra-lisible.
- **Section terrain immersive :** Galerie photographique macro et survol spectral NDVI (*AgriIntelli sur le terrain*).
- **Footer International d'envergure :** Bulletin agronomique interactif, certifications FAO/GlobalGAP, liens de gouvernance et indicateur live de télémétrie des serveurs.

---

## 🛠️ Stack Technique

### Frontend
- **Framework :** React 18, TypeScript, Vite
- **Styling :** Tailwind CSS, Design System sur-mesure (composants épurés, animations fluides)
- **Routage & État :** React Router DOM v6
- **Composants :** Cartes KPI, Stepper interactif, Scanner photo avec prévisualisation et presets réels

### Backend
- **Framework :** FastAPI (Python 3)
- **ORM & Données :** SQLAlchemy, PostgreSQL, Pydantic v2
- **IA & Multimodal :** 
  - Module natif sans dépendance externe lourde (`urllib.request`, `base64`, `json`)
  - **Google Gemini API** (`gemini-2.0-flash` / `gemini-1.5-flash`)
  - **OpenAI API** (`gpt-4o`, `gpt-4o-mini`)
  - Chargeur automatique des variables d'environnement `.env`

---

## 📦 Installation & Démarrage

### Prérequis
- Node.js 18+ & npm
- Python 3.10+
- PostgreSQL (optionnel pour le mode mock complet)

### 1. Configuration des Clés d'API IA
Créez ou éditez le fichier `back-end/.env` :
```bash
# back-end/.env

# Clé OpenAI (GPT-4o Vision & mini)
OPENAI_API_KEY="sk-proj-..."

# Clé Google Gemini (Gemini 2.0 Flash) - Optionnelle ou prioritaire
GEMINI_API_KEY="AIzaSy..."
```

### 2. Démarrer le Backend FastAPI
```powershell
# Accéder au dossier backend
cd back-end

# Installer les dépendances (dans votre environnement virtuel)
pip install -r requirements.txt

# Lancer le serveur d'API
uvicorn main:app --reload --port 8000
```
L'API est accessible sur `http://127.0.0.1:8000` (Documentation Swagger interactive sur `http://127.0.0.1:8000/docs`).

### 3. Démarrer le Frontend Vite
```powershell
# Depuis la racine du projet
npm install

# Démarrer le serveur de développement
npm run dev
```
L'application web s'ouvre sur `http://localhost:5173`.

### 4. Compiler pour la Production
```powershell
npm run build
```
*Le build de production Vite génère des assets ultra-légers optimisés en ~3 secondes.*

---

## 🔒 Sécurité & Résilience
- **Zéro fuite de clés :** Les clés privées Gemini et OpenAI restent strictement confinées sur le serveur backend FastAPI.
- **Tolérance aux pannes :** En cas d'erreur de quota (ex: HTTP 429) ou d'absence de réseau, le système commute automatiquement sur l'expertise locale sans interruption de service.

---

## 📄 Licence & Crédits
Projet développé sous l'égide du **Projet DTS-IAI** — Plateforme AgriIntelli 2026.  
Conforme aux standards de données agricoles ouvertes et aux recommandations agro-écologiques.
