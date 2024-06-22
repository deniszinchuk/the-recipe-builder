import React, { useState } from "react";
import { NavLink } from "react-router-dom";
function onSubmitIngredients(){

}
function onSubmitRecipe(){
  
}
export default function Recipe() {
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [myArray, setMyArray] = useState(['Apple',
      'Banana',
      'Orange',
      'Grapes',
      'Pineapple',
      'Strawberry',
      'Blueberry',
      'Mango',
      'Peach',
      'Watermelon',])
  const [selectedItem, setSelectedItem] = useState(null);
  const handleChange = (e) => {
      if(e.target.value === ""){
          setSearchTerm(e.target.value);
          setSearchResults([])
      }
      else{
          setSearchTerm(e.target.value);
          const results = myArray.filter(item =>
            item.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setSearchResults(results);
      }
  };
  const handleClick = (item) => {
      setMyArray(prevArray => prevArray.filter(i => i !== item));
      setSearchResults([]);
      setSearchTerm('');
    };
  // ------------
  
  const [ingredients, setIngredients] = useState([
    { name: '', picture: '', calories: '', protein: '', carbs: '', fat: '' }
  ]);

  const addNewIngredients = () => {
    setIngredients([...ingredients, { name: '', picture: '', calories: '', protein: '', carbs: '', fat: '' }]);
  };

  const deleteNewIngredients = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  const [recipe, setRecipe] = useState([{ name: '', picture: '', description: '', ingredients: '' }]);

  const addNewRecipe = () => {
    setRecipe([...recipe, { name: '', picture: '', description: '', ingredients: '' }]);
  };

  const deleteNewRecipe = (index) => {
    const updatedRecipe = [...recipe];
    updatedRecipe.splice(index, 1);
    setRecipe(updatedRecipe);
  };

  const handleIngredientChange = (index, event) => {
    const { name, value } = event.target;
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][name] = value;
    setIngredients(updatedIngredients);
  };

  const handleRecipeChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRecipe = [...recipe];
    updatedRecipe[index][name] = value;
    setRecipe(updatedRecipe);
  };

  return (
    <div id="wrapper" className="bg-[#2F3C7E] relative h-screen-vh text-[#FBEAEB] pt-3">
      <nav>
        <NavLink to="/inventory" className="p-2 border rounded-[1rem] top-1 absolute left-2">
          Return
        </NavLink>
      </nav>
      <h1 className="text-[2rem] text-center mb-[20px]">Create Ingredients</h1>
      <div className="overflow-x-auto text-black flex items-center justify-center">
        <form onSubmit={onSubmitIngredients}>
          <table className="min-w-[90%] bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Name</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Picture</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Calories</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Protein</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Carbs</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Fat</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-50"}>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <input
                      type="text"
                      name="name"
                      value={row.name}
                      onChange={(event) => handleIngredientChange(index, event)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <input
                      type="file"
                      name="picture"
                      value={row.picture}
                      onChange={(event) => handleIngredientChange(index, event)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <input
                      type="text"
                      name="calories"
                      value={row.calories}
                      onChange={(event) => handleIngredientChange(index, event)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <input
                      type="text"
                      name="protein"
                      value={row.protein}
                      onChange={(event) => handleIngredientChange(index, event)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <input
                      type="text"
                      name="carbs"
                      value={row.carbs}
                      onChange={(event) => handleIngredientChange(index, event)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <input
                      type="text"
                      name="fat"
                      value={row.fat}
                      onChange={(event) => handleIngredientChange(index, event)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button onClick={() => deleteNewIngredients(index)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </div>
      <div className="flex justify-center items-center text-[1.5rem]">
        <button onClick={addNewIngredients} className="mt-4 bg-blue-500 w-[300px] text-white py-2 px-4 rounded hover:bg-blue-700">Add New Entry</button>
      </div>
      <div className="flex justify-center items-center text-[1.5rem]">
        <button className="mt-4 bg-green-500 w-[300px] text-white py-2 px-4 rounded hover:bg-blue-700">Update</button>
      </div>
      <h1 className="text-[2rem] text-center mt-[20px] mb-[20px]">Create Recipe</h1>
        <div className="overflow-x-auto text-black flex items-center justify-center">
          <form onSubmit={onSubmitRecipe}>
            <table className="min-w-[90%] bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Name</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Picture</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Description</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Ingredients</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipe.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-50"}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <input
                        type="text"
                        name="name"
                        value={row.name}
                        onChange={(event) => handleRecipeChange(index, event)}
                        className="w-full"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <input
                        type="file"
                        name="picture"
                        value={row.picture}
                        onChange={(event) => handleRecipeChange(index, event)}
                        className="w-full"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <input
                        type="text"
                        name="description"
                        value={row.description}
                        onChange={(event) => handleRecipeChange(index, event)}
                        className="w-full"
                      />
                    </td>
                    <td className="relative w-[300px]">
                      <input className="absolute top-1/2 transform -translate-y-1/2 focus:outline-none w-full" placeholder="Search Ingredients..." value={searchTerm} onInput={handleChange}/>
                      <div className="absolute w-full top-[36px]">
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button onClick={() => deleteNewRecipe(index)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        </div>
        <div className="flex justify-center items-center text-[1.5rem]"><button onClick={addNewRecipe} className="mt-4 bg-blue-500 w-[300px] text-white py-2 px-4 rounded hover:bg-blue-700">Add New Entry</button></div>
        <div className="flex justify-center items-center text-[1.5rem]"><button className="mt-4 bg-green-500 w-[300px] text-white py-2 px-4 rounded hover:bg-blue-700">Update</button></div>
          
      </div>
    )
    
}