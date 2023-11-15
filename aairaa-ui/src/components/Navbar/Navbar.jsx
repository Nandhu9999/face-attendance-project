import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import "./Navbar.scss";
import { Box, Typography } from "@mui/material";
import NavLogo from "../../assets/logo1.png";
const Navbar = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear("token")
        localStorage.clear("user")
        navigate("/")
    }

    return (
        <div className="navbar">
            <div className="navbar-logo-title">
                    <Box component="img"
                        sx={{height:"2.4rem"}}
                        alt='aairaa log'
                        src={NavLogo}
                    />
                <Typography variant="h3" sx={{ml:3}}>AAIRAA</Typography>
            </div>
            <div className="navbar-links">
                {/* <div className="navbar-link">
                    <Link to="/about" className="link">
                        About
                    </Link>
                </div> */}
                <div className="navbar-link">
                </div>
                {/* <div className="navbar-link">
                    <Link to="/members" className="link">
                        Members
                    </Link>
                </div> */}
                <div className="navbar-link">
                    <span className="link" onClick={handleLogout}>
                        <ExitToAppIcon className="icon" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
