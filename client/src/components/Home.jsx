import React from 'react';
import Navbar from "./Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Mail, Inbox, Send, Trash, AlertCircle } from 'lucide-react';

// Sample data for charts
const emailVolumeData = [
  { name: 'Mon', Received: 120, Sent: 80 },
  { name: 'Tue', Received: 150, Sent: 100 },
  { name: 'Wed', Received: 180, Sent: 120 },
  { name: 'Thu', Received: 140, Sent: 90 },
  { name: 'Fri', Received: 160, Sent: 110 },
  { name: 'Sat', Received: 70, Sent: 40 },
  { name: 'Sun', Received: 50, Sent: 30 },
];

const emailCategoryData = [
  { name: 'Work', value: 400 },
  { name: 'Personal', value: 300 },
  { name: 'Promotions', value: 200 },
  { name: 'Spam', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Email Data Visualization Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Email Volume (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emailVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Received" fill="#8884d8" />
                <Bar dataKey="Sent" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Email Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emailCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emailCategoryData.map((entry, index) => (
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
              <p className="text-3xl font-bold">12,345</p>
            </div>
            <Mail size={48} />
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Inbox</h3>
              <p className="text-3xl font-bold">1,234</p>
            </div>
            <Inbox size={48} />
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Sent</h3>
              <p className="text-3xl font-bold">5,678</p>
            </div>
            <Send size={48} />
          </div>
          <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Spam</h3>
              <p className="text-3xl font-bold">98</p>
            </div>
            <AlertCircle size={48} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center text-gray-700">
              <Mail className="mr-3 text-blue-500" /> Received 5 new emails in the last hour
            </li>
            <li className="flex items-center text-gray-700">
              <Send className="mr-3 text-green-500" /> Sent 2 emails in the last 30 minutes
            </li>
            <li className="flex items-center text-gray-700">
              <Trash className="mr-3 text-red-500" /> Deleted 10 spam emails today
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Home;