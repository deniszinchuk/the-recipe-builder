import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [myInventory, setMyInventory] = useState([]);

  // Fetch ingredients from the backend
  useEffect(() => {
    async function fetchIngredients() {
      try {
        const response = await fetch('http://localhost:5050/ingredient/');
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          console.error(message);
          return;
        }
        const ingredients = await response.json();
        setIngredients(ingredients);
      } catch (error) {
        console.error('Failed to fetch ingredients:', error);
      }
    }
    fetchIngredients();
  }, []);

  // Handle search input change
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setSearchResults([]);
    } else {
      const results = ingredients.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  // Handle item click from search results
  const handleClick = (item) => {
    setIngredients(prevArray => prevArray.filter(i => i._id !== item._id));
    setMyInventory(prevInventory => [...prevInventory, { ...item, count: 1 }]);
    setSearchResults([]);
    setSearchTerm('');
  };

  // Handle removing item from inventory
  const handleRemove = (item) => {
    setMyInventory(prevInventory => prevInventory.filter(i => i._id !== item._id));
    setIngredients(prevArray => [...prevArray, item]);
  };

  // Handle incrementing item count
  const handleIncrement = (item) => {
    setMyInventory(prevInventory =>
      prevInventory.map(i => i._id === item._id ? { ...i, count: i.count + 1 } : i)
    );
  };

  // Handle decrementing item count
  const handleDecrement = (item) => {
    setMyInventory(prevInventory =>
      prevInventory.map(i => i._id === item._id ? { ...i, count: i.count > 1 ? i.count - 1 : 1 } : i)
    );
  };

  return (
    <div id="wrapper" className="bg-[#2F3C7E] h-screen-vh text-[#FBEAEB]">
      <nav>
        <NavLink to="/create-recipe" className="p-2 border rounded-[1rem] top-1 absolute left-2">
          Create Recipe
        </NavLink>
        <h1 className="text-[2rem] text-center mb-[20px]">Inventory</h1>
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
            <div className="w-[150px] m-h-[150px] text-[1.25rem] bg-transparent rounded-[1rem] border pt-2" key={item._id}>
              <div className="flex justify-center items-center">
                <img className="h-[75px] w-[75px]" src={`http://localhost:5050${item.picture}`} alt={item.name}></img>
              </div>
              <div className="flex justify-center items-center flex-col">
                <p>{item.name}</p>
              </div>
              <div className="flex justify-center gap-[0.5rem] items-center pb-2">
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
                <button
                  className="text-white w-10 p-1 rounded bg-red-500 hover:bg-red-700"
                  onClick={() => handleRemove(item)}
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
