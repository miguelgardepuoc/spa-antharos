import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import JobListings from './components/JobListings';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import {AddJobOfferPage} from './pages/AddJobOffer/index.ts';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';


const HeaderWrapper = () => {
  const location = useLocation();
  const authRoutes = ['/login', '/signup'];
  const hideHeader = authRoutes.includes(location.pathname);
  
  return !hideHeader ? <Header /> : null;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <HeaderWrapper />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<JobListings />} />
            <Route path="/job-offer/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/add-job-offer" element={<AddJobOfferPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;