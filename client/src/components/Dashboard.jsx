import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  Search,
  Edit2,
  Trash2,
  XCircle,
  CheckCircle,
  Home,
  UserPlus,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/user/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8000/api/user/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
          <li>
              <a href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
                <Users className="h-5 w-5" />
                <span>Users</span>
              </a>
            </li>
            <li>
              <a href="/" className="flex items-center space-x-3 p-3 rounded-lg bg-indigo-50 text-indigo-600">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-50 text-red-600">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your system users and their permissions
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Search and Actions Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors">
                <UserPlus className="h-4 w-4" />
                Add New User
              </button>
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-sm">📧</span>
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-sm">🔑</span>
                      <span className="text-sm">{user.role || 'User'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Status:</span>
                      {user.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="w-4 h-4 mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="pt-4 flex justify-end space-x-2">
                      <button className="p-2 text-blue-600 hover:text-blue-700 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:text-red-700 rounded-lg border border-gray-200 hover:bg-gray-50"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "No users match your search criteria." : "Get started by creating a new user."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}