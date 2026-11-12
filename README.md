# Golb

A full-stack social blogging platform: a Next.js frontend and a REST API built with Node.js, Express and PostgreSQL. Users can register, publish posts, follow other users, like, comment and bookmark, and receive notifications.

The application lives in the [`golb/`](./golb) directory.

## Features

- Registration, login and password reset by email, using JWT access and refresh tokens and bcrypt password hashing
- Posts, personal feed, user profiles with stats, and user search
- Follow and unfollow, likes, comments and bookmarks
- Notifications
- Request logging with pino and centralised error handling

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | Next.js, React, Tailwind CSS, Radix UI, react-hook-form, zod |
| Backend | Node.js, Express, `pg` / `pg-promise`, JWT, bcrypt, nodemailer, multer, pino |
| Database | PostgreSQL (tables are created on startup by `db.js`) |
| Testing | Jest and Supertest (with `pg-mem`), Cypress for end-to-end |
| Delivery | Docker, Kubernetes manifests, GitHub Actions (CI and CD) |

## Project structure

```
golb/
├── src/app/
│   ├── Backend/Server_Apis_DB/   # Express API: controllers, models, routes, middleware, db.js
│   ├── Components2/              # Feature components (posts, comments, likes, follow, notifications)
│   └── Frontend/, page.js, ...   # Next.js app routes
├── cypress/                      # End-to-end tests
├── k8s/                          # Deployment and service manifests
├── terraform/                    # AWS scaffolding (resources not enabled yet)
├── Dockerfile.backend
├── Dockerfile.frontend
├── Dockerfile.frontend-ssr
└── .github/workflows/            # ci.yml, cd.yml
```

## Getting started

Requirements: Node.js 18+ and a running PostgreSQL instance.

```bash
cd golb
npm ci
```

Create `golb/.env` with the variables below, then start the API and the frontend in two terminals:

```bash
npm run backend   # Express API
npm run dev       # Next.js on http://localhost:3000
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | API port |
| `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` | PostgreSQL connection (or `DATABASE_URL`) |
| `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` | Secrets used to sign JWTs; use long random values |
| `EMAIL_USER`, `EMAIL_PASS` | Account used by nodemailer to send password reset emails |
| `BASE_URL` | Base URL used in emailed links |
| `NEXT_PUBLIC_API_BASE_URL` | API URL used by the frontend |
| `CORS_ORIGINS` | Comma-separated list of frontend origins allowed to call the API (default `http://localhost:3000`) |
| `BLOB_READ_WRITE_TOKEN` | Optional. Vercel Blob token; when set, profile pictures are stored in Blob and survive redeploys. Without it they are written to local disk |
| `FRONTEND_URL` | Frontend URL used in password reset links |

Never commit a real `.env` file.

## Deploy (Render + Vercel + Neon)

- **Database:** a free Postgres database from Neon. The API creates its tables on startup.
- **API (Render web service):** root directory `golb`, runtime Node, build command `npm ci --omit=dev`, start command `npm run backend`. Set `DATABASE_URL`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `CORS_ORIGINS` (the Vercel URL, no trailing slash) and `BASE_URL` (the Render URL).
- **Frontend (Vercel):** root directory `golb`, framework Next.js, environment variable `NEXT_PUBLIC_API_BASE_URL` set to the Render URL.

Profile pictures are stored in Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set on the API. Without it they are written to the API's local disk, which is cleared on every deploy on Render's free plan. Password reset emails only work when `EMAIL_USER` and `EMAIL_PASS` are set.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` / `npm start` | Production build and server on port 3000 |
| `npm run backend` | Start the Express API |
| `npm run db:check` | Check the database environment settings |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Jest test suite |

End-to-end tests are in `cypress/e2e` and run with Cypress.

## Docker and Kubernetes

`Dockerfile.backend`, `Dockerfile.frontend` and `Dockerfile.frontend-ssr` build the API and the frontend. `k8s/` contains a deployment (2 replicas) and service for each. Replace the placeholder image names (`my-backend`, `my-frontend`) with your registry paths before deploying.

## CI/CD

- **CI** (`ci.yml`): on pushes and pull requests to `main`, installs dependencies, runs lint and the Jest tests.
- **CD** (`cd.yml`): on version tags (`v*.*.*`), builds the backend and frontend images. The registry push and cluster deployment steps are templated and need your registry and cluster details.

## Status

Work in progress. The Terraform files in `terraform/` outline an AWS setup (EKS, RDS, ECR) but the resources are commented out, so they are a starting point and not a working deployment.
