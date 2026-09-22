import mongoose from "mongoose";
import { Listing } from "./models/Listing.js";
import { listings as seedListings, destinations } from "./data/seedData.js";

let memoryMode = true;
let memoryListings = structuredClone(seedListings);

export function isMemoryMode() {
  return memoryMode;
}

export async function connectStore() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    memoryMode = true;
    return { mode: "memory", reason: "MONGO_URI not set" };
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    const count = await Listing.countDocuments();
    if (count === 0) {
      await Listing.insertMany(seedListings);
    }
    memoryMode = false;
    return { mode: "mongo", reason: "connected" };
  } catch (error) {
    memoryMode = true;
    return { mode: "memory", reason: error.message };
  }
}

function toCard(listing) {
  const images =
    listing.heroPhotos?.map((photo) => photo.src).filter(Boolean) ||
    [listing.cardImage].filter(Boolean);
  return {
    listingId: listing.listingId,
    title: listing.title,
    cardPriceLabel: listing.cardPriceLabel,
    cardRating: listing.cardRating,
    cardImage: listing.cardImage,
    images: images.length ? images : [listing.cardImage],
    guestFavourite: listing.guestFavourite,
    category: listing.category,
    location: listing.location,
  };
}

export async function getHome() {
  if (memoryMode) {
    return {
      source: "memory",
      destinations,
      sections: [
        {
          id: "pune",
          title: "Places to stay in Pune",
          listings: memoryListings.filter((l) => l.category === "pune").map(toCard),
        },
        {
          id: "goa",
          title: "Popular homes in North Goa",
          listings: memoryListings.filter((l) => l.category === "goa").map(toCard),
        },
      ],
    };
  }

  const docs = await Listing.find().sort({ listingId: 1 }).lean();
  return {
    source: "mongo",
    destinations,
    sections: [
      {
        id: "pune",
        title: "Places to stay in Pune",
        listings: docs.filter((l) => l.category === "pune").map(toCard),
      },
      {
        id: "goa",
        title: "Popular homes in North Goa",
        listings: docs.filter((l) => l.category === "goa").map(toCard),
      },
    ],
  };
}

export async function getListing(id) {
  const listingId = Number(id);
  if (memoryMode) {
    return memoryListings.find((l) => l.listingId === listingId) || null;
  }
  return Listing.findOne({ listingId }).lean();
}

export async function getListings() {
  if (memoryMode) return memoryListings;
  return Listing.find().sort({ listingId: 1 }).lean();
}
