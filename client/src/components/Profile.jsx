import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Mail, Inbox, Send, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import axios from 'axios';
import Navbar from './Navbar';
import EmailCategoryForm from './EmailCategoryForm';

const COLORS = ['#6366f1', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b'];

const TIME_FILTERS = [
  { label: 'Last Month', value: '1m' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last Year', value: '1y' },
  { label: 'Last 2 Years', value: '2y' },
  { label: 'Last 3 Years', value: '3y' },
  { label: 'Last 4 Years', value: '4y' }
];

const Profile = () => {
  const [emailData, setEmailData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('1m');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);

  useEffect(() => {
    fetchData();
    fetchVolumeData();
  }, [timeFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsRefreshing(true);

      const token = sessionStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get('/api/data/categoryData', config);
      setEmailData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchVolumeData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          timeFilter
        }
      };

      const response = await axios.get('/api/data/emailVolume', config);
      processVolumeData(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const processVolumeData = (data) => {
    const volumeByCategory = data.reduce((acc, email) => {
      const sentEmails = parseInt(email.sentEmails, 10) || 0;
      const receivedEmails = parseInt(email.receivedEmails, 10) || 0;

      acc.Sent = (acc.Sent || 0) + sentEmails;
      acc.Received = (acc.Received || 0) + receivedEmails;

      return acc;
    }, {});

    const processedData = [
      {
        name: 'Email Volume',
        Received: volumeByCategory.Received || 0,
        Sent: volumeByCategory.Sent || 0
      }
    ];

    setVolumeData(processedData);
  };

  const handleError = (error) => {
    if (error.response?.status === 401) {
      setError('Session expired. Please login again.');
    } else {
      setError('Failed to fetch email data. Please try again later.');
    }
    console.error('Error fetching data:', error);
  };

  const totalEmails = emailData.reduce((acc, curr) => acc + curr.totalEmails, 0);
  const totalReceived = emailData.reduce((acc, curr) => acc + parseInt(curr.receivedEmails), 0);
  const totalSent = emailData.reduce((acc, curr) => acc + parseInt(curr.sentEmails), 0);
  const spamCount = emailData.find(item => item.categoryName === "spam")?.totalEmails || 0;

  const pieChartData = emailData.map(item => ({
    name: item.categoryName.charAt(0).toUpperCase() + item.categoryName.slice(1),
    value: item.totalEmails
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Email Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Comprehensive overview of your email activity and trends
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchData}
              disabled={isRefreshing}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
          transition-all duration-200 flex items-center gap-2 shadow-md 
          ${isRefreshing ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>

            <button
              onClick={() => setIsEmailFormOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
          transition-all duration-200 flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add New Email
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <Mail className="w-8 h-8 opacity-75" />
              <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">TOTAL</span>
            </div>
            <h3 className="text-lg font-medium opacity-75">Total Emails</h3>
            <p className="text-3xl font-bold mt-2">{totalEmails.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <Inbox className="w-8 h-8 opacity-75" />
              <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">INBOX</span>
            </div>
            <h3 className="text-lg font-medium opacity-75">Received</h3>
            <p className="text-3xl font-bold mt-2">{totalReceived.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <Send className="w-8 h-8 opacity-75" />
              <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">SENT</span>
            </div>
            <h3 className="text-lg font-medium opacity-75">Sent</h3>
            <p className="text-3xl font-bold mt-2">{totalSent.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-8 h-8 opacity-75" />
              <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">SPAM</span>
            </div>
            <h3 className="text-lg font-medium opacity-75">Spam</h3>
            <p className="text-3xl font-bold mt-2">{spamCount.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Email Volume Trends</h2>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
              >
                {TIME_FILTERS.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar dataKey="Received" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Sent" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Email Distribution</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ paddingLeft: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <EmailCategoryForm
          isOpen={isEmailFormOpen}
          onClose={() => setIsEmailFormOpen(false)}
        />
      </main>
    </div>

  );
};

export default Profile;