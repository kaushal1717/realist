import { NavLink } from "react-router-dom"
import { Menu, X, User } from "lucide-react"
import { useEffect, useState } from "react"

export const Logo = () => {
    return <div className="logo">
        <img src="../URBANEST.svg" alt="logo"/>
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
            {/* {
                openDropdown && (
                    <div>
                        <DropDownMenu />
                    </div>
                )
            }     */}
        </>  
    )
}

const DropDown = () => {

    const [openDropdown, setopenDropdown] = useState(false)

    const toggleDropDown = () => {
        setopenDropdown((prev) => !prev)
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
                            <li onClick={toggleDropDown}><NavLink to="/logout" className={`text-red-600`}>Logout</NavLink></li>
                        </ul>
                    </div>
                )
            }
        </>
        
    )
}

export { Nav };