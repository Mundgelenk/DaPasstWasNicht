import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showFallbackLogin, setShowFallbackLogin] = useState(false);
  const navigate = useNavigate();

  // This would be replaced with actual OAuth implementations
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate OAuth flow
      console.log('Logging in with Google');
      await new Promise(resolve => setTimeout(resolve, 1500));
      // After successful login
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate OAuth flow
      console.log('Logging in with Apple');
      await new Promise(resolve => setTimeout(resolve, 1500));
      // After successful login
      navigate('/');
    } catch (error) {
      console.error('Apple login error:', error);
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // This would be replaced with actual authentication API call
      console.log('Logging in with email:', email);
      await new Promise(resolve => setTimeout(resolve, 1500));
      // After successful login
      navigate('/');
    } catch (error) {
      console.error('Email login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome to Issue Reporter</h1>
        <p className="login-subtitle">Sign in to report and track facility issues</p>
        
        <div className="oauth-buttons">
          <button 
            className="google-login-button" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>
          
          <button 
            className="apple-login-button" 
            onClick={handleAppleLogin}
            disabled={isLoading}
          >
            <span className="apple-icon">🍎</span>
            Continue with Apple
          </button>
        </div>
        
        <div className="login-divider">
          <span>or</span>
        </div>
        
        {showFallbackLogin ? (
          <form onSubmit={handleEmailLogin} className="email-login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="email-login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in with Email'}
            </button>
          </form>
        ) : (
          <button 
            className="show-email-button"
            onClick={() => setShowFallbackLogin(true)}
          >
            Sign in with Email
          </button>
        )}
        
        <p className="login-footer">
          By signing in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 