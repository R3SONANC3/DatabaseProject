import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Mail, Inbox, Send, Trash, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Navbar from './Navbar';
import Overview from './Overview'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1', '#ff7c43'];

const TIME_FILTERS = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last Month', value: '1m' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last Year', value: '1y' },
  { label: 'Last 2 Years', value: '2y' },
  { label: 'Last 3 Years', value: '3y' },
  { label: 'Last 4 Years', value: '4y' }
];


const Home = () => {
  const [emailData, setEmailData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('7d');

  useEffect(() => {
    fetchData();
    fetchVolumeData();
  }, [timeFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

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
      console.log(response.data);
      
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">
          Personal email information
          </h1>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Email Volume by Category</h2>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TIME_FILTERS.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Received" fill="#82ca9d" />
                <Bar dataKey="Sent" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Email Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Emails</h3>
              <p className="text-3xl font-bold">{totalEmails.toLocaleString()}</p>
            </div>
            <Mail size={48} />
          </div>

          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Received</h3>
              <p className="text-3xl font-bold">{totalReceived.toLocaleString()}</p>
            </div>
            <Inbox size={48} />
          </div>

          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Sent</h3>
              <p className="text-3xl font-bold">{totalSent.toLocaleString()}</p>
            </div>
            <Send size={48} />
          </div>

          <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Spam</h3>
              <p className="text-3xl font-bold">{spamCount.toLocaleString()}</p>
            </div>
            <AlertCircle size={48} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;