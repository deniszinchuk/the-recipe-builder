import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function RecipeList() {
  const location = useLocation();
  const { state } = location;
  const { myInventory } = state || { myInventory: [] };
  const navigate = useNavigate();

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

    const checkRecipes = recipes.filter(recipe => {
      const canMakeRecipe = recipe.ingredients.every(ingredient => {
        const availableAmount = inventoryMap.get(ingredient.ingredientId);
        return availableAmount && availableAmount >= ingredient.amount;
      });
      return canMakeRecipe;
    });

    // Sort recipes by healthinessScore
    checkRecipes.sort((a, b) => b.healthinessScore - a.healthinessScore);

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
        <NavLink to="/" className="p-2 border rounded-[1rem] top-1 absolute left-2">
          Return
        </NavLink>
      </nav>
      <h1 className="text-2xl text-center mb-4">Recipe List</h1>
      {filteredRecipes.length > 0 ? (
        <div className="flex gap-[3rem] flex-wrap justify-center items-center mt-[20px] pb-[100px]">
          {filteredRecipes.map(recipe => {
            const { totalCalories, totalFat, totalProtein, totalCarbs } = calculateTotalMacros(recipe);
            return (
              <div key={recipe._id} className="flex flex-col hover:opacity-[0.7] justify-center border rounded p-3 min-w-[300px] cursor-pointer" onClick={() => navigate(`/recipe/${recipe._id}`)}>
                <div className="flex justify-center flex-col items-center">
                  <img src={`http://localhost:5050${recipe.picture}`} alt={recipe.name} className="w-[200px] h-[200px] object-cover rounded" />
                  <h2 className="text-[2rem] text-center"><strong>{recipe.name}</strong></h2>
                  <p>Total Calories: {totalCalories}</p>
                  <p>Total Fat: {totalFat}</p>
                  <p>Total Protein: {totalProtein}</p>
                  <p>Total Carbs: {totalCarbs}</p>
                  <p>Healthiness Score: {recipe.healthinessScore}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Unfortunately, no recipes were found with the ingredients you provided. Add more ingredients and try again!</p>
      )}
    </div>
  );
}
