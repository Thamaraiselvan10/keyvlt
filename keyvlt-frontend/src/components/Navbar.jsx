// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="main-nav">
      <Link to="/" className="nav-logo">
        KeyVlt
      </Link>
      <div className="nav-links">
        {isAuthenticated ? (
          // If user is logged in, show a Logout button
          <button onClick={logout} className="nav-button">Logout</button>
        ) : (
          // If user is logged out, show Login and Register buttons
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/register" className="nav-button nav-button-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;