const mongoose = require("mongoose").set("debug", true);

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
    },
    scientificName: {
      type: String,
    },
    englishDescription: {
      type: String,
    },
    uri: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["unknown", "uncertain", "identified"],
      default: "unknown",
    },
    suggestedBy: {
      type: String,
    },
    suggestedAt: {
      type: Date,
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
