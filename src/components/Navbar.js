import { NavLink } from "react-router";
import {ReactComponent as Logo} from "../images/logo.svg"

function Navbar() {
    return (
        <nav className="border flex flex-row justify-between h-10">
         <div>
            <Logo className="w-10 h-10"/>
         </div>
            <div className="w-1/3 flex flex-row justify-evenly items-center">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "bg-gray-400" : ""
                    }
                >
                    Home
                </NavLink>

                <NavLink
                    to="/authLAyout"
                    className={({ isActive }) =>
                        isActive ? "bg-gray-400" : ""
                    }
                >
                    Login
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar
