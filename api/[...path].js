import { createApp } from "../server/src/app.js";
import { connectStore } from "../server/src/store.js";

const app = createApp();
const ready = connectStore();

export default async function handler(req, res) {
  await ready;
  return app(req, res);
}
