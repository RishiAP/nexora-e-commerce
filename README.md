# Nexora E‑Commerce (Monorepo)

A minimal full‑stack e‑commerce scaffold built as an internship assignment. It uses:

- Backend: Express + TypeScript + Mongoose (MongoDB) with dotenv and CORS
- Frontend: Next.js App Router + TypeScript + Tailwind + shadcn/ui

This repo is organized as a two‑package monorepo (`backend` and `frontend`).

## Repository structure

```
./
├─ backend/            # Express + TS API (MongoDB)
│  ├─ src/
│  ├─ package.json
│  └─ .env.example
└─ frontend/           # Next.js  (App Router)
   ├─ src/app/
   ├─ package.json
   └─ tailwind config
```

## Prerequisites

- Node.js 18+ (LTS recommended)
- Yarn or npm (examples show both)
- MongoDB running locally or in the cloud (Atlas, etc.)

## Quick start

### 1) Configure environment

Copy `backend/.env.example` to `backend/.env` and adjust values:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/nexora
```

- `PORT`: Port the API will listen on
- `MONGO_URI`: MongoDB connection string for your database

### 2) Install dependencies

Backend:

```fish
cd backend
# using yarn
yarn install
# or using npm
npm install
```

Frontend:

```fish
cd frontend
# using yarn
yarn install
# or using npm
npm install
```

### 3) Run in development

Open two terminals (one for backend, one for frontend).

Backend (Terminal 1):

```fish
cd backend
# using yarn
yarn dev
# or using npm
npm run dev
```

Frontend (Terminal 2):

```fish
cd frontend
# using yarn
yarn dev
# or using npm
npm run dev
```

- API dev server (default): http://localhost:4000
- Web app dev server (default): http://localhost:3000

Health check (backend):

```text
GET /api/health -> 200 OK
```

### 4) Production build and start

Backend:

```fish
cd backend
# build
yarn build
# or
npm run build

# start compiled JS
yarn start
# or
npm start
```

Frontend:

```fish
cd frontend
# build
yarn build
# or
npm run build

# start
yarn start
# or
npm start
```

## Scripts reference

Backend (`backend/package.json`):

- `dev` — Start API in watch mode with ts-node-dev
- `build` — TypeScript compile to `dist`
- `start` — Run compiled server (`dist/index.js`)
- `lint` — ESLint for TypeScript sources

Frontend (`frontend/package.json`):

- `dev` — Start Next.js dev server
- `build` — Production build
- `start` — Start production server
- `lint` — Run ESLint

## What this project is about

This codebase demonstrates a clean, minimal e‑commerce foundation:

- Server exposes REST endpoints (products, cart, checkout) backed by MongoDB
- Client is a modern React/Next.js app with basic UI components (cards, buttons, modals)
- Separation of concerns via a simple monorepo layout to run and deploy independently

Use it as a starting point to implement full catalog, cart, checkout, authentication, and order history.

## Troubleshooting

- If the backend cannot connect to MongoDB, verify `MONGO_URI` and that MongoDB is running/accessible
- If ports conflict, change `PORT` in `backend/.env` or update the frontend API base URL accordingly
- Clear and reinstall dependencies if you hit type or build issues:

```fish
# backend
cd backend; rm -rf node_modules; yarn install
# frontend
cd ../frontend; rm -rf node_modules; yarn install
```

## License

This project is for educational and demonstration purposes. Add your preferred license if you plan to distribute.
