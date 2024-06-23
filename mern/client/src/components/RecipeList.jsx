import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function RecipeList() {
  const location = useLocation();
  const { state } = location;
  const { myInventory } = state || { myInventory: [] };

  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch('http://localhost:5050/recipe/');
      const data = await response.json();
      setRecipes(data);
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    const inventoryMap = new Map();
    myInventory.forEach(item => {
      inventoryMap.set(item._id, item.count);
    });

    console.log("Inventory Map:", inventoryMap); // Log inventory map

    const checkRecipes = recipes.filter(recipe => {
      console.log("Checking recipe:", recipe.name); // Log recipe being checked
      const canMakeRecipe = recipe.ingredients.every(ingredient => {
        const availableAmount = inventoryMap.get(ingredient.ingredientId);
        console.log(`Ingredient ID: ${ingredient.ingredientId}, Required: ${ingredient.amount}, Available: ${availableAmount}`); // Log ingredient check
        return availableAmount && availableAmount >= ingredient.amount;
      });

      console.log(`Can make recipe ${recipe.name}:`, canMakeRecipe); // Log if recipe can be made
      return canMakeRecipe;
    });

    setFilteredRecipes(checkRecipes);
  }, [recipes, myInventory]);

  return (
    <div className="bg-[#2F3C7E] h-screen-vh text-[#FBEAEB] p-6">
      <h1 className="text-2xl text-center mb-4">Recipe List</h1>
      {filteredRecipes.length > 0 ? (
        <ul>
          {filteredRecipes.map(recipe => (
            <li key={recipe._id} className="mb-4 border-b border-gray-200 pb-2">
              <h2 className="text-xl">{recipe.name}</h2>
              <img src={`http://localhost:5050${recipe.picture}`} alt={recipe.name} className="w-32 h-32 object-cover" />
              <p>{recipe.description}</p>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.ingredientId} - {ingredient.amount}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes can be created with the current inventory.</p>
      )}
    </div>
  );
}
