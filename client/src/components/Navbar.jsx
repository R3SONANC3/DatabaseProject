import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authMiddleware';
import { Menu, X, Database } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Database className="h-8 w-8 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-2xl font-bold">
              Database Project
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
            {isAuthenticated() && (
              <>
                <NavLink to="/dashboard" active={location.pathname === '/dashboard'}>Dashboard</NavLink>
                <NavLink to="/search" active={location.pathname === '/search'}>Search</NavLink>
              </>
            )}
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4 ml-4">
                <NavLink to="/profile" active={location.pathname === '/profile'}>Profile</NavLink>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Toggle menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink to="/" active={location.pathname === '/'} onClick={() => setIsMenuOpen(false)}>
              Home
            </MobileNavLink>
            {isAuthenticated() && (
              <>
                <MobileNavLink to="/dashboard" active={location.pathname === '/dashboard'} onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/search" active={location.pathname === '/search'} onClick={() => setIsMenuOpen(false)}>
                  Search
                </MobileNavLink>
              </>
            )}
            {isAuthenticated() ? (
              <>
                <MobileNavLink to="/profile" active={location.pathname === '/profile'} onClick={() => setIsMenuOpen(false)}>
                  Profile
                </MobileNavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block w-full px-3 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? 'text-blue-600 bg-blue-50'
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, active, onClick }) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
      active
        ? 'text-blue-600 bg-blue-50'
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;