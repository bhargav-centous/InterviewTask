try {
  await import("dotenv/config");
} catch {
  /* optional: runs without .env */
}
import { createApp } from "./app.js";
import { connectStore } from "./store.js";

const app = createApp();
const port = Number(process.env.PORT) || 5000;

const started = await connectStore();
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port} (${started.mode})`);
  if (started.mode === "memory") {
    console.log(`Using in-memory seed data: ${started.reason}`);
    console.log("Set MONGO_URI to enable MongoDB. The UI works either way.");
  }
});
