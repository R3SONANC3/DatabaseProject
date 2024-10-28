import React, { useState } from 'react';
import { X, User, Lock, Mail, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isLogin ? handleLogin() : handleReg();
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', {
        email: email,
        password: password,
      });
  
      if (response.status === 200) {
        // Store both token and user data
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message,
          confirmButtonText: 'OK',
        });
        
        navigate('/profile');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again later.';
      
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
        confirmButtonText: 'Try again',
      });
    }
  };
  
  const handleReg = async () => {
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please try again.',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    try {
      const response = await axios.post('/api/auth/register', {
        email: email,
        password: password,
        name: name,
      });
  
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message,
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            setIsLogin(true);
            resetForm();
          }
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred during registration.';
      
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMessage,
        confirmButtonText: 'Try again',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  {isLogin ? 'Welcome back!' : 'Create an account'}
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    onClick={toggleForm}
                    className="font-medium text-indigo-600 hover:text-indigo-500 ml-1 focus:outline-none transition duration-150 ease-in-out"
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-5">
                  {!isLogin && (
                    <div className="relative">
                      <label htmlFor="name" className="sr-only">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="block w-full px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="relative">
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  <div className="relative">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  {!isLogin && (
                    <div className="relative">
                      <label htmlFor="confirm-password" className="sr-only">
                        Confirm Password
                      </label>
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="block w-full px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                    </span>
                    {isLogin ? 'Sign in' : 'Sign up'}
                    <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;