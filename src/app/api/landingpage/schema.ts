import mongoose, { Schema, models, model } from "mongoose";

const LandingPageSchema = new Schema(
  {
    brand: { type: String, required: true },
    desc: { type: String, required: true },
    trackingLink: { type: String },
    imageUrl: { type: String },
    brandColor: { type: String, default: "#ffffff" },
    descColor: { type: String, default: "#ffffff" },
  },
  { timestamps: true },
);

export const LandingPage =
  models.LandingPage || model("LandingPage", LandingPageSchema);
