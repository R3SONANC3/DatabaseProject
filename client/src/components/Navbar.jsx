import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles.css';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-link">
          <h1 className="nav-text">CompetencyDatabase</h1>
        </Link>

        {/* Accessible Menu Toggle Button */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          {isMenuOpen ? 'Close' : 'Menu'} {/* You can replace this text with a menu icon if needed */}
        </button>

        {/* Navigation Links */}
        <ul className={`nav-list ${isMenuOpen ? 'show' : ''}`}>
          <li>
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
