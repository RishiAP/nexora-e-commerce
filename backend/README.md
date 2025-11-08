# nexora-backend

Minimal Express + TypeScript backend scaffold using Mongoose, dotenv and CORS.

Quick start

1. Copy `.env.example` to `.env` and update `MONGO_URI`.
2. Install dependencies:

```fish
cd backend
yarn install
```

3. Run in dev mode (watch):

```fish
yarn dev
```

4. Build for production:

```fish
yarn build
yarn start
```

Health endpoint: GET /api/health
