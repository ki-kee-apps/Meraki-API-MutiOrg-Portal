import React from "react";
import { Link } from "react-router-dom";

import './Header.css';

const Header = (props) => {
    return(
        <div className='header'>
            <Link className="logo" to="/home/">MERAKI MULTI-ORG PORTAL</Link>
            <div className="header-right">
                <Link className="header-home" to="/home/">Home</Link>
                <Link
                    className="header-logout"
                    to="/"
                    onClick={() => localStorage.clear()}
                >Logout</Link>
            </div>
        </div>
    );
};

export default Header;