**Project Golb-Setup Documentation**

---

## 1. Introduction

This document describes the architecture, components, and workflow of the **Golb-Setup** project, which includes a RESTful backend API built with Node.js, Express, and PostgreSQL, as well as a front-end application. It also outlines the CI/CD, containerization, and deployment strategy.

## 2. Architecture Overview

- **Backend**: Node.js, Express, PostgreSQL using `pg` library. Async error handling via `express-async-errors`.
- **Frontend**: (Reviewed separately) React/Vue/Angular.
- **Authentication**: JWT access & refresh tokens.
- **Error Handling**: Centralized error codes module and global error handler.
- **Logging**: Request-level logging.

## 3. Folder Structure

```
src/
├── app/
│   ├── Backend/
│   │   ├── controllers/       # Route handler logic
│   │   ├── middleware/        # Auth & utilities
│   │   ├── models/            # DB queries
│   │   ├── routes/            # Express routers
│   │   ├── utils/             # Helpers (logger, email, uploads)
│   │   ├── db.js              # Pool setup & schema creation
│   │   ├── config.js          # Environment config
│   │   └── server.js          # App initialization
│   └── Frontend/ ...
└── tests/                     # Unit & integration tests
```

## 4. Configuration

- **config.js** loads via `dotenv`
- Keys:
  - `PORT`, `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`
  - `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`
  - `EMAIL_USER`, `EMAIL_PASS` for nodemailer

## 5. Database Schema

Created in `db.js`:

- `users`
- `posts`
- `followers`
- `likes`
- `comments`
- `bookmarks`
- `notifications`

Refer to DDL in `db.js` for columns and constraints.

## 6. Models

Each table has a corresponding model in `models/*.model.js`:
- **users.model.js**: CRUD for users, profiles, stats, search
- **posts.model.js**: Create, view, feed, counts
- **followers.model.js**: follow/unfollow logic and stats
- **likes.model.js**: like/unlike logic and counts
- **comments.model.js**: nested comments, add/edit/delete
- **bookmarks.model.js**: bookmark management
- **notifications.model.js**: CRUD and marking as read

## 7. Controllers

In `controllers/*.controller.js`, business logic moves from routes:
- Validate inputs
- Call models
- Map errors to standardized codes
- Format responses

Example: `auth.controller.js` handles login, token refresh, protected endpoints.

## 8. Routes

In `routes/*.routes.js`, each resource has its own router:

- `/api/auth` – login, refresh, current user, protected test
- `/api/register`, `/api/forgot-password`, `/api/reset-password`
- `/api/posts`, `/api/viewposts`, `/api/feed`
- `/api/comment`, `/api/comments`, `/api/reply`, etc.
- `/api/follow`, `/api/unfollow`, `/api/followers`, `/api/following`
- `/api/like`, `/api/unlike`, `/api/likes`, `/api/user-likes`
- `/api/bookmark`, `/api/bookmarks`
- `/api/search`
- `/uploads` static route

## 9. Middleware

- **AuthenticateMiddleware**: Verifies JWT, attaches `req.user`
- **errorHandler**: Global catch-all for errors, maps to standardized HTTP codes
- **requestLogger**: Logs incoming requests

## 10. Error Handling

In `utils/errorCodes.js`, a set of `{ code, message }` objects:
- `INTERNAL_SERVER_ERROR`
- `USER_NOT_FOUND`, `INVALID_TOKEN`, `EMAIL_ALREADY_EXISTS`
- `MISSING_FIELDS`, `POST_NOT_FOUND`, `COMMENT_NOT_FOUND`, etc.

Controllers `throw { status, ...ERROR_CODE }` and `errorHandler` middleware formats JSON responses.

## 11. Testing Strategy

- **Unit tests**: models isolated with in-memory DB (pg-mem) or mocks.
- **Integration tests**: endpoints via Supertest or Cypress.
- **Authentication Middleware**: tested separately.

## 12. CI/CD & Deployment Plan

1. **Documentation** (this write-up)
2. **GitHub Actions** workflows:
   - Lint, test on push & PR
   - Build & publish Docker images
3. **Docker**:
   - `Dockerfile` for backend
   - `docker-compose.yml` for local dev
4. **Kubernetes**:
   - Manifests: Deployment, Service, Ingress
5. **AWS**:
   - EKS cluster for k8s
   - RDS for PostgreSQL
6. **Terraform**:
   - Provision AWS infra: VPC, EKS, RDS, IAM roles

---

*Next Steps*: Review, then begin CI/CD setup.

Next Steps
Secrets & Config: Store DB credentials, JWT secrets in Kubernetes Secrets or GitHub Actions Secrets.

Terraform: Define AWS EKS cluster, RDS instance, IAM roles, and deploy these manifests via a CI job.

Helm: Optionally wrap the K8s YAMLs into a Helm chart for templating.