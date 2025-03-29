// src/components/Navbar.js
import React from "react";
import "./Navbar.css"; // Importamos el CSS

const Navbar = ({ modo, setModo }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo192.png" alt="logo" className="logo-img" />
        <span className="name">FakeNewsApp</span>
      </div>
      <div className="navbar-buttons">
        <button onClick={() => setModo("predecir")}>Predecir</button>
        <button onClick={() => setModo("reentrenar")}>Reentrenar</button>
      </div>
    </nav>
  );
};

export default Navbar;
