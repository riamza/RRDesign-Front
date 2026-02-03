import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home/Home';
import Projects from './pages/Projects/Projects';
import Templates from './pages/Templates/Templates';
import Services from './pages/Services/Services';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientProjectDetails from './pages/Dashboard/components/ClientProjectDetails';
import Profile from './pages/Profile/Profile';
import MyProjects from './pages/MyProjects/MyProjects';
import Messages from './pages/Messages/Messages';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="app">
          <Routes>
            {/* Public Routes - use PublicLayout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/contact" element={<Contact />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                    <Register />
                } 
              />
            </Route>

            {/* Dashboard/Private Routes - use DashboardLayout */}
            <Route element={<DashboardLayout />}>
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-projects" 
                element={
                  <PrivateRoute>
                    <MyProjects />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <PrivateRoute>
                    <Messages />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/dashboard/client-projects/:id" 
                element={
                  <PrivateRoute roles={['Admin']}>
                    <ClientProjectDetails />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/dashboard/*" 
                element={
                  <PrivateRoute roles={['Admin']}>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
