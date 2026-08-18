const express = require("express");
const Config = require("../models/Config");

const router = express.Router();

// GET current estimator configuration
router.get("/", async (req, res) => {
  try {
    const config = await Config.findOne().sort({
      config_version: -1,
    });

    if (!config) {
      return res.status(404).json({
        message: "Configuration not found",
      });
    }

    res.json({
      business: config.business,
      questions: config.questions.filter(
        (question) => question.active
      ),
    });
  } catch (error) {
    console.error("Config error:", error);

    res.status(500).json({
      message: "Failed to load configuration",
    });
  }
});

module.exports = router;