import express from "express";
import cors from "cors";
import { getHome, getListing, getListings, isMemoryMode } from "./store.js";

export function createApp() {
  const app = express();
  const origin = process.env.CLIENT_ORIGIN || true;
  const routes = express.Router();

  app.use(cors({ origin }));
  app.use(express.json());

  routes.get("/health", (_req, res) => {
    res.json({
      ok: true,
      store: isMemoryMode() ? "memory" : "mongo",
    });
  });

  routes.get("/home", async (_req, res) => {
    res.json(await getHome());
  });

  routes.get("/listings", async (_req, res) => {
    res.json(await getListings());
  });

  routes.get("/listings/:id", async (req, res) => {
    const listing = await getListing(req.params.id);
    if (!listing) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }
    res.json(listing);
  });

  // Local Express uses /api/*. Vercel catch-all may strip that prefix.
  app.use("/api", routes);
  app.use("/", routes);

  return app;
}
