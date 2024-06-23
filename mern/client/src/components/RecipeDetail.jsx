import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';

export default function RecipeDetail() {
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

  const getIngredientName = (id) => {
    const ingredient = ingredientsList.find(ingredient => ingredient._id === id);
    return ingredient ? ingredient.name : 'Unknown Ingredient';
  };
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
      <div className="flex flex-col justify-center items-center pb-[100px]">
        <div className="flex items-center justify-center">
          <img src={`http://localhost:5050${recipe.picture}`} alt={recipe.name} className="w-[300px] h-[300px] object-cover" />
          <div>
            <p className="text-xl">{recipe.description}</p>
            <div>
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index}>
                  <p>Ingredients</p>
                  <div>{getIngredientName(ingredient.ingredientId)} - {ingredient.amount}</div>
                </div>
              ))}
            </div>
            <p>Healthiness Score: {recipe.healthinessScore}</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-[60%] p-3 pt-0">
          <div className="text-[2rem]">ChatGPT Evaluation</div>
          <div className="bg-white text-black rounded p-1 ">
            {recipe.healthinessEvaluation}
          </div>
        </div>
        
      </div>
    </div>
  );
}
