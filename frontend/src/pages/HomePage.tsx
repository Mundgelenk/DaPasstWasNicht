import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <header className="app-header">
        <h1>Issue Reporter</h1>
        <p>A mobile-optimized web application for reporting facility issues.</p>
      </header>

      <div className="action-buttons">
        <Link to="/report" className="primary-button">
          <span className="icon">📷</span>
          Report an Issue
        </Link>
        
        <Link to="/issues" className="secondary-button">
          View Reported Issues
        </Link>
      </div>

      <div className="info-section">
        <h2>How It Works</h2>
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Take a Photo</h3>
            <p>Quickly capture the issue with your device's camera</p>
          </div>
        </div>
        
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Describe the Problem</h3>
            <p>Add a brief description to help understand the issue</p>
          </div>
        </div>
        
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Get a Response</h3>
            <p>Companies will respond to your reported issues</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 