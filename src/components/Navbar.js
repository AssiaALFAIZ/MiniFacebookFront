// Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import keycloak from "../keycloak";
import '../styles/navbar.css';
import facebook from '../images/facebook.png'
import { Margin } from "@mui/icons-material";

function Navbar({ userInfo }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        // Clear localStorage when logging out
      localStorage.clear();
      await keycloak.logout();
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle error, e.g., show an error message
    }
  };
  const handleProfile = () => {
    if (userInfo) {
      navigate('/profile', userInfo); // Navigate to the profile page
    }
  };
  const handleHome = () => {
    navigate('/');
  };
  const handleHomeUser=()=>{
    navigate('/homeUser');
  }


  return (
    <nav className="navbar">
      <h1 className="titleNav"><img src={facebook} className="facebookIcon"  style={{marginLeft :'6px'}}/>MiniFacebook</h1>
      <ul className="nav-links">
      <li onClick={handleHome}>Acceuil</li>
        <li onClick={handleProfile}>Mes Informations</li>
        <li onClick={handleHomeUser}>Mes Publications</li>
        <li>
          <button onClick={handleLogout} className="post-button" style={{marginRight :'6px'}}>Déconnexion</button>
        </li>
        
      </ul>
    </nav>
  );
}

export default Navbar;
