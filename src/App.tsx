import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/header/Header';
import JobOfferPortal from './pages/JobOfferPortal/JobOfferPortal';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import JobDetail from './pages/JobOfferDetail/JobOfferDetail';
import Login from './pages/Login/Login';
import SignUp from './pages/Signup/SignUp';
import { AddJobOfferPage } from './pages/AddJobOffer/AddJobOfferPage';
import CorporateManagement from './pages/CorporateManagement/CorporateManagement';
import {PeopleAnalytics} from './pages/PeopleAnalytics/PeopleAnalytics';
import './App.css';

const PUBLIC_ROUTES = [
  { path: '/job-offers', element: <JobOfferPortal /> },
  { path: '/job-offer/:id', element: <JobDetail /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> }
];

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
            
            {PUBLIC_ROUTES.map(route => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/add-job-offer" element={<AddJobOfferPage />} />
              <Route path="/corporate-management" element={<CorporateManagement />} />
              <Route path="/people-analytics" element={<PeopleAnalytics />} />
            </Route>

            <Route element={<RoleProtectedRoute allowedRoles={['ROLE_COMPANY_MANAGEMENT']} />}>
              <Route path="/people-analytics" element={<PeopleAnalytics />} />
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