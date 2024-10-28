import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../components/Home.jsx';
import NotFound from '../components/NotFound.jsx';
import Login from '../components/Login.jsx';
import Profile from '../components/Profile.jsx';
import EmailSearch from '../components/EmailSearch.jsx'

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
    path: '/profile',
    element: <Profile />
  },
  {
    path: '*',
    element: <NotFound />, // Catch-all for 404
  },
  {
    path: '/search',
    element: <EmailSearch />
  },
]);

function Routes() {
  return <RouterProvider router={router} />;
}

export default Routes;
