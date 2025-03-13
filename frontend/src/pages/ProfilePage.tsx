import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data for PayPal integration
const MOCK_PAYPAL_CONFIG = {
  clientId: 'test-client-id'
};

// Mock user data for development
const MOCK_USER = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://via.placeholder.com/150',
  issuesReported: 5,
  issuesResolved: 3,
  donationsReceived: 2,
  provider: 'google',
  paypalEmail: '',
};

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState(MOCK_USER);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditingPayPal, setIsEditingPayPal] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState(user.paypalEmail);
  const [isSavingPayPal, setIsSavingPayPal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // This would be replaced with actual logout API call
      console.log('Logging out');
      await new Promise(resolve => setTimeout(resolve, 1000));
      // After successful logout
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const handlePayPalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPayPal(true);
    
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(prev => ({ ...prev, paypalEmail }));
      setIsEditingPayPal(false);
      alert('PayPal email updated successfully!');
    } catch (error) {
      console.error('Error updating PayPal email:', error);
      alert('Failed to update PayPal email. Please try again.');
    } finally {
      setIsSavingPayPal(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="profile-avatar" 
        />
        <h1>{user.name}</h1>
        <p className="profile-email">{user.email}</p>
        <p className="login-provider">
          Signed in with {user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}
        </p>
      </div>
      
      <div className="profile-stats">
        <div className="stat-card">
          <span className="stat-value">{user.issuesReported}</span>
          <span className="stat-label">Issues Reported</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-value">{user.issuesResolved}</span>
          <span className="stat-label">Issues Resolved</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-value">{user.donationsReceived}</span>
          <span className="stat-label">Donations Received</span>
        </div>
      </div>
      
      <div className="paypal-section">
        <h2>PayPal Integration</h2>
        {isEditingPayPal ? (
          <form onSubmit={handlePayPalSubmit} className="paypal-form">
            <div className="form-group">
              <label htmlFor="paypal-email">Your PayPal Email</label>
              <input 
                type="email" 
                id="paypal-email" 
                value={paypalEmail} 
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="Enter your PayPal email to receive donations"
                required
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => {
                  setIsEditingPayPal(false);
                  setPaypalEmail(user.paypalEmail);
                }}
                disabled={isSavingPayPal}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={isSavingPayPal}
              >
                {isSavingPayPal ? 'Saving...' : 'Save PayPal Email'}
              </button>
            </div>
          </form>
        ) : (
          <div className="paypal-info">
            {user.paypalEmail ? (
              <>
                <p className="paypal-email">Your PayPal email: <strong>{user.paypalEmail}</strong></p>
                <p className="paypal-status">You can receive donations from companies</p>
                <button 
                  className="edit-paypal-button"
                  onClick={() => setIsEditingPayPal(true)}
                >
                  Change PayPal Email
                </button>
              </>
            ) : (
              <>
                <p className="no-paypal-message">
                  To receive thank-you donations from companies, please add your PayPal email.
                </p>
                <button 
                  className="add-paypal-button"
                  onClick={() => setIsEditingPayPal(true)}
                >
                  Add PayPal Account
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="profile-actions">
        <button className="settings-button">
          <span className="settings-icon">⚙️</span>
          Account Settings
        </button>
        
        <button 
          className="notification-button"
        >
          <span className="notification-icon">🔔</span>
          Notification Preferences
        </button>
        
        <button 
          className="logout-button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <span className="logout-icon">🚪</span>
          {isLoggingOut ? 'Logging out...' : 'Sign Out'}
        </button>
      </div>
      
      <div className="app-info">
        <h3>About Issue Reporter</h3>
        <p>Version 1.0.0</p>
        <div className="app-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help & Support</a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 