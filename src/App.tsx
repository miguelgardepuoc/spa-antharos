import React from 'react';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobListings from './components/JobListings';
import JobDetail from './pages/JobDetail';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
      <Header />
        <main>
          <Routes>
            <Route path="/" element={<JobListings />} />
            <Route path="/job/:id" element={<JobDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;