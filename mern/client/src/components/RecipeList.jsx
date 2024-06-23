import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function RecipeList() {
  const location = useLocation();
  const { state } = location;
  const { myInventory } = state || { myInventory: [] };

  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch('http://localhost:5050/recipe/');
      const data = await response.json();
      setRecipes(data);
    };

    const fetchIngredients = async () => {
      const response = await fetch('http://localhost:5050/ingredient/');
      const data = await response.json();
      setIngredientsList(data);
    };

    fetchRecipes();
    fetchIngredients();
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

  const getIngredientName = (id) => {
    const ingredient = ingredientsList.find(ingredient => ingredient._id === id);
    return ingredient ? ingredient.name : 'Unknown Ingredient';
  };

  const getIngredient = (id) => {
    return ingredientsList.find(ingredient => ingredient._id === id);
  };

  const calculateTotalMacros = (recipe) => {
    let totalCalories = 0;
    let totalFat = 0;
    let totalProtein = 0;
    let totalCarbs = 0;

    recipe.ingredients.forEach(ingredient => {
      const ingredientDetails = getIngredient(ingredient.ingredientId);
      if (ingredientDetails) {
        totalCalories += ingredient.amount * ingredientDetails.calories;
        totalFat += ingredient.amount * ingredientDetails.fat;
        totalProtein += ingredient.amount * ingredientDetails.protein;
        totalCarbs += ingredient.amount * ingredientDetails.carbs;
      }
    });

    return { totalCalories, totalFat, totalProtein, totalCarbs };
  };

  return (
    <div id="wrapper" className="bg-[#2F3C7E] relative h-screen-vh text-[#FBEAEB] p-6">
      <nav>
        <NavLink to="/inventory" className="p-2 border rounded-[1rem] top-1 absolute left-2">
          Return
        </NavLink>
      </nav>
      <h1 className="text-2xl text-center mb-4">Recipe List</h1>
      {filteredRecipes.length > 0 ? (
        <ul>
          {filteredRecipes.map(recipe => {
            const { totalCalories, totalFat, totalProtein, totalCarbs } = calculateTotalMacros(recipe);
            return (
              <li key={recipe._id} className="mb-4 border-b border-gray-200 pb-2">
                <h2 className="text-xl">{recipe.name}</h2>
                <img src={`http://localhost:5050${recipe.picture}`} alt={recipe.name} className="w-32 h-32 object-cover" />
                <p>{recipe.description}</p>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {getIngredientName(ingredient.ingredientId)} - {ingredient.amount}
                    </li>
                  ))}
                </ul>
                <p>Total Calories: {totalCalories}</p>
                <p>Total Fat: {totalFat}</p>
                <p>Total Protein: {totalProtein}</p>
                <p>Total Carbs: {totalCarbs}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No recipes can be created with the current inventory.</p>
      )}
    </div>
  );
}
