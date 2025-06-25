// src/components/Navbar.js
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">DoseRight</div>

      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/schedule" className={({ isActive }) => (isActive ? "active" : "")}>
            Schedule Medicine
          </NavLink>
        </li>
        <li>
          <NavLink to="/mymedicines" className={({ isActive }) => (isActive ? "active" : "")}>
            My Medicines
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
            Settings
          </NavLink>
        </li>
        <li>
          <NavLink to="/help" className={({ isActive }) => (isActive ? "active" : "")}>
            Help
          </NavLink>
        </li>
      </ul>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
