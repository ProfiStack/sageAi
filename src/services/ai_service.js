const optimizeUsage = async (productName, skinProfile, routine) => {
  const prompt = `How should a user with ${skinProfile.skinType} skin and concerns: ${skinProfile.concerns.join(", ")} 
  incorporate ${productName} into their routine (${routine})? Suggest best usage practices and potential conflicts.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "system", content: prompt }],
    max_tokens: 200,
  });

  return response.choices[0].message.content;
};

module.exports = { optimizeUsage };
