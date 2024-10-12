import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const toggleForm = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      const url = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/register`;
      const response = await axios.post(url, { email, password });
      setMessage(response.data.message);

      if (isLogin && response.data.token) {
        sessionStorage.setItem('token', response.data.token);
        setMessage('Login successful!');
      } else if (!isLogin) {
        setMessage('Registration successful! You can now log in.');
        toggleForm();
      }
    } catch (error) {
      setMessage(
        `${isLogin ? 'Login' : 'Registration'} failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full max-w-sm mx-auto mt-24 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-center mb-8 text-2xl font-semibold text-gray-800">
          {isLogin ? 'Login' : 'Register'}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">
              Email:
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">
              Password:
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                Confirm Password:
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300 ease-in-out"
            type="submit"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            className="text-blue-600 font-semibold hover:underline focus:outline-none"
            onClick={toggleForm}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </>
  );
}

export default Login;