import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This would be replaced with actual API types
type Issue = {
  id: string;
  imageUrl: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'in-progress' | 'resolved';
  companyResponse?: {
    text: string;
    timestamp: string;
    companyName: string;
  };
  companyId?: string;
};

// Mock PayPal data
const PAYPAL_CLIENT_ID = 'test-paypal-client-id';

// Mock data for development
const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    imageUrl: 'https://via.placeholder.com/300x200',
    description: 'Broken stairs near the main entrance. Very dangerous for elderly people.',
    timestamp: '2023-10-15T14:30:00Z',
    status: 'in-progress',
    companyResponse: {
      text: 'Thank you for reporting this issue. We have scheduled repairs for next week.',
      timestamp: '2023-10-16T09:15:00Z',
      companyName: 'Building Management Inc.'
    },
    companyId: '1'
  },
  {
    id: '2',
    imageUrl: 'https://via.placeholder.com/300x200',
    description: 'Water leakage in the bathroom ceiling, appears to be coming from the apartment above.',
    timestamp: '2023-10-14T10:22:00Z',
    status: 'pending'
  },
  {
    id: '3',
    imageUrl: 'https://via.placeholder.com/300x200',
    description: 'Flickering lights in the hallway of the 3rd floor.',
    timestamp: '2023-10-10T16:45:00Z',
    status: 'resolved',
    companyResponse: {
      text: 'We have replaced the faulty light fixtures. Please let us know if the issue persists.',
      timestamp: '2023-10-12T11:30:00Z',
      companyName: 'Electro Maintenance LLC'
    },
    companyId: '3'
  }
];

const IssueFeedPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState<{ [key: string]: number }>({});
  const [showDonationForm, setShowDonationForm] = useState<{ [key: string]: boolean }>({});
  const [isDonating, setIsDonating] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();

  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchIssues = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIssues(MOCK_ISSUES);
        
        // Initialize donation state
        const donationState: { [key: string]: number } = {};
        const donationFormState: { [key: string]: boolean } = {};
        const donatingState: { [key: string]: boolean } = {};
        
        MOCK_ISSUES.forEach(issue => {
          donationState[issue.id] = 5; // Default amount $5
          donationFormState[issue.id] = false;
          donatingState[issue.id] = false;
        });
        
        setDonationAmount(donationState);
        setShowDonationForm(donationFormState);
        setIsDonating(donatingState);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching issues:', error);
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Show success message if coming from report page
  const justSubmitted = location.state && location.state.justSubmitted;

  const handleShowDonation = (issueId: string) => {
    setShowDonationForm(prev => ({
      ...prev,
      [issueId]: true
    }));
  };

  const handleCancelDonation = (issueId: string) => {
    setShowDonationForm(prev => ({
      ...prev,
      [issueId]: false
    }));
  };

  const handleDonationAmountChange = (issueId: string, amount: number) => {
    setDonationAmount(prev => ({
      ...prev,
      [issueId]: amount
    }));
  };

  const handleDonate = async (issueId: string, companyId?: string) => {
    if (!companyId) return;
    
    setIsDonating(prev => ({
      ...prev,
      [issueId]: true
    }));
    
    try {
      // This would be replaced with actual PayPal API integration
      console.log(`Donating $${donationAmount[issueId]} to company ${companyId} for issue ${issueId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert(`Thank you for your donation of $${donationAmount[issueId]}!`);
      
      // Update UI
      setShowDonationForm(prev => ({
        ...prev,
        [issueId]: false
      }));
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('There was an error processing your donation. Please try again.');
    } finally {
      setIsDonating(prev => ({
        ...prev,
        [issueId]: false
      }));
    }
  };

  return (
    <div className="issues-feed-page">
      <h1>Reported Issues</h1>
      
      {justSubmitted && (
        <div className="success-message">
          <p>✅ Your issue has been successfully reported. Thank you!</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading-indicator">Loading issues...</div>
      ) : issues.length === 0 ? (
        <div className="empty-state">
          <p>No issues reported yet.</p>
        </div>
      ) : (
        <div className="issues-list">
          {issues.map(issue => (
            <div key={issue.id} className={`issue-card status-${issue.status}`}>
              <div className="issue-header">
                <span className={`status-badge ${issue.status}`}>
                  {issue.status === 'pending' && 'Pending'}
                  {issue.status === 'in-progress' && 'In Progress'}
                  {issue.status === 'resolved' && 'Resolved'}
                </span>
                <span className="timestamp">
                  {new Date(issue.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <div className="issue-content">
                <img 
                  src={issue.imageUrl} 
                  alt="Issue" 
                  className="issue-image" 
                />
                <p className="issue-description">{issue.description}</p>
              </div>
              
              {issue.companyResponse && (
                <div className="company-response">
                  <h4>Response from {issue.companyResponse.companyName}</h4>
                  <p>{issue.companyResponse.text}</p>
                  <span className="response-timestamp">
                    {new Date(issue.companyResponse.timestamp).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {issue.status === 'resolved' && issue.companyId && (
                <div className="donation-section">
                  {showDonationForm[issue.id] ? (
                    <div className="donation-form">
                      <h4>Send a Thank You Donation</h4>
                      <p>Your donation will be sent to {issue.companyResponse?.companyName || 'the company'}</p>
                      
                      <div className="donation-amount-selector">
                        <label>Select Amount:</label>
                        <div className="amount-options">
                          {[5, 10, 20, 50].map(amount => (
                            <button 
                              key={amount}
                              className={`amount-option ${donationAmount[issue.id] === amount ? 'selected' : ''}`}
                              onClick={() => handleDonationAmountChange(issue.id, amount)}
                            >
                              ${amount}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="donation-actions">
                        <button 
                          className="cancel-donation-button"
                          onClick={() => handleCancelDonation(issue.id)}
                          disabled={isDonating[issue.id]}
                        >
                          Cancel
                        </button>
                        <button 
                          className="donate-button"
                          onClick={() => handleDonate(issue.id, issue.companyId)}
                          disabled={isDonating[issue.id]}
                        >
                          {isDonating[issue.id] ? 'Processing...' : `Donate $${donationAmount[issue.id]}`}
                        </button>
                      </div>
                      
                      <div className="paypal-notice">
                        <small>Secure payments powered by PayPal</small>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="donate-button"
                      onClick={() => handleShowDonation(issue.id)}
                    >
                      <span className="paypal-icon">💰</span>
                      Send a Thank You Donation
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueFeedPage; 