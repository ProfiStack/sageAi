// const openai = require("../config");

// const analyzeViralProduct = async (productName, skinProfile, preferences) => {
//   const prompt = `Analyze the suitability of ${productName} for a user with ${skinProfile.skinType} skin and concerns: ${skinProfile.concerns.join(", ")}. 
//   The user prefers: ${preferences.brand}, budget: ${preferences.budget}. Provide alternatives if needed.`;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4-turbo",
//     messages: [{ role: "system", content: prompt }],
//     max_tokens: 250,
//   });

//   return response.choices[0].message.content;
// };

// module.exports = { analyzeViralProduct };
