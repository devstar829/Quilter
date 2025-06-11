import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './LandingPage.css'; // Importing a CSS file for styling

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="landing-page">
      <div className="background background-1"></div>
      <div className="background background-2"></div>
      <div className="content">
        <h1 className="title">Welcome to PCB Visualizer</h1>
        <p className="subtitle">
          Simplify your PCB design process. Upload, visualize, and validate your netlists with ease.
        </p>
        <div className="button-group">
          <Link to="/register" className="btn primary-btn">
            Get Started
          </Link>
          <Link to="/login" className="btn secondary-btn">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
