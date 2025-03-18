const { matchProducts } = require("../services/productDBService");

exports.recommendProducts = async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    
    // Fetch user skin profile
    const skinProfile = await SkinProfile.findOne({ userId });

    if (!skinProfile) return res.status(404).json({ error: "Skin profile not found" });

    // Get recommended products
    const recommendedProducts = await matchProducts(skinProfile.analysis, preferences);

    res.status(200).json({ recommendations: recommendedProducts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};
