const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Config = require("./models/Config");

dotenv.config();

const config = {
  config_version: 3,

  business: {
    name: "Northline Roofing & Exteriors",
    region: "Columbus, OH",
    currency: "USD",
  },

  questions: [
    {
      key: "roof_area",
      label: "Roughly how big is your roof?",
      type: "number",
      unit: "sq ft",
      required: true,
      min: 300,
      max: 12000,
      active: true,
    },

    {
      key: "material",
      label: "What material do you want?",
      type: "select",
      required: true,
      active: true,
      options: [
        {
          value: "asphalt_3tab",
          label: "Asphalt shingle - 3-tab",
          rate_per_sqft: 4.25,
        },
        {
          value: "asphalt_arch",
          label: "Asphalt shingle - architectural",
          rate_per_sqft: 5.9,
        },
        {
          value: "metal_standing",
          label: "Standing seam metal",
          rate_per_sqft: 12.4,
        },
        {
          value: "cedar_shake",
          label: "Cedar shake",
          rate_per_sqft: 11.1,
        },
      ],
    },

    {
      key: "pitch",
      label: "How steep is the roof?",
      type: "select",
      required: true,
      active: true,
      options: [
        {
          value: "low",
          label: "Low - you could walk on it",
          multiplier: 1.0,
        },
        {
          value: "medium",
          label: "Medium",
          multiplier: 1.12,
        },
        {
          value: "steep",
          label: "Steep - not walkable",
          multiplier: 1.3,
        },
      ],
    },

    {
      key: "layers",
      label: "How many layers of old roofing are on there now?",
      type: "select",
      required: true,
      active: true,
      options: [
        {
          value: "0",
          label: "None - new build",
          tear_off_per_sqft: 0,
        },
        {
          value: "1",
          label: "One layer",
          tear_off_per_sqft: 1.15,
        },
        {
          value: "2",
          label: "Two or more layers",
          tear_off_per_sqft: 2.05,
        },
      ],
    },

    {
      key: "stories",
      label: "How many stories is the house?",
      type: "select",
      required: true,
      active: true,
      options: [
        {
          value: "1",
          label: "Single storey",
          multiplier: 1.0,
        },
        {
          value: "2",
          label: "Two storeys",
          multiplier: 1.08,
        },
        {
          value: "3",
          label: "Three or more",
          multiplier: 1.18,
        },
      ],
    },
  ],

  modifiers: {
    waste_factor: 0.1,
    permit_flat_fee: 350,
    range_spread_pct: 12,
  },
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const existingConfig = await Config.findOne();

    if (existingConfig) {
      console.log("Configuration already exists. Skipping seed.");
    } else {
      await Config.create(config);
      console.log("Configuration seeded successfully");
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedDatabase();