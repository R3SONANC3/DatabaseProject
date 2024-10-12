import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../components/Home.jsx'; // Main App/Home component
import NotFound from '../components/NotFound.jsx'; // Not Found component
import Login from '../components/Login.jsx'; // Login component
import Dashboard from '../components/Dashboard.jsx';
import Profile from '../components/Profile.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />, // Home page
  },
  {
    path: '/login',
    element: <Login />, // Separate Login route
  },
  {
    path: '/dashboard',
    element: <Dashboard />, // Separate Dashboard route
  }, {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '*',
    element: <NotFound />, // Catch-all for 404
  },
]);

function Routes() {
  return <RouterProvider router={router} />;
}

export default Routes;
