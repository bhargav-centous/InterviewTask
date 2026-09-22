try {
  await import("dotenv/config");
} catch {
  /* optional: runs without .env */
}
import express from "express";
import cors from "cors";
import { connectStore, getHome, getListing, getListings, isMemoryMode } from "./store.js";

const app = express();
const port = Number(process.env.PORT) || 5000;
const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    store: isMemoryMode() ? "memory" : "mongo",
  });
});

app.get("/api/home", async (_req, res) => {
  res.json(await getHome());
});

app.get("/api/listings", async (_req, res) => {
  res.json(await getListings());
});

app.get("/api/listings/:id", async (req, res) => {
  const listing = await getListing(req.params.id);
  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }
  res.json(listing);
});

const started = await connectStore();
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port} (${started.mode})`);
  if (started.mode === "memory") {
    console.log(`Using in-memory seed data: ${started.reason}`);
    console.log("Set MONGO_URI to enable MongoDB. The UI works either way.");
  }
});
