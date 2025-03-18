const openai = require("../config");

const matchProducts = async (skinProfile, preferences) => {
  const prompt = `Recommend skincare products for a user with ${skinProfile.skinType} skin and concerns: ${skinProfile.concerns.join(", ")}. 
  The user prefers: ${preferences.brand}, budget: ${preferences.budget}, ingredient restrictions: ${preferences.restrictions}.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "system", content: prompt }],
    max_tokens: 300,
  });

  return response.choices[0].message.content;
};

module.exports = { matchProducts };
