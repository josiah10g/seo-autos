# SEO Autos - React + Express (Railway Ready)

This repository is structured into a clean **frontend** (Vite + React + React Router) and **backend** (Node.js + Express) setup.

---

## 📁 Project Structure

```text
SEO AUTOS/
├── frontend/               # React SPA (Vite + React Router + Tailwind CSS)
│   ├── public/             # Static public assets (images, favicon, etc.)
│   ├── src/
│   │   ├── assets/         # App asset files
│   │   ├── components/     # UI components (Radix UI, Tailwind, Lucide)
│   │   ├── hooks/          # React hooks (e.g., auto-logout)
│   │   ├── lib/            # Supabase database & utility helpers
│   │   ├── pages/          # App route pages (Home, About, Services, Admin, etc.)
│   │   ├── App.tsx         # Main router layout & routes
│   │   └── main.tsx        # React client entrypoint
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                # Express API & Static Server
│   ├── src/
│   │   └── index.ts        # Express entrypoint (serves API & frontend SPA)
│   ├── package.json
│   └── tsconfig.json
│
├── package.json            # Root workspace orchestrator
└── README.md
```

---

## 🚀 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run both frontend and backend concurrently:**
   ```bash
   npm run dev:all
   ```
   * Frontend runs on: `http://localhost:5173`
   * Backend runs on: `http://localhost:5000`

---

## 🚂 Deploying to Railway

### Single Service (All-in-One Deployment - Recommended)

1. Connect your repository to **Railway**.
2. Railway detects Node.js and runs the root `package.json` scripts:
   * **Build Command**: `npm run build` (builds both `frontend/dist` and `backend/dist`)
   * **Start Command**: `npm run start` (starts the Express server)
3. Set the required environment variables in your Railway service settings:
   * `NODE_ENV=production`
   * (Optional) Any Supabase API keys if you add server-side keys.
4. Express automatically serves:
   * All `/api/*` endpoints.
   * The static compiled React build and client-side SPA routing fallback.
