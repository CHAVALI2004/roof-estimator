function calculateEstimate(config, answers) {
  const roofArea = Number(answers.roof_area);

  if (!roofArea || roofArea <= 0) {
    throw new Error("Invalid roof area");
  }

  const materialQuestion = config.questions.find(
    (question) => question.key === "material"
  );

  const pitchQuestion = config.questions.find(
    (question) => question.key === "pitch"
  );

  const layersQuestion = config.questions.find(
    (question) => question.key === "layers"
  );

  const storiesQuestion = config.questions.find(
    (question) => question.key === "stories"
  );

  const material = materialQuestion.options.find(
    (option) => option.value === answers.material
  );

  const pitch = pitchQuestion.options.find(
    (option) => option.value === answers.pitch
  );

  const layers = layersQuestion.options.find(
    (option) => option.value === answers.layers
  );

  const stories = storiesQuestion.options.find(
    (option) => option.value === answers.stories
  );

  if (!material || !pitch || !layers || !stories) {
    throw new Error("Invalid estimator answers");
  }

  const wasteFactor = Number(config.modifiers.waste_factor);
  const permitFee = Number(config.modifiers.permit_flat_fee);
  const spreadPct = Number(config.modifiers.range_spread_pct);

  // Material cost
  const materialCost =
    roofArea *
    Number(material.rate_per_sqft) *
    (1 + wasteFactor);

  // Tear-off cost
  const tearOffCost =
    roofArea *
    Number(layers.tear_off_per_sqft || 0);

  // Apply pitch and stories multipliers
  const adjustedSubtotal =
    (materialCost + tearOffCost) *
    Number(pitch.multiplier) *
    Number(stories.multiplier);

  // Add permit
  const midEstimate =
    adjustedSubtotal + permitFee;

  // Estimate range
  const spread = spreadPct / 100;

  const low =
    Math.round(midEstimate * (1 - spread));

  const high =
    Math.round(midEstimate * (1 + spread));

  return {
    low,
    high,
    mid: Math.round(midEstimate),
  };
}

module.exports = calculateEstimate;