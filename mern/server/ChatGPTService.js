import fetch from 'node-fetch';

const OPENAI_API_KEY = "sk-proj-J4UcUwLV6r7Vgjs4c6nJT3BlbkFJEDHHOS1YouYQWctWMeOG";

async function getHealthinessEvaluation(recipeName, ingredients) {
  console.log('Recipe Name:', recipeName);
  console.log('Ingredients:', JSON.stringify(ingredients, null, 2));

  const prompt = `
  Evaluate the healthiness of the following recipe on a scale of 1-10 and begin your sentence with Healthiness Score:{healthinessScore}, and explain why:
  Recipe Name: ${recipeName}
  Ingredients:
  ${ingredients.map(ingredient => {
    const { name, amount } = ingredient;
    return `${name} - ${amount}`;
  }).join(', ')}
  Macronutrients:
  ${ingredients.map(ingredient => {
    const { calories, fat, protein, carbs } = ingredient;
    return `Calories: ${calories}, Fat: ${fat}, Protein: ${protein}, Carbs: ${carbs}`;
  }).join('; ')}

  Additionally, suggest how this dish can be made healthier by adding one new ingredient and provide the recipe for this healthier version.
  `;

  console.log('Prompt:', prompt);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  console.log('ChatGPT API response:', JSON.stringify(data, null, 2));

  if (data.choices && data.choices[0] && data.choices[0].message) {
    const evaluationText = data.choices[0].message.content.trim();
    const evaluationMatch = evaluationText.match(/Healthiness Score:(\d+)/);
    const healthinessScore = evaluationMatch ? parseInt(evaluationMatch[1], 10) : null;

    const healthySuggestion = evaluationText.split("Additionally,")[1]?.trim();
    
    return {
      evaluation: evaluationText,
      healthinessScore: healthinessScore,
      healthySuggestion: healthySuggestion
    };
  } else {
    throw new Error('Invalid response from ChatGPT API');
  }
}

export { getHealthinessEvaluation };