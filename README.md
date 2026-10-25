# Raihan Farm Shop — MERN ERP & POS

The project keeps its Express/Mongoose API and MongoDB data layer, and now has a
separate React/Vite frontend:

```text
raihan-farm-erp/
├── frontend/              React + Vite web app and UI
├── backend/               Node.js + Express + Mongoose REST API
├── database/              MongoDB initialization
├── docker-compose.yml     Separate MongoDB, API, and frontend services
└── package.json           Root convenience scripts
```

## Local development

Requirements: Node 18+ and MongoDB running on `localhost:27017` (or an Atlas URI).

1. Configure the API:

   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

   Set a unique `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` in `backend/.env`.
   Start the API with `npm start` (default: `http://localhost:5000`).

2. In a separate terminal, run the React frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:5173`. Vite proxies `/api` to the local backend. For a
   remote API, set `VITE_API_BASE` to its URL before building or starting Vite.

Root convenience scripts are also available: `npm run dev:backend`,
`npm run dev:frontend`, and `npm run build:frontend`.

On first backend start, only the admin account from `ADMIN_USERNAME` and
`ADMIN_PASSWORD` is created. Passwords are stored as bcrypt hashes. Existing MongoDB
records are not automatically deleted.

## Docker

```bash
docker compose up --build
```

The frontend is available at `http://localhost:8080`, the API at
`http://localhost:5000`, and MongoDB at `localhost:27017`. The frontend web server
proxies `/api` requests to the separate backend service.

## Frontend migration

The existing ERP UI and its API workflows are preserved in `frontend/legacy.html`
and `frontend/public/js/`. A React entry point mounts that UI while it is migrated
incrementally into React components; new frontend work should be implemented in React.
The backend and MongoDB API remain independently runnable and deployable.

## Data and API

* The frontend loads application data from `GET /api/state` after login and saves
  changes (debounced) with `PUT /api/state`. Business data is stored in MongoDB.
* The backend uses collections for inventory, sales, slaughter batches, employees,
  attendance, deliveries, subscriptions, receivables, history, and users.
* The page polls the server every 20 seconds while the user is idle.

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | public | `{username,password}` → JWT |
| GET | `/api/auth/me` | token | current user |
| GET | `/api/state` | token | application state with role-based filtering |
| PUT | `/api/state` | token | sync state changes |
| PUT | `/api/state?replace=true` | admin | restore a backup |
| GET | `/api/attendance/roster` | public | names and attendance status for QR |
| POST | `/api/attendance/qr-clock` | public + PIN | staff QR sign-in/out |
| POST | `/api/attendance/clock` | admin | kiosk sign-in/out |
| GET | `/api/health` | public | API health check |
