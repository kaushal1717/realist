import React, { useState } from 'react'
import '../index.css'
import { Logo, Nav } from './nav'

function Header() {
    
    const [openDropDown, setopenDropdown] = useState(false);

    return (
        <header className='header-container'>
            <Logo />
            <Nav />
        </header>
    )
}

export default Header
