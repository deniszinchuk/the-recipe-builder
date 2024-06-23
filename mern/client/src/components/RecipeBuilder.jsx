import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function RecipeBuilder(){
    const location = useLocation();
    const { myInventory } = location.state || { myInventory: [] };
    console.log(myInventory);
    return (
      <div id="wrapper" className="bg-[#2F3C7E] h-screen-vh text-[#FBEAEB]">
        <nav>
          <NavLink to="/inventory" className="p-2 border rounded-[1rem] top-1 absolute left-2">
            Inventory
          </NavLink>
          <h1 className="text-[2rem] text-center mb-[20px] pt-[20px]">Recipe Builder</h1>
        </nav>
        <div className="h-[80%] mt-[20px] hide-scrollbar border rounded-[2rem] mr-[30px] ml-[30px] pl-[15px] pt-[15px] overflow-auto">
          <div className="flex gap-[1rem] w-full flex-wrap">
            {myInventory.map((item, index) => (
              <div key={index} className="w-[150px] m-h-[150px] text-[1.25rem] bg-transparent rounded-[1rem] border pt-2">
                <div className="flex justify-center items-center">
                  <img className="h-[75px] w-[75px]" src="images/Smiley.png" alt="item"></img>
                </div>
                <div className="flex justify-center items-center flex-col">
                  <p>{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}