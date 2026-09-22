try {
  await import("dotenv/config");
} catch {
  /* optional */
}
import mongoose from "mongoose";
import { Listing } from "./models/Listing.js";
import { listings } from "./data/seedData.js";

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/airbnb_clone";

await mongoose.connect(uri);
await Listing.deleteMany({});
await Listing.insertMany(listings);
console.log(`Seeded ${listings.length} listings into ${uri}`);
await mongoose.disconnect();
