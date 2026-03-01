This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


#Creator comments
A simple BLog det up

i used shadcn UI
Next
express router
tailwind

## Backend API configuration

Auth forms call the backend API. By default, the frontend now resolves the API URL to:

- `NEXT_PUBLIC_API_BASE_URL` (if set), otherwise
- `http://<current-host>:5000`

If your backend runs on another host/port, add an environment file with:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Also make sure the backend server is running when testing login/register:

```bash
node src/app/Backend/Server_Apis_DB/server.js
```

## Backend database setup

The Express backend reads database credentials from either:

1. `src/app/Backend/Server_Apis_DB/.env` (preferred for backend-only secrets), or
2. project root `.env`

Example backend `.env`:

```bash
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=golb
DB_PASSWORD=your_password
DB_PORT=5432
# Optional alternative to individual DB_* values
# DATABASE_URL=postgres://postgres:your_password@localhost:5432/golb
```

Helpful commands:

```bash
npm run db:check   # verify env values are being loaded
npm run backend    # start the backend API server
```

If Postgres says `database "<name>" does not exist`, create it first:

```bash
createdb -h localhost -p 5432 -U postgres golb
```
