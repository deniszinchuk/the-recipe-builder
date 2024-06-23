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
    <div id="wrapper" className="relative h-screen-vh text-[#FBEAEB] p-6">
      <nav>
        <NavLink to="/inventory" className="p-2 border rounded-[1rem] top-1 absolute left-2">
          Return
        </NavLink>
      </nav>
      <h1 className="text-2xl text-center mb-4">Recipe List</h1>
      {filteredRecipes.length > 0 ? (
        <div className="flex gap-[3rem] flex-wrap justify-center mt-[20px] pb-[100px]">
          {filteredRecipes.map(recipe => {
            const { totalCalories, totalFat, totalProtein, totalCarbs } = calculateTotalMacros(recipe);
            return (
              <div key={recipe._id} className="border rounded p-3">
                <div className="flex gap-[1rem]">
                  <div className="relative">
                    <img src={`http://localhost:5050${recipe.picture}`} alt={recipe.name} className="w-[200px] h-[200px] object-cover rounded" />
                    <div className="p-3 top-0 rounded opacity-0 cursor-pointer hover:opacity-100 transition-opacity absolute w-full h-full bg-black flex justify-center items-center flex-col overflow-auto hide-scrollbar">
                      {recipe.ingredients.map((ingredient, index) => (
                        <div key={index}>
                          {getIngredientName(ingredient.ingredientId)} - {ingredient.amount}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-auto flex flex-col pt-[20px] ">
                    <h2 className="text-xl"><strong>{recipe.name}</strong></h2>
                    <p>Total Calories: {totalCalories}</p>
                    <p>Total Fat: {totalFat}</p>
                    <p>Total Protein: {totalProtein}</p>
                    <p>Total Carbs: {totalCarbs}</p>
                  </div>
                </div>
                <div className="mt-[10px] flex justify-center items-center">
                  <div className="w-full h-[100px] p-2 rounded text-black bg-white overflow-auto hide-scrollbar">{recipe.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No recipes can be created with the current inventory.</p>
      )}
    </div>
  );
}
