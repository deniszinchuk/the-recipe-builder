import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function onSubmitRecipe(){

}
export default function Recipe() {
  // Search functionality
  const [equal, setEqual] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [myInventory, setMyInventory] = useState([]);
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
  const handleChange = (e) => {
    let value = e.target.value;
    if(value === ""){
        setSearchTerm(value);
        setSearchResults([])
    }
    else{
        setSearchTerm(value);
        const results = myArray.filter(item =>
          item.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(results);
    }
  };
  const handleClick = (item) => {
      setMyArray(prevArray => prevArray.filter(i => i !== item));
      setSearchResults([]);
      setSearchTerm("");
      setMyInventory(prevInventory => [...prevInventory, item]);
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

  const deleteNewRecipe = (index) => {

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

const onSubmitIngredients = async (e) => {
    e.preventDefault();
    console.log("Submitting ingredients");

    // Create a FormData object to handle file uploads
    const formData = new FormData();

    ingredients.forEach((ingredient) => {
      formData.append('name', ingredient.name);
      formData.append('picture', ingredient.picture);
      formData.append('calories', ingredient.calories);
      formData.append('protein', ingredient.protein);
      formData.append('carbs', ingredient.carbs);
      formData.append('fat', ingredient.fat);
    });

    try {
      const response = await fetch('http://localhost:5050/ingredient/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // Handle successful response
      } else {
        console.error("Error uploading the ingredients");
        // Handle server errors
      }
    } catch (error) {
      console.error("There was an error uploading the ingredients!", error);
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
      <h1 className="text-[2rem] text-center mb-[20px]">Create Ingredients</h1>
      <div className="text-black flex items-center justify-center">
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
        <button onClick={onSubmitIngredients} className="mt-4 bg-green-500 w-[300px] text-white py-2 px-4 rounded hover:bg-blue-700">Update</button>
      </div>
      <h1 className="text-[2rem] text-center mt-[20px] mb-[20px]">Create Recipe</h1>
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
                  <td className="relative w-[150px]">
                    <input id={index} className="absolute top-1/2 transform -translate-y-1/2 focus:outline-none w-full" placeholder="Search Ingredients..." value={searchTerm} onInput={handleChange}/>
                    <div className="absolute w-full top-[70px]">
                    {searchResults.length > 0 && (
                      <ul>
                        <li onClick={() => handleClick(searchResults[0])} className="bg-white cursor-pointer hover:bg-blue-100">
                          {searchResults[0]}
                        </li>
                      </ul>
                    )}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <div className="w-full resize-none p-1 text-[1rem h-[100px] overflow-auto">
                      <ul className="overflow-auto h-full hide-scrollbar">
                        {myInventory.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <div onClick={() => {
                      setMyInventory([]);
                    }} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 hover:cursor-pointer">
                      Delete
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </div>
      <div className="flex justify-center items-center text-[1.5rem]"><button className="mt-4 bg-green-500 w-[300px] text-white py-2 px-4 rounded hover:bg-blue-700">Update</button></div>
    </div>
  )
}