import fetch from 'node-fetch';

const OPENAI_API_KEY = "sk-proj-J4UcUwLV6r7Vgjs4c6nJT3BlbkFJEDHHOS1YouYQWctWMeOG";

export async function getHealthinessEvaluation(recipeName, ingredients) {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not set");
  }

  const prompt = `Evaluate the healthiness of the following recipe on a scale of 1-10, and explain why:
Recipe Name: ${recipeName}
Ingredients: ${ingredients.map(i => `${i.name} - ${i.amount}`).join(', ')}
Macronutrients: ${ingredients.map(i => `Calories: ${i.calories}, Fat: ${i.fat}, Protein: ${i.protein}, Carbs: ${i.carbs}`).join('; ')}
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  const evaluation = data.choices[0].message.content.trim();
  const healthinessScore = evaluation.match(/\b\d+\b/); // Extract the score from the response text

  return {
    evaluation,
    healthinessScore: healthinessScore ? parseInt(healthinessScore[0], 10) : null,
  };
}
