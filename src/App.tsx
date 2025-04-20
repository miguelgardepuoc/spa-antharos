import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/header/Header';
import JobListings from './components/joblistings/JobListings';
import ProtectedRoute from './components/ProtectedRoute';
import JobDetail from './pages/jobofferdetail/JobOfferDetail';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import { AddJobOfferPage } from './pages/addjoboffer';
import CorporateManagement from './pages/corporatemanagement/CorporateManagement';
import './App.css';

// Routes configuration
const PUBLIC_ROUTES = [
  { path: '/job-offers', element: <JobListings /> },
  { path: '/job-offer/:id', element: <JobDetail /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> }
];

const PROTECTED_ROUTES = [
  { path: '/add-job-offer', element: <AddJobOfferPage /> },
  { path: '/corporate-management', element: <CorporateManagement /> }
];

// Header logic extracted to its own component
const HeaderWrapper: React.FC = () => {
  const location = useLocation();
  const AUTH_PATHS = ['/login', '/signup'];
  
  return AUTH_PATHS.includes(location.pathname) ? null : <Header />;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <HeaderWrapper />
        <main>
          <Routes>
            {/* Redirect root to job offers */}
            <Route path="/" element={<Navigate to="/job-offers" replace />} />
            
            {/* Public routes */}
            {PUBLIC_ROUTES.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {PROTECTED_ROUTES.map(route => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>
            
            {/* Catch all route - redirect to job listings */}
            <Route path="*" element={<Navigate to="/job-offers" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;