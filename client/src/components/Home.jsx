import React from 'react';
import Navbar from './Navbar';
import Overview from './Overview'

const Home = () => {


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Overview />
      </main>
    </div>
  );
};

export default Home;