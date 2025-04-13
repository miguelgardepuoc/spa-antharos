import React from 'react';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import JobListings from './components/JobListings';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import './App.css';

// Wrapper component that checks the current route
const HeaderWrapper = () => {
  const location = useLocation();
  return location.pathname !== '/login' ? <Header /> : null;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <HeaderWrapper />
        <main>
          <Routes>
            <Route path="/" element={<JobListings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/job/:id" element={<JobDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;