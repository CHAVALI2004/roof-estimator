const express = require("express");
const jwt = require("jsonwebtoken");

const Config = require("../models/Config");
const Lead = require("../models/Lead");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();


// ============================
// ADMIN LOGIN
// ============================

router.post("/login", (req, res) => {
  try {
    const {
      username,
      password,
    } = req.body;

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        username,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});


// ============================
// GET ADMIN CONFIG
// ============================

router.get("/config", adminAuth, async (req, res) => {
  try {
    const config = await Config.findOne().sort({
      config_version: -1,
    });

    if (!config) {
      return res.status(404).json({
        message: "Configuration not found",
      });
    }

    res.json(config);
  } catch (error) {
    console.error("Admin config error:", error);

    res.status(500).json({
      message: "Failed to load configuration",
    });
  }
});


// ============================
// UPDATE CONFIG
// ============================

router.put("/config", adminAuth, async (req, res) => {
  try {
    const currentConfig = await Config.findOne().sort({
      config_version: -1,
    });

    if (!currentConfig) {
      return res.status(404).json({
        message: "Configuration not found",
      });
    }

    const updatedConfig = await Config.findByIdAndUpdate(
      currentConfig._id,
      {
        $set: {
          business: req.body.business,
          questions: req.body.questions,
          modifiers: req.body.modifiers,
        },
        $inc: {
          config_version: 1,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      message: "Configuration updated successfully",
      config: updatedConfig,
    });
  } catch (error) {
    console.error("Update config error:", error);

    res.status(400).json({
      message: "Failed to update configuration",
    });
  }
});


// ============================
// GET LEADS
// ============================

router.get("/leads", adminAuth, async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({
        captured_at: -1,
      });

    res.json(leads);
  } catch (error) {
    console.error("Leads error:", error);

    res.status(500).json({
      message: "Failed to load leads",
    });
  }
});


module.exports = router;