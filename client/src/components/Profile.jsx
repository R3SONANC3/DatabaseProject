import React from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';
import { User, Mail, Calendar, MapPin, Edit2 } from 'lucide-react';

const Profile = () => {
  const token = sessionStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {user ? (
            <div className="md:flex">
              <div className="md:flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white">
                <div className="text-center">
                  <img className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-white shadow-inner" src="/api/placeholder/200/200" alt="Profile" />
                  <h1 className="text-3xl font-bold">{user.name || 'User Name'}</h1>
                  <p className="mt-2 text-blue-200">{user.role || 'Member'}</p>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3" />
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3" />
                    <p className="text-sm">Joined: {new Date(user.iat * 1000).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3" />
                    <p className="text-sm">{user.location || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12 md:flex-grow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Bio</label>
                    <p className="mt-1 text-gray-800">{user.bio || 'No bio available. Add one to tell others about yourself!'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Interests</label>
                    <p className="mt-1 text-gray-800">{user.interests || 'No interests specified.'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Skills</label>
                    <p className="mt-1 text-gray-800">{user.skills || 'No skills listed.'}</p>
                  </div>
                </div>
                <div className="mt-10">
                  <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                    <Edit2 className="h-5 w-5 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <User className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Please log in to view your profile</h2>
              <p className="text-gray-600 mb-8">Access your personalized dashboard and manage your account.</p>
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                Log In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;