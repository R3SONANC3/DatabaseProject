import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authMiddleware';

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
    <nav className="bg-gray-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">Database Project</h1>
          </Link>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" active={location.pathname === '/'}>Home</NavLink>
              {isAuthenticated() && (
                <NavLink to="/dashboard" active={location.pathname === '/dashboard'}>Dashboard</NavLink>
              )}
              {isAuthenticated() ? (
                <>
                  <NavLink to="/profile" active={location.pathname === '/profile'}>Profile</NavLink>
                  <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" active={location.pathname === '/login'}>Login</NavLink>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/" active={location.pathname === '/'} onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
            {isAuthenticated() && (
              <MobileNavLink to="/dashboard" active={location.pathname === '/dashboard'} onClick={() => setIsMenuOpen(false)}>Dashboard</MobileNavLink>
            )}
            {isAuthenticated() ? (
              <>
                <MobileNavLink to="/profile" active={location.pathname === '/profile'} onClick={() => setIsMenuOpen(false)}>Profile</MobileNavLink>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50">
                  Logout
                </button>
              </>
            ) : (
              <MobileNavLink to="/login" active={location.pathname === '/login'} onClick={() => setIsMenuOpen(false)}>Login</MobileNavLink>
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
    className={`${
      active
        ? 'text-blue-600 border-b-2 border-blue-600'
        : 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600'
    } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, active, onClick }) => (
  <Link
    to={to}
    className={`${
      active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
    } block px-3 py-2 rounded-md text-base font-medium`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;
