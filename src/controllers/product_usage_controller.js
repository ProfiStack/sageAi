const { optimizeUsage } = require("../services/aiService");

exports.optimizeProductUsage = async (req, res) => {
  try {
    const { userId, productName, routine } = req.body;

    // Fetch user skin profile
    const skinProfile = await SkinProfile.findOne({ userId });

    if (!skinProfile) return res.status(404).json({ error: "Skin profile not found" });

    // Generate optimized routine
    const optimizedRoutine = await optimizeUsage(productName, skinProfile.analysis, routine);

    res.status(200).json({ optimizedRoutine });
  } catch (error) {
    res.status(500).json({ error: "Failed to optimize product usage" });
  }
};
