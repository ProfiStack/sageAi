// const SkinProfile = require("../models/SkinProfile");
// const { analyzeSkin } = require("../services/aiService");

// exports.uploadImage = async (req, res) => {
//   try {
//     const { userId, metadata } = req.body;
//     const imageUrl = req.file.path; // Stored in Cloudinary/AWS

//     // Run AI model for skin analysis
//     const analysis = await analyzeSkin(imageUrl, metadata);

//     // Save results
//     const skinProfile = new SkinProfile({
//       userId,
//       imageUrl,
//       analysis,
//     });

//     await skinProfile.save();

//     res.status(200).json({ message: "Skin analysis complete", skinProfile });
//   } catch (error) {
//     res.status(500).json({ error: "Skin analysis failed" });
//   }
// };
