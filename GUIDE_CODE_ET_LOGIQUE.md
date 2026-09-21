# AgriIntelli — Guide pas à pas du code et de la logique

Ce document explique **comment l’application est construite**, **où se trouve chaque morceau de code**, et **comment les flux métier fonctionnent**.  
Lis-le dans l’ordre : architecture → démarrage → frontend → backend → auth → données → prochaines étapes.

---

## 1. Qu’est-ce qu’AgriIntelli ?

Plateforme web pour une agriculture assistée par l’IA :

| Rôle | Objectif |
|------|----------|
| **Visiteur** | Voir la landing, créer un compte |
| **Agriculteur** | Gérer exploitations / cultures, diagnostic, sol, planification, prédictions, notifications, historique |
| **Administrateur** | Gérer utilisateurs, stats, paramètres plateforme |

Stack actuelle :

```text
Navigateur (React + Vite + Tailwind)
        │
        │  aujourd’hui : données mock côté front (USE_MOCK = true)
        │  demain     : appels HTTP JWT vers FastAPI
        ▼
API FastAPI + SQLAlchemy  ←→  PostgreSQL (Docker)
```

---

## 2. Arborescence du projet

```text
agriintelli/
├── src/                      # FRONTEND React (Vite)
│   ├── api/                  # Accès données (mock + client HTTP prêt)
│   ├── assets/               # Logo
│   ├── components/           # UI réutilisable (sidebar, modal, upload…)
│   ├── hooks/                # useAuth (session)
│   ├── layouts/              # Shell agriculteur / admin
│   ├── pages/                # Écrans (landing, login, farmer/*, admin/*)
│   ├── types/                # Types TypeScript partagés
│   ├── App.tsx               # Routes React Router
│   ├── main.tsx              # Point d’entrée React
│   └── index.css             # Tokens Tailwind / charte AgriIntelli
│
├── back-end/                 # BACKEND FastAPI
│   ├── models/               # Tables SQLAlchemy
│   ├── schemas/              # Validation Pydantic (requêtes/réponses)
│   ├── routers/              # Endpoints HTTP
│   ├── alembic/              # Migrations DB
│   ├── database.py           # Connexion PostgreSQL
│   ├── auth_utils.py         # JWT + hash mots de passe
│   ├── main.py               # App FastAPI
│   ├── seed.py               # Données de démo
│   ├── config.json           # URL DB, secret JWT, CORS
│   └── docker-compose.yml    # Conteneur PostgreSQL
│
├── package.json              # Scripts front (npm run dev)
└── GUIDE_CODE_ET_LOGIQUE.md  # Ce fichier
```

---

## 3. Comment lancer l’appli (rappel)

### Base de données
```powershell
cd back-end
docker compose up -d
```

### Backend
```powershell
cd back-end
.\virtualEnv\Scripts\Activate.ps1
# première fois : pip install -r requirements.txt
# première fois : python seed.py
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
→ Docs : http://127.0.0.1:8000/docs

### Frontend
```powershell
cd agriintelli
npm install   # première fois
npm run dev
```
→ App : http://127.0.0.1:5173/

### Comptes seed
| Rôle | Email | Mot de passe |
|------|--------|--------------|
| Agriculteur | `jean.mbarga@ferme.cm` | `farmer123` |
| Admin | `admin@agriintelli.cm` | `admin123` |

---

## 4. Frontend — logique globale

### 4.1 Démarrage React

1. `index.html` charge `/src/main.tsx`
2. `main.tsx` monte l’app dans `#root` et enveloppe tout dans `AuthProvider`
3. `App.tsx` définit les **routes** avec React Router

```text
main.tsx
  └─ AuthProvider          ← session utilisateur (localStorage)
       └─ App (BrowserRouter)
            ├─ /                 Landing
            ├─ /login /register
            ├─ /app/*            FarmerLayout + pages agriculteur
            └─ /admin/*          AdminLayout + pages admin
```

### 4.2 Routes (`src/App.tsx`)

| URL | Page | Qui |
|-----|------|-----|
| `/` | LandingPage | Tout le monde |
| `/login` | LoginPage | Visiteur |
| `/register` | RegisterPage | Visiteur |
| `/app` | Dashboard agriculteur | Agriculteur / technicien |
| `/app/exploitations` | CRUD exploitations | Idem |
| `/app/cultures` | CRUD cultures | Idem |
| `/app/planification` | Gantt + météo mock | Idem |
| `/app/diagnostic` | Photo + résultat IA mock | Idem |
| `/app/predictions` | Rendement prédit | Idem |
| `/app/analyse-sol` | Photo + NPK | Idem |
| `/app/notifications` | Centre d’alertes | Idem |
| `/app/historique` | Journal d’activités | Idem |
| `/app/profil` | Compte | Idem |
| `/admin` | Dashboard admin | Admin |
| `/admin/utilisateurs` | Gestion users | Admin |
| `/admin/statistiques` | Stats | Admin |
| `/admin/parametres` | Settings | Admin |

### 4.3 Auth côté front (`src/hooks/useAuth.tsx`)

**Idée :** garder un utilisateur connecté dans le navigateur.

1. Au login / register, on enregistre un objet `User` dans `localStorage` (`agriintelli_session`)
2. `useAuth()` expose `user`, `login`, `logout`, `register`
3. Aujourd’hui le login front compare encore aux **credentials mock** (`mock.ts`), pas encore au JWT FastAPI

**Redirection après login :**
- rôle `admin` → `/admin`
- sinon → `/app`

### 4.4 Protection des pages (`RoleGuard` + layouts)

- `FarmerLayout` : sidebar agriculteur + `RoleGuard allow={["agriculteur","technicien"]}`
- `AdminLayout` : sidebar admin + `RoleGuard allow={["admin"]}`
- Si mauvais rôle ou non connecté → redirection login / home

### 4.5 Deux sidebars distinctes (`components/sidebar/Sidebar.tsx`)

`farmerNav` et `adminNav` sont **deux listes séparées** (pas un seul menu filtré) — comme décidé dans le plan produit.

### 4.6 Couche données front (`src/api/`)

| Fichier | Rôle |
|---------|------|
| `client.ts` | `API_BASE_URL`, `USE_MOCK`, helper `apiFetch` (HTTP + Bearer) |
| `mock.ts` | Jeu de données initial (users, farms, cultures…) |
| `services.ts` | Fonctions métier : `getExploitations`, `createCulture`, etc. |

**Point important :**  
`USE_MOCK = true` → les pages lisent/écrivent un **store mémoire** dans `services.ts` (CRUD exploitations/cultures fonctionne sans backend).  
Quand tu passeras à `USE_MOCK = false`, tu remplacera le corps des fonctions par `apiFetch("/exploitations", …, token)`.

### 4.7 Types (`src/types/index.ts`)

Contrats TypeScript partagés : `User`, `Exploitation`, `Culture`, `Activity`, `SoilAnalysis`, `Prediction`, `AppNotification`, `DiagnosticResult`, `WeatherDay`…

### 4.8 Composants UI réutilisables

| Composant | Utilité |
|-----------|---------|
| `ui.tsx` | Boutons, cards, KPI, inputs, PageHeader |
| `Modal.tsx` | Formulaires Ajouter / Modifier |
| `PhotoUpload.tsx` | Import photo (diagnostic + sol) |
| `Feedback.tsx` | EmptyState, Stepper, MapPlaceholder, WeatherStrip |
| `RoleGuard.tsx` | Garde d’accès par rôle |

### 4.9 Logique métier des pages agriculteur (résumé)

**Dashboard**  
Charge farms, cultures, activités, prédiction, notifications non lues → KPI + bandeau d’alerte + raccourcis.

**Exploitations**  
Liste à gauche, détail + placeholder carte à droite.  
`+ Ajouter` / icônes Modifier / Supprimer → modal → `createExploitation` / `updateExploitation` / `deleteExploitation`.

**Cultures**  
Table + cartes.  
Même pattern CRUD via modal → `createCulture` / `updateCulture` / `deleteCulture`.  
Supprimer une exploitation cascade aussi ses cultures (dans le store mock).

**Diagnostic**  
Étapes : photo → analyse (`runDiagnostic`) → résultats + recommandations extensibles.

**Analyse sol**  
Photo optionnelle + saisie NPK/pH + recommandations.

**Planification**  
Gantt mock + bandeau météo (prévu Open-Meteo) + lien vers prédictions.

**Prédictions**  
Carte résultat + graphique prédit vs observé.

**Notifications**  
Liste typée (alerte / info / météo / succès), marquer lu.

**Historique**  
Timeline des activités.

---

## 5. Backend — logique globale

### 5.1 Point d’entrée (`back-end/main.py`)

1. Importe les modèles (enregistrement SQLAlchemy)
2. `Base.metadata.create_all(bind=engine)` → crée les tables si absentes
3. Configure CORS (autorise Vite `5173`)
4. Monte les routers : auth, admin, exploitations, cultures, activities, soil, predictions, stats
5. Route santé : `GET /health`

### 5.2 Connexion DB (`database.py` + `config.json`)

```text
config.json → DATABASE_URL
       ↓
create_engine (SQLAlchemy)
       ↓
SessionLocal / get_db()  ← injecté dans chaque endpoint via Depends(get_db)
```

PostgreSQL Docker :

```yaml
# docker-compose.yml
user: agriintelli
password: agriintelli
db: agriintelli
port hôte: 5432
```

### 5.3 Modèles SQLAlchemy (`models/`)

| Modèle | Table | Idée |
|--------|-------|------|
| `User` | users | Compte + rôle + statut |
| `Exploitation` | exploitations | Ferme liée à un `owner_id` |
| `Culture` | cultures | Culture liée à une exploitation |
| `Activity` | activities | Historique (semis, irrigation…) |
| `SoilAnalysis` | soil_analyses | Analyse sol + JSON recommandations |
| `Prediction` | predictions | Rendement + séries JSON |
| `PlatformSetting` | platform_settings | Paramètres admin |

Relations typiques :
`User 1—N Exploitation 1—N Culture 1—N Prediction`

### 5.4 Schémas Pydantic (`schemas/`)

Séparent **ce qui entre/sort de l’API** des modèles ORM :

- `UserCreate`, `UserLogin`, `UserOut`, `Token`
- `ExploitationCreate` / `Out`
- `CultureCreate` / `Out`
- etc.

FastAPI valide automatiquement les bodies JSON.

### 5.5 Auth backend (`auth_utils.py` + `routers/auth.py`)

```text
Mot de passe clair
    → hash bcrypt (passlib)
    → stocké dans users.hashed_password

Login OK
    → JWT (python-jose) avec sub=email, role=…
    → Client envoie Authorization: Bearer <token>

get_current_user(token)
    → décode JWT → charge User en DB → vérifie statut actif

require_roles(UserRole.admin)
    → refuse 403 si mauvais rôle
```

Endpoints auth :

| Méthode | Chemin | Action |
|---------|--------|--------|
| POST | `/auth/register` | Créer agriculteur + token |
| POST | `/auth/login` | Login JSON |
| POST | `/auth/token` | Login form (Swagger) |
| GET | `/auth/me` | Profil courant |

### 5.6 Routers métier

| Router | Préfixe | Règle d’accès |
|--------|---------|----------------|
| `exploitations` | `/exploitations` | User voit ses fermes ; admin voit tout |
| `cultures` | `/cultures` | Filtré par exploitations du user |
| `activities` | `/activities` | Historique |
| `soil_analyses` | `/soil-analyses` | Analyses sol |
| `predictions` | `/predictions` | Prédictions |
| `admin` | `/admin/users` | Admin only CRUD users |
| `stats` | `/stats/...` | Dashboard farmer + stats/settings admin |

### 5.7 Seed (`seed.py`)

Remplit la DB si vide : admin, agriculteur, technicien, 2 fermes, cultures, activités, analyse sol, prédiction, settings.

```powershell
python seed.py
```

---

## 6. Flux utilisateur bout-en-bout (logique métier)

### Cas : agriculteur se connecte et ajoute une culture

**Aujourd’hui (front mock) :**

```text
1. LoginPage → useAuth.login(email, password)
2. Credentials match mock → User stocké localStorage
3. Redirect /app
4. FarmerLayout affiche FarmerSidebar
5. /app/cultures → getCultures() lit culturesStore
6. Clic "+ Ajouter" → Modal
7. createCulture(...) → culturesStore mis à jour → table rafraîchie
```

**Demain (front branché API) :**

```text
1. POST /auth/login → { access_token, user }
2. Stocker token + user
3. GET /cultures  Authorization: Bearer …
4. POST /cultures  body JSON CultureCreate
5. SQLAlchemy insert → PostgreSQL
6. GET /cultures rafraîchit la liste
```

### Cas : admin gère un utilisateur

```text
Admin login → /admin/utilisateurs
→ (API) GET /admin/users
→ PATCH /admin/users/{id}  (rôle / statut)
→ DELETE /admin/users/{id}
```

---

## 7. Charte visuelle (frontend)

Définie dans `src/index.css` :

| Token | Couleur | Usage |
|-------|---------|--------|
| `--primary` | `#2e7d32` | Boutons, actifs sidebar |
| `--primary-light` | `#4caf50` | Accents |
| `--accent` | `#1976d2` | Tech / liens |
| `--warning` | `#ff9800` | Alertes |
| `--background` | `#f2f2f2` | Fond app |
| `--surface` | `#ffffff` | Cartes |

---

## 8. État actuel vs diagramme de cas d’usage

| Déjà en place | Encore à brancher |
|---------------|-------------------|
| UI + routes 2 rôles | Front ↔ FastAPI JWT (`USE_MOCK = false`) |
| CRUD exploitations / cultures (mock) | CRUD via API réelle |
| Upload photo UI | Stockage fichiers + OpenAI Vision |
| Météo / carte placeholders | Open-Meteo + Google Maps |
| Prédiction mock | Modèle IA réel |
| Notifications UI | Table + push backend |

---

## 9. Comment lire le code efficacement (ordre conseillé)

1. `src/main.tsx` → `App.tsx` → `hooks/useAuth.tsx`
2. `layouts/FarmerLayout.tsx` + `sidebar/Sidebar.tsx`
3. Une page simple : `pages/farmer/CulturesPage.tsx`
4. `api/services.ts` + `api/client.ts`
5. `back-end/main.py` → `database.py` → `models/users.py`
6. `routers/auth.py` → `auth_utils.py`
7. `routers/exploitations.py` (exemple CRUD protégé)

---

## 10. Checklist « brancher le front sur l’API »

1. Garder l’API allumée (`:8000`) et le seed OK  
2. Dans `src/api/client.ts` : `USE_MOCK = false`  
3. Dans `useAuth` : appeler `POST /auth/login` et stocker le `access_token`  
4. Passer le token à `apiFetch` dans chaque service  
5. Remplacer les stores mémoire par les vrais endpoints  
6. Tester login agriculteur puis admin dans Swagger puis dans l’UI  

---

## 11. Glossaire rapide

| Terme | Sens |
|-------|------|
| **Vite** | Bundler / serveur de dev front |
| **React Router** | Navigation SPA sans recharger la page |
| **FastAPI** | Framework API Python async |
| **SQLAlchemy** | ORM (objets Python ↔ tables SQL) |
| **Pydantic** | Validation des JSON entrants/sortants |
| **JWT** | Jeton d’auth signé (Bearer) |
| **Mock** | Fausses données pour développer l’UI sans API |
| **Seed** | Script qui remplit la DB de démo |

---

*Document généré pour le projet AgriIntelli — à mettre à jour quand le front sera branché sur FastAPI et les APIs externes (OpenAI, Maps, Open-Meteo).*
