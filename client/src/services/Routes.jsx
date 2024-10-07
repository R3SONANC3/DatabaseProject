import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../App.jsx'; // Main App/Home component
import NotFound from '../components/NotFound.jsx'; // Not Found component
import Login from '../components/Login.jsx'; // Login component

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
    path: '*',
    element: <NotFound />, // Catch-all for 404
  },
]);

function Routes() {
  return <RouterProvider router={router} />;
}

export default Routes;
