import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css"; // Importing the updated CSS file

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const authLinks = (
    <ul className="navbar-links">
      <li>
        <Link to="/dashboard" className="navbar-link">
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/upload" className="navbar-link">
          Upload
        </Link>
      </li>
      <li>
        <a href="#!" className="navbar-link navbar-btn" onClick={handleLogout}>
          Logout
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="navbar-links">
      <li>
        <Link to="/register" className="navbar-link navbar-btn primary-btn">
          Sign Up
        </Link>
      </li>
      <li>
        <Link to="/login" className="navbar-link navbar-btn">
          Login
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {isAuthenticated ? authLinks : guestLinks}
      </div>
    </nav>
  );
};

export default Navbar;
