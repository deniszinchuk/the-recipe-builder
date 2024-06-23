import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

export async function getHealthinessEvaluation(recipe) {
  const prompt = `
  Recipe: ${recipe.name}
  Ingredients: ${recipe.ingredients.map(ing => `${ing.name} - ${ing.amount} (Calories: ${ing.calories}, Protein: ${ing.protein}, Carbs: ${ing.carbs}, Fat: ${ing.fat})`).join(', ')}
  Description: ${recipe.description}

  How healthy do you think this meal is and how healthy do you think it is on a scale of 1-10?
  `;

  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 150
    })
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}
