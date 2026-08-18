const express = require("express");

const Config = require("../models/Config");
const Lead = require("../models/Lead");
const calculateEstimate = require("../services/calculator");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      answers,
    } = req.body;

    // Validate contact details
    if (!name || !phone || !email) {
      return res.status(400).json({
        message: "Name, phone and email are required",
      });
    }

    // Validate answers
    if (!answers) {
      return res.status(400).json({
        message: "Estimator answers are required",
      });
    }

    // Get latest configuration
    const config = await Config.findOne().sort({
      config_version: -1,
    });

    if (!config) {
      return res.status(500).json({
        message: "Estimator configuration not found",
      });
    }

    // Calculate estimate on server
    const estimate = calculateEstimate(
      config,
      answers
    );

    // Save lead
    const lead = await Lead.create({
      name,
      phone,
      email,
      answers,
      estimate_low: estimate.low,
      estimate_high: estimate.high,
      config_version: config.config_version,
    });

    res.status(201).json({
      message: "Estimate generated successfully",

      estimate: {
        low: estimate.low,
        high: estimate.high,
        mid: estimate.mid,
      },

      lead_id: lead._id,

      config_version: config.config_version,
    });
  } catch (error) {
    console.error("Estimate error:", error);

    res.status(400).json({
      message: error.message || "Failed to generate estimate",
    });
  }
});

module.exports = router;