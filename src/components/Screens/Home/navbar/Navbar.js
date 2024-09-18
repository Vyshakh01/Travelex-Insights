// Navbar.js
import React from "react";
import "./Navbar.css";

import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">TravelEx Insights</h1>
      </div>
      <div className="navbar-center">
        <ul className="nav-links"></ul>
      </div>
      <div className="navbar-right">
        {/* User image and other functionalities can be added here */}
      </div>
    </nav>
  );
}

export default Navbar;
