import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LogAnalysis from './pages/LogAnalysis';
import SecurityScan from './pages/SecurityScan';
import DataMining from './pages/DataMining';
import Reports from './pages/Reports';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/logs" element={<LogAnalysis />} />
            <Route path="/security" element={<SecurityScan />} />
            <Route path="/analytics" element={<DataMining />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App; 