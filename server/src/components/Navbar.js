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
                <li  className="nav-item">
                    <Link to="/dashboard" className="nav-link active">DASHBOARD</Link>
                </li>
                <li className="nav-item">
                    <Link to="/logs" className="nav-link active">LOGS</Link>
                </li>
                
            </ul>
    )
}

export default Navbar