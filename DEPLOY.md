# Running and deploying ChargeHub

## Local

1. Copy `.env.example` to `.env` and set `DB_PASSWORD`, `DB_NAME` and `JWT_SECRET`.
2. Create the database in Postgres (for example `chargehubEV`). Tables are created on start.
3. `npm install`, then `npm run start:dev`. The API listens on http://localhost:3000.
4. In the frontend repo, copy `.env.example` to `.env.local`, then `npm install` and `npm run dev` (http://localhost:5123).

## Free hosting

| Piece | Service | Notes |
| --- | --- | --- |
| Database | Neon (or Supabase) | Copy the connection string into `DATABASE_URL`. |
| Backend | Render web service (free) | Build `npm install && npm run build`, start `node dist/main.js`. Sleeps after ~15 min idle. |
| Frontend | Vercel | Set `NEXT_PUBLIC_API_URL` to the Render URL. |

Render environment variables: `DATABASE_URL`, `JWT_SECRET` (long random string), `NODE_ENV=production`,
`CORS_ORIGIN=https://<your-app>.vercel.app`, plus `MAIL_*` and `PUSHER_*` if you use email and realtime.
Render sets `PORT` itself.

`DB_SYNCHRONIZE=true` (the default) lets TypeORM create tables automatically. That is fine for a
class project; switch it off and use migrations once the data matters.
