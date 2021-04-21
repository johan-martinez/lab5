import React from 'react';
import {Link} from "react-router-dom"

function Navbar() {
    

    return(
        <ul className="nav navbar-dark bg-dark px-2">
                <li className="nav-item px-2 py-2">
                    <Link to="/" className="navbar-brand font-weight-bold">
                        HOME
                    </Link>
                </li>
                
            </ul>
    )
}

export default Navbar