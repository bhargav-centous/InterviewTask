# Airbnb Listing Clone

Pixel-perfect desktop clone of the reference listing experience at [airbnb-orpin-pi.vercel.app](https://airbnb-orpin-pi.vercel.app/), including the homepage, listing page, photo tour, and lightbox. Built as a MERN app: React frontend plus a Node/Express API with optional MongoDB.

## Stack

- **Frontend:** React, Vite, Tailwind CSS v4, React Router, Leaflet
- **Backend:** Node.js, Express
- **Database:** MongoDB (optional). If `MONGO_URI` is missing or Mongo is down, the API serves the same seed data from memory so the UI still runs.

## Run locally

Unzip, then from the project root:

```bash
npm install
npm run dev
```

`npm install` also installs `client` and `server` dependencies. Then open http://localhost:5173.

- Client: http://localhost:5173
- API: http://localhost:5000/api/health

The homepage cards and `/listing/1` (Flat in Pashan) are the main review path:

1. Open the homepage
2. Click **Flat in Pashan**
3. Click **Show all photos** or any hero image for the photo tour
4. Click a tour photo for the lightbox
5. Use `←` / `→` to move, `Esc` to close

### Optional MongoDB

Docker is **not required**. The API already serves seed data in memory.

If you have MongoDB installed locally or an Atlas URI, add `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/airbnb_clone
CLIENT_ORIGIN=http://localhost:5173
```

Then run `npm run seed` and `npm run dev`. `GET /api/health` reports `"store": "mongo"` when connected.

`docker compose up -d` only works if Docker Desktop is installed. Skip it if `docker` is not recognized.

## Project layout

```
client/                 React UI
server/                 Express API + seed data
docs/architecture.svg   Production-scale architecture diagram
.cursor/                Agent / skill configs used during development
PROMPTS.md              Sequence of AI prompts
```

## Scope

Desktop only. Read-only listing data. No booking writes or payments.

## Submission notes

Do not publish this repository publicly. Zip the project (including `docs/architecture.svg`) for email submission.
