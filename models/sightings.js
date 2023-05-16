const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const sightingSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  description: {
    type: String,
    required: true,
  },
  identification: {
    commonName: {
      type: String,
      default: "unknown",
    },
    scientificName: {
      type: String,
      default: "unknown",
    },
    englishDescription: {
      type: String,
      default: "unknown",
    },
    uri: {
      type: String,
      default: "unknown",
    },
    photoUrl: {
      type: String,
      default: "unknown",
    },
    status: {
      type: String,
      enum: ["unknown", "uncertain", "identified"],
      default: "unknown",
    },
  },
  userNickname: {
    type: String,
    required: true,
  },
  comments: [
    {
      userNickname: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

sightingSchema.index({ location: "2dsphere" });

var Sighting = mongoose.model("Sighting", sightingSchema);

module.exports = Sighting;
