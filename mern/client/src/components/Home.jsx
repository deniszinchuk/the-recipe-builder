import { NavLink } from "react-router-dom";
export default function Home(){
    return(
        <div id="wrapper" className="h-screen-vh">
            <NavLink to="/inventory" className="text-[#FBEAEB] fixed right-[5px] top-[5px] border p-1.5 rounded-[1rem] z-2">
                Inventory
            </NavLink>
            <div className="relative top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-[40%] text-[#FBEAEB] border w-[60%] h-[30%] rounded-[2rem]">
                <span className="absolute top-[45%] left-1/2 transform -translate-y-[45%] -translate-x-1/2 text-[3rem]">+</span>
            </div>
        </div>
    );
}
