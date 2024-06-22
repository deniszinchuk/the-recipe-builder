import Navbar from "./Navbar";
import { NavLink } from "react-router-dom";
export default function Home(){
    return(
        <div id="wrapper">
            <NavLink to="/backend">To backend</NavLink>
            <h1 class="chlen">Hello, World</h1>
            <div className="p-6">
                <Navbar/>
            </div>
        </div>
        
    );
}
