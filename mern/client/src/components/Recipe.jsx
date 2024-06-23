import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Recipe() {
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Fetch all ingredients for search
  useEffect(() => {
    const fetchIngredients = async () => {
      const response = await fetch('http://localhost:5050/ingredient/');
      const data = await response.json();
      setIngredientsList(data);
    };
    fetchIngredients();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === "") {
      setSearchResults([]);
    } else {
      const results = ingredientsList.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredients(prev => [...prev, { ...ingredient, amount: '' }]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleIngredientAmountChange = (index, e) => {
    const updatedIngredients = [...selectedIngredients];
    updatedIngredients[index].amount = e.target.value;
    setSelectedIngredients(updatedIngredients);
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...selectedIngredients];
    updatedIngredients.splice(index, 1);
    setSelectedIngredients(updatedIngredients);
  };

  // State for recipe
  const [recipe, setRecipe] = useState({ name: '', picture: null, description: '' });

  const handleRecipeChange = (e) => {
    const { name, value, files } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const onSubmitRecipe = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', recipe.name);
    formData.append('picture', recipe.picture);
    formData.append('description', recipe.description);
    formData.append('ingredients', JSON.stringify(selectedIngredients.map(ingredient => ({
      ingredientId: ingredient._id,
      amount: ingredient.amount
    }))));

    // Log FormData content for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await fetch('http://localhost:5050/recipe/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // Handle successful response
      } else {
        console.error("Error uploading the recipe");
        // Handle server errors
      }
    } catch (error) {
      console.error("There was an error uploading the recipe!", error);
      // Handle network errors
    }
  };

  return (
    <div id="wrapper" className="bg-[#2F3C7E] relative h-screen-vh text-[#FBEAEB] pt-3">
      <nav>
        <NavLink to="/inventory" className="p-2 border rounded-[1rem] top-1 absolute left-2">
          Return
        </NavLink>
      </nav>
      <h1 className="text-[2rem] text-center mb-[20px]">Create Recipe</h1>
      <div className="text-black flex items-center justify-center">
        <form onSubmit={onSubmitRecipe}>
          <table className="min-w-[90%] bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Name</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Picture</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Description</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Ingredients</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Ingredients List</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b border-gray-200">
                  <input
                    type="text"
                    name="name"
                    value={recipe.name}
                    onChange={handleRecipeChange}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <input
                    type="file"
                    name="picture"
                    onChange={handleRecipeChange}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <input
                    type="text"
                    name="description"
                    value={recipe.description}
                    onChange={handleRecipeChange}
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search Ingredients..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full"
                  />
                  <ul>
                    {searchResults.map((item, index) => (
                      <li key={index} onClick={() => handleIngredientSelect(item)} className="cursor-pointer hover:bg-gray-200">
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {selectedIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between mb-2">
                      <span>{ingredient.name}</span>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={ingredient.amount}
                        onChange={(e) => handleIngredientAmountChange(index, e)}
                        className="w-20"
                      />
                      <button type="button" onClick={() => handleRemoveIngredient(index)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">
                        Remove
                      </button>
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Save Recipe</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}
