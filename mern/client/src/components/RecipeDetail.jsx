import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`http://localhost:5050/recipe/${id}`);
      const data = await response.json();
      setRecipe(data);
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <p>Loading...</p>;
  }

  return (
    <div id="wrapper" className="bg-[#2F3C7E] relative h-screen-vh text-[#FBEAEB] p-6">
      <nav>
        <NavLink to="/recipe-list" className="p-2 border rounded-[1rem] top-1 absolute left-2">
          Return to Recipe List
        </NavLink>
      </nav>
      <h1 className="text-2xl text-center mb-4">{recipe.name}</h1>
      <div className="flex gap-[3rem] flex-wrap">
        <div>
          <img src={`http://localhost:5050${recipe.picture}`} alt={recipe.name} className="w-[300px] h-[300px] object-cover" />
        </div>
        <div>
          <p className="text-xl">{recipe.description}</p>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name} - {ingredient.amount}
              </li>
            ))}
          </ul>
          <p>Healthiness Evaluation: {recipe.evaluation}</p>
          <p>Healthiness Score: {recipe.healthinessScore}</p>
          <p>Healthy Suggestion: {recipe.healthySuggestion}</p>
        </div>
      </div>
    </div>
  );
}
