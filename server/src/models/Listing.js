import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    listingId: { type: Number, unique: true, index: true },
    title: String,
    type: String,
    location: {
      city: String,
      area: String,
      country: String,
      lat: Number,
      lng: Number,
    },
    guests: Number,
    bedrooms: Number,
    beds: Number,
    bathrooms: Number,
    pricePerNight: Number,
    currency: String,
    rating: Number,
    reviewCount: Number,
    guestFavourite: Boolean,
    isRareFind: Boolean,
    host: mongoose.Schema.Types.Mixed,
    description: String,
    highlights: [mongoose.Schema.Types.Mixed],
    heroPhotos: [mongoose.Schema.Types.Mixed],
    rooms: [mongoose.Schema.Types.Mixed],
    amenityPreview: [String],
    amenities: [mongoose.Schema.Types.Mixed],
    photoTour: [mongoose.Schema.Types.Mixed],
    reviewScores: mongoose.Schema.Types.Mixed,
    reviewTags: [mongoose.Schema.Types.Mixed],
    reviews: [mongoose.Schema.Types.Mixed],
    houseRules: [String],
    safety: [String],
    cancellation: [String],
    category: String,
    cardPriceLabel: String,
    cardRating: Number,
    cardImage: String,
  },
  { timestamps: true }
);

export const Listing = mongoose.model("Listing", listingSchema);
