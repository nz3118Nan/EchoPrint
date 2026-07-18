# EchoPrint

Full-stack project template modelled on pythia-comics.

## Layout

```text
apps/
  backend/orchestrator_server/  FastAPI service
  frontend/web/      React web application
  frontend/mobile/   Expo / React Native application
docker-compose.yml
```

PostgreSQL and Redis are local development dependencies managed by Docker
Compose. Application code belongs in `apps/`, with backend and frontend kept
at the first level beneath it. Shared infrastructure stays at the repository
root.

## Start local dependencies

```bash
cp .env.example .env
docker compose up -d postgres redis
```

This exposes PostgreSQL on port `5450` and Redis on port `6400`.

## Web and API

```bash
docker compose up --build
```

The React app is available at `http://localhost:8010`. The backend base URL is
`http://localhost:8011/echoprint/api/`; FastAPI docs are at
`http://localhost:8011/echoprint/api/docs`, and health is at
`http://localhost:8011/echoprint/api/health`.

## Mobile app

```bash
pnpm install
pnpm --filter mobile start
```

The mobile app is an Expo Router app written in TypeScript and React Native;
Expo can run it on iOS, Android, or the web.
