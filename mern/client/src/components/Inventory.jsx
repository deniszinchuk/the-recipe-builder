import { useState } from "react";
import { NavLink } from "react-router-dom";
export default function Inventory(){
    const myArray = [
        'Apple',
        'Banana',
        'Orange',
        'Grapes',
        'Pineapple',
        'Strawberry',
        'Blueberry',
        'Mango',
        'Peach',
        'Watermelon',
    ];
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
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
        setSelectedItem(item);
        setMyInventory(prevInventory => {
            const newInventory = [...prevInventory, item];
            return newInventory;
        });
        setSearchResults(prevResults => prevResults.filter(result => result !== item));
    };
    return(
        <div id="wrapper" className="bg-[#2F3C7E] h-screen-vh text-[#FBEAEB] ">
            <nav className="p-[10px] pl-[5px]">
                <NavLink to="/home" className=" border p-1.5 pl-2.5 pr-2.5 rounded-[1rem]">
                    Return
                </NavLink>
            </nav>
            <h1 className="text-[2rem] text-center mb-[20px]">Inventory</h1>
            <div className="h-[60%] border rounded-[2rem] mr-[30px] ml-[30px] pl-[15px] pt-[5px] overflow-hidden">
                <ul className="overflow-auto h-full hide-scrollbar">
                  {myInventory.map((item, index) => (
                    <li key={index} className="text-[1.5rem]">{item}</li>
                  ))}
                </ul>
            </div>
            <div className="flex justify-center items-center flex-col">
                <input className="mt-[10px] p-1 pr-2.5 pl-2.5 bg-white text-black border focus:outline-none w-[50%]" placeholder="Search Ingredients..." value={searchTerm} onInput={handleChange}/>
                <div className="p-1 pr-2.5 pl-2.5 bg-white text-black border w-[50%] max-h-[105px] overflow-scroll overflow-x-hidden">
                  <ul>
                    {searchResults.map((item, index) => (
                      <li onClick={() => handleClick(item)} className="hover:bg-gray-300 cursor-pointer" key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
            </div>
            
        </div>
    )
    
}