import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import ReportIssuePage from './pages/ReportIssuePage';
import IssueFeedPage from './pages/IssueFeedPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';

// Import components 
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/issues" element={<IssueFeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
}

export default App; 