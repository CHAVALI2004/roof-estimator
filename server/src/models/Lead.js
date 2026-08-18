const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    answers: {
      type: Object,
      required: true,
    },

    estimate_low: {
      type: Number,
      required: true,
    },

    estimate_high: {
      type: Number,
      required: true,
    },

    config_version: {
      type: Number,
      required: true,
    },

    captured_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);