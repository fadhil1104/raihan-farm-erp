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
   Set `FARM_USERNAME=farm` and `FARM_PASSWORD` to the requested initial password
   there as well; do not commit the `.env` file.
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

On first backend start, the admin account from `ADMIN_USERNAME` and
`ADMIN_PASSWORD` is created. To provision a read-only accountant login, set
`ACCOUNTANT_USERNAME` (defaults to `accountant`) and `ACCOUNTANT_PASSWORD` in
`backend/.env` or the backend environment. The configured user is created on
startup if the username is unused; existing accountant passwords are not reset.
Passwords are stored as bcrypt hashes. Accountant users can view all sections and
records but cannot create, edit, or sell. Existing MongoDB
records are not automatically deleted, except that existing employee records and
their user/attendance references are migrated to staff and the legacy `employees`
collection is dropped on backend startup. Non-admin user accounts without a staff
record are also added to `staffs` with the default payroll settings.

The farm-only account username defaults to `farm`. Set `FARM_PASSWORD` in the
backend's private environment before first start to create it; the password is
stored as a bcrypt hash and is not reset on restart. The requested initial password
can be supplied through this environment variable; it is intentionally not stored
in tracked source files. Change it from the farm dashboard after first login. For
Docker, export `FARM_PASSWORD` before running Compose. The farm dashboard is
available at `/farm`; its batches, animal types, feed,
transport, mortality, weight checks, and live-animal deliveries are stored in
separate farm collections. Deliveries are recorded for Raihan Chicken Shop but do
not modify shop inventory, POS, or other shop records.

## Docker

```bash
docker compose up --build
```

The frontend is available at `http://localhost:8080`, the API at
`http://localhost:5000`, and MongoDB at `localhost:27017`. The frontend web server
proxies `/api` requests to the separate backend service.

## Deploy frontend and API on the same Vercel URL

The existing Vercel project can serve both the frontend and backend API, so users
continue using `https://raihan-farm-erp.vercel.app` and
`https://raihan-farm-erp.vercel.app/farm`. The API runs as a Vercel Function at
same-origin `/api/*` paths; no separate public API URL is needed.

1. In the existing Vercel project settings, change **Root Directory** to the
   repository root (`.`). This is still the same Vercel project and domain.
   The root `server.js` exposes the existing Express API as a Vercel Function.
   The build copies the Vite frontend into Vercel's static `public/` assets, and
   the root `vercel.json` routes `/farm` to the app entry page.
2. In that project's Production Environment Variables, configure:
   * `MONGODB_URI`: the production MongoDB connection string
   * `JWT_SECRET`: a unique, long random secret (do not use the example value)
   * `ADMIN_USERNAME` and `ADMIN_PASSWORD`: the existing admin account credentials, or initial credentials if the database has no admin
   * `FARM_USERNAME`: `farm`
   * `FARM_PASSWORD`: `farm1234`
   * `SEED_ON_START`: `true`, to create the farm account and initial animal types in this database if absent
   * `TIMEZONE`: `Asia/Colombo` if the default timezone is appropriate
   Keep the same MongoDB database used by the shop so the existing admin and farm
   accounts share the established authentication database. The farm and shop
   business records remain isolated by role and collections.
3. Ensure `VITE_API_BASE` is unset/empty in Vercel so the browser requests `/api`
   on this same domain. Deploy the updated project to Production.
4. Verify `https://raihan-farm-erp.vercel.app/api/health` returns `{"ok":true,...}`,
   then sign in at `https://raihan-farm-erp.vercel.app/farm`.

Do not commit `.env` files or use example development secrets in production.
For local development, leave `VITE_API_BASE` unset; Vite proxies `/api` to
`http://localhost:5000`.

## Frontend migration

The existing ERP UI and its API workflows are preserved in `frontend/legacy.html`
and `frontend/public/js/`. A React entry point mounts that UI while it is migrated
incrementally into React components; new frontend work should be implemented in React.
The backend and MongoDB API remain independently runnable and deployable.

## Data and API

* The frontend loads application data from `GET /api/state` after login and saves
  changes (debounced) with `PUT /api/state`. Business data is stored in MongoDB.
* The backend uses collections for inventory, sales, morning farm intakes, slaughter batches, staff,
  attendance, deliveries, subscriptions, receivables, history, and users.
* Farm-only operations use separate animal-type, batch, and per-batch event collections.
* The page polls the server every 20 seconds while the user is idle.

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | public | `{username,password}` → JWT |
| GET | `/api/auth/me` | token | current user |
| POST | `/api/auth/staff` | admin | Create a staff record and login, or set up a login for existing staff |
| PUT | `/api/auth/staff/:staffId` | admin | Edit staff identity, attendance PIN, and payroll settings |
| DELETE | `/api/auth/staff/:staffId` | admin | Archive staff and disable login without deleting payroll or attendance history |
| PATCH | `/api/auth/staff/:staffId/restore` | admin | Restore archived staff and reactivate their login |
| PUT | `/api/auth/me` | staff token + current password | Update own name, phone number, and optionally password |
| GET | `/api/state` | token | application state with role-based filtering |
| GET | `/api/farm` | farm token | isolated animal types and farm batches |
| POST | `/api/farm/animal-types` | farm token | add an animal type |
| POST | `/api/farm/batches` | farm token | create an own-raised or outside-purchased batch |
| POST | `/api/farm/batches/:batchId/events` | farm token | record feed, transport, mortality, live delivery, or weight check |
| PUT | `/api/farm/password` | farm token | update the farm account password |
| GET | `/api/state/pos-sales` | token | latest POS sales for background refresh |
| PATCH | `/api/state/pos-sales/:id/payment` | admin | update a completed POS sale's payment method |
| PUT | `/api/state` | token | sync state changes |
| PUT | `/api/state?replace=true` | admin | restore a backup |
| GET | `/api/attendance/roster` | public | names and attendance status for QR |
| POST | `/api/attendance/qr-clock` | public + PIN | staff QR sign-in/out |
| POST | `/api/attendance/clock` | admin | kiosk sign-in/out |
| GET | `/api/health` | public | API health check |
