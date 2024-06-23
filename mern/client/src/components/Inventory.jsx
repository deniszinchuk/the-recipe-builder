import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [myInventory, setMyInventory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIngredients = async () => {
      const response = await fetch('http://localhost:5050/ingredient/');
      const data = await response.json();
      setIngredientsList(data);
    };
    fetchIngredients();
  }, []);

  const handleChange = (e) => {
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

  const handleClick = (item) => {
    setIngredientsList(prevArray => prevArray.filter(i => i !== item));
    setMyInventory(prevInventory => [...prevInventory, { ...item, count: 1 }]);
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleIncrement = (item) => {
    setMyInventory(prevInventory =>
      prevInventory.map(i => i._id === item._id ? { ...i, count: i.count + 1 } : i)
    );
  };

  const handleDecrement = (item) => {
    setMyInventory(prevInventory =>
      prevInventory.map(i => i._id === item._id ? { ...i, count: i.count > 1 ? i.count - 1 : 1 } : i)
    );
  };

  const generateRecipes = () => {
    navigate('/recipe-list', { state: { myInventory } });
  };
  const handleDelete = (itemToDelete) => {
    setMyInventory(prevInventory =>
      prevInventory.filter(item => item._id !== itemToDelete._id)
    );
  };
  return (
    <div id="wrapper" className="h-screen-vh text-[#FBEAEB] pt-[20px]">
      <nav>
        <NavLink to="/create-recipe" className="p-2 border rounded-[1rem] top-[15px] absolute left-2">
          Create Recipe
        </NavLink>
        <h1 className="text-[2rem] text-center mb-[10px]">Choose your ingredients</h1>
      </nav>
      <div className="flex justify-center items-center flex-col relative">
        <input
          className="mt-[10px] p-1 pr-2.5 pl-2.5 bg-white text-black border focus:outline-none w-[50%]"
          placeholder="Search Ingredients..."
          value={searchTerm}
          onInput={handleChange}
        />
        <div className="p-1 pr-2.5 pl-2.5 bg-white absolute top-[44px] text-black border w-[50%] max-h-[105px] overflow-scroll overflow-x-hidden">
          <ul>
            {searchResults.map((item, index) => (
              <li
                onClick={() => handleClick(item)}
                className="hover:bg-gray-300 cursor-pointer"
                key={index}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="h-[60%] mt-[20px] hide-scrollbar border rounded-[2rem] mr-[30px] ml-[30px] pl-[15px] pt-[15px] overflow-auto">
        <div className="flex gap-[1rem] w-full flex-wrap">
          {myInventory.map((item, index) => (
            <div key={index} className="w-[200px] m-h-[150px] text-[1.25rem] bg-transparent rounded-[1rem] border pt-2">
              <div className="flex justify-center items-center">
                <img className="h-[100px] w-[100px] rounded" src={`http://localhost:5050${item.picture}`} alt={item.name} />
              </div>
              <div className="flex justify-center items-center flex-col">
                <p>{item.name}</p>
              </div>
              <div className="flex justify-center gap-[0.5rem] items-center">
                <button
                  className="text-white w-10 p-1 rounded "
                  onClick={() => handleIncrement(item)}
                >
                  +
                </button>
                <p>{item.count}</p>
                <button
                  className="text-white w-10 p-1 rounded"
                  onClick={() => handleDecrement(item)}
                >
                  -
                </button>
              </div>
              <div className="pb-2 flex justify-center">
                <button
                  className="text-white w-[80%] rounded bg-red-500"
                  onClick={() => handleDelete(item)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center text-[1.5rem] mt-4">
        <button
          onClick={generateRecipes}
          className="bg-blue-500 w-[300px] text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Generate Recipes
        </button>
      </div>
    </div>
  );
}
