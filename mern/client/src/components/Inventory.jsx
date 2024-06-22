import { useState } from "react";
import { NavLink } from "react-router-dom";
export default function Inventory(){
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
    const [myInventory, setMyInventory] = useState([]);
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
        setMyInventory(prevInventory => [...prevInventory, item]);
        setSearchResults([]);
        setSearchTerm('');
    };
    return(
        <div id="wrapper" className="bg-[#2F3C7E] h-screen-vh text-[#FBEAEB] ">
            <nav>
                <NavLink to="/create-recipe" className="p-2 border rounded-[1rem] top-1 absolute left-2">
                    Create Recipe
                </NavLink>
                <h1 className="text-[2rem] text-center mb-[20px]">Inventory</h1>
            </nav>
            <div className="flex justify-center items-center flex-col relative">
                <input className="mt-[10px] p-1 pr-2.5 pl-2.5 bg-white text-black border focus:outline-none w-[50%]" placeholder="Search Ingredients..." value={searchTerm} onInput={handleChange}/>
                <div className="p-1 pr-2.5 pl-2.5 bg-white absolute top-[44px] text-black border w-[50%] max-h-[105px] overflow-scroll overflow-x-hidden">
                  <ul>
                    {searchResults.map((item, index) => (
                      <li onClick={() => handleClick(item)} className="hover:bg-gray-300 cursor-pointer" key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
            </div>
            <div className="h-[60%] mt-[20px] border rounded-[2rem] mr-[30px] ml-[30px] pl-[15px] pt-[5px] overflow-hidden">
                <ul className="overflow-auto h-full hide-scrollbar">
                  {myInventory.map((item, index) => (
                    <li key={index} className="text-[1.5rem]">{item}</li>
                  ))}
                </ul>
            </div>
            
        </div>
    )
    
}