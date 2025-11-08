# Nexora E‑Commerce (Monorepo)

A minimal full‑stack e‑commerce scaffold built as an internship assignment. It uses:

- **Backend**: Express + TypeScript + Mongoose (MongoDB) with cookie-based theme management and API logging
- **Frontend**: Next.js App Router + TypeScript + Tailwind + shadcn/ui with instant theme switching and toast notifications

This repo is organized as a two‑package monorepo (`backend` and `frontend`).

## Features

### Backend
- RESTful API for products, cart, and checkout operations
- Cookie-based theme persistence (light/dark mode)
- API request logging with timestamps and response times
- CORS configured for frontend credentials
- MongoDB integration with Mongoose ODM

### Frontend
- Server-side rendering with Next.js App Router
- Instant theme toggle (light/dark) with cookie persistence
- Loading spinners on all async actions (Add to Cart, Update Cart, Checkout)
- Toast notifications for success/error feedback (using Sonner)
- Disabled checkout when cart is empty
- Responsive UI with shadcn/ui components and Lucide icons

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
FRONTEND_URL=http://localhost:3000
```

- `PORT`: Port the API will listen on
- `MONGO_URI`: MongoDB connection string for your database
- `FRONTEND_URL`: Frontend URL for CORS configuration (used to allow credentials)

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

### 5) Available API endpoints

**Products**
- `GET /api/products` — List all products

**Cart**
- `POST /api/cart` — Add item to cart
- `PUT /api/cart` — Update cart quantities
- `DELETE /api/cart/:productId` — Remove item from cart

**Checkout**
- `POST /api/checkout` — Process checkout

**Theme**
- `GET /api/theme` — Get current theme from cookie
- `POST /api/theme` — Set theme (light/dark) in cookie

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

This codebase demonstrates a clean, minimal e‑commerce foundation with modern UX features:

- **Server** exposes REST endpoints (products, cart, checkout, theme) backed by MongoDB
- **Client** is a modern React/Next.js app with shadcn/ui components and real-time feedback
- **Theme System**: Cookie-based persistence with instant client-side switching and server-side rendering
- **User Feedback**: Visual loading states (spinners) and toast notifications for all actions
- **API Observability**: Request logging with method, URL, status code, and response time
- **Separation of concerns** via a simple monorepo layout to run and deploy independently

Use it as a starting point to implement full catalog, cart, checkout, authentication, and order history.

## Key Technologies

### Backend
- **Express.js** — Web framework
- **TypeScript** — Type safety
- **Mongoose** — MongoDB ODM
- **cookie-parser** — Cookie handling for theme persistence
- **CORS** — Cross-origin resource sharing with credentials support

### Frontend
- **Next.js 16** — React framework with App Router
- **React 19** — UI library
- **Tailwind CSS 4** — Utility-first styling
- **shadcn/ui** — Accessible component library
- **Lucide React** — Icon library (spinners, theme icons)
- **Sonner** — Toast notifications

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
