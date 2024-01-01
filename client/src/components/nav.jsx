import { NavLink, useNavigate } from "react-router-dom"
import { Menu, X, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "../context/auth"

export const Logo = () => {
    return <div className="logo">
        <img src="/URBANEST.svg" alt="logo"/>
    </div>
}

const Nav = () => {
    const [isOpen, setisOpen] = useState(false)

    const toggleNavbar = () => {
        setisOpen(!isOpen)
    } 
    
    const Navlinks = () => {
        return (
            <>
                <NavLink to = "/" className={`nav-item`}> Home </NavLink>
                <NavLink to ="/login" className={`nav-item`}> Login </NavLink>
                <NavLink to ="/register" className={`nav-item`}> Register </NavLink>
            </>
        )
    }
    

    return (
        <>
            <nav className="flex w-1/3 justify-end">
                <div className="hidden w-full justify-between md:flex align-bottom">
                    <Navlinks />
                    <DropDown />
                </div>
                <div className="flex md:hidden flex-row-reverse justify-evenly w-40">
                    <button onClick={toggleNavbar}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                    <DropDown />
                </div>
            </nav>
            {
                isOpen && (
                    <div className="mobile-nav">
                        <Navlinks />
                    </div>
                )
            }
        </>   
    )
}

const DropDown = () => {

    const [openDropdown, setopenDropdown] = useState(false)

    //context
    const {auth, setAuth} = useAuth();

    //navigation
    const navigate = useNavigate()

    const toggleDropDown = () => {
        setopenDropdown((prev) => !prev)
    }

    const LogOut = () => {
        setAuth({user: null, token: "", refreshToken: ""});
        localStorage.removeItem("auth");
        navigate('/login');
        
    }

    return(
        <>
            <div className="flex dropdown-container flex-col" onClick={toggleDropDown}>
                <User color="#1e3a8a" size={30} className="user-logo"/>
            </div>
            {
                openDropdown && (
                    <div className="dropdownmenu flex flex-col">
                        <ul className="flex flex-col gap-4">
                            <li onClick={toggleDropDown}> <NavLink to="/profile">Profile</NavLink> </li>
                            <li onClick={toggleDropDown}><div onClick={LogOut} className={`text-red-600 hover:cursor-pointer`}>Logout</div></li>
                        </ul>
                    </div>
                )
            }
        </>
        
    )
}

export { Nav };