# Romansh — backend + app

A Wordle-style guessing game for modern romance books. The book catalog now lives
in Postgres and is served by a small Express API, so books added through the app
persist and are shared across everyone who plays.

```
romansh-app/
├── server/
│   ├── src/
│   │   ├── index.js          # Express app: serves the API and the frontend
│   │   ├── db.js             # Postgres connection pool
│   │   └── routes/books.js   # GET /api/books, /random, ?q=…  +  POST /api/books
│   ├── db/
│   │   ├── schema.sql        # books table
│   │   ├── migrate.js        # applies schema.sql
│   │   └── seed.js           # loads the original 45-book catalog
│   ├── .env.example
│   └── package.json
└── public/
    └── index.html            # frontend; fetches the catalog from the API
```

## Run it locally

You need Node 18+ and a running PostgreSQL.

```bash
cd server
cp .env.example .env          # then edit .env for your database
npm install
npm run migrate               # create the books table
npm run seed                  # load the 45 starter books
npm start                     # serves app + API at http://localhost:3000
```

Open http://localhost:3000 and play. "Add a book" now writes to the database.

## API

| Method | Path                | Purpose                                   |
|--------|---------------------|-------------------------------------------|
| GET    | `/api/books`        | Full catalog (or `?q=` to search)         |
| GET    | `/api/books/random` | One random book                           |
| POST   | `/api/books`        | Add a book (validated; 409 on duplicate)  |
| GET    | `/api/health`       | Health/readiness check                    |

POST body:

```json
{
  "title": "The Love Hypothesis",
  "author": "Ali Hazelwood",
  "year": 2021,
  "pages": 384,
  "spicy": true,
  "tropes": ["Fake Dating", "STEM", "Forced Proximity"]
}
```

`tropes` may also be a comma-separated string; the server splits it.

## Configuration

Set either `DATABASE_URL` (plus `PGSSL=true` if your host needs SSL) or the
discrete `PGHOST`/`PGPORT`/`PGUSER`/`PGPASSWORD`/`PGDATABASE` vars. See
`.env.example`. Set `CORS_ORIGIN` to your site's origin in production.

## Deploying

Because the Express server serves both the API and the static frontend, you can
deploy the whole thing as one Node service. A common, low-cost setup:

1. Create a managed Postgres database (Render, Railway, Neon, Supabase, etc.).
2. Deploy the `server/` folder as a Node web service. Set the env vars, point the
   start command at `npm start`, and run `npm run migrate && npm run seed` once.
3. Visit the service URL.

You can also split them — host `public/` on a static host and the API as a Node
service — but then set `API_BASE` in `public/index.html` to the API's origin and
lock `CORS_ORIGIN` to the static site's origin.

## Notes

The book metadata and the spicy/sweet flags are hand-entered and subjective; spot-
check entries you care about. These are real titles by working authors — fine to
reference factually in a fan game, but don't add actual text from the books.
