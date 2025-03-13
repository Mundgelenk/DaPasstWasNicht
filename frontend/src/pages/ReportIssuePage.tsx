import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentLocation, getNearbyCompanies, submitRepairRequest, Company, Location } from '../services/companyService';

const ReportIssuePage: React.FC = () => {
  const [stage, setStage] = useState<'camera' | 'preview' | 'description' | 'company' | 'submitting'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearbyCompanies, setNearbyCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  // Effect to get user location
  useEffect(() => {
    if (stage === 'company' && !userLocation && !locationError) {
      setIsLoadingCompanies(true);
      getCurrentLocation()
        .then((location) => {
          setUserLocation(location);
          // Once we have location, fetch nearby companies
          return getNearbyCompanies(location);
        })
        .then((companies) => {
          setNearbyCompanies(companies);
          setIsLoadingCompanies(false);
        })
        .catch((error) => {
          console.error('Error getting location or companies:', error);
          setLocationError('Unable to access your location. Please enable location services or try again.');
          setIsLoadingCompanies(false);
        });
    }
  }, [stage, userLocation, locationError]);

  useEffect(() => {
    // Function to start the camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Unable to access camera. Please check your permissions.");
      }
    };

    if (stage === 'camera') {
      startCamera();
    }

    // Cleanup function to stop the camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [stage]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to image URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        setStage('preview');
        
        // Stop the camera stream
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setStage('camera');
  };

  const proceedToDescription = () => {
    setStage('description');
  };

  const proceedToCompanySelection = () => {
    setStage('company');
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleSubmit = async () => {
    setStage('submitting');
    setIsSubmitting(true);
    
    try {
      if (!capturedImage || !selectedCompany) {
        throw new Error('Missing required information');
      }
      
      // Submit the repair request
      await submitRepairRequest(selectedCompany.id, {
        imageUrl: capturedImage,
        description,
        location: userLocation || undefined
      });
      
      // Navigate to the issues page after submission
      navigate('/issues', { state: { justSubmitted: true } });
    } catch (error) {
      console.error("Error submitting issue:", error);
      setIsSubmitting(false);
      alert("Failed to submit issue. Please try again.");
      setStage('company'); // Go back to company selection
    }
  };

  return (
    <div className="report-issue-page">
      <h1>Report an Issue</h1>
      
      {stage === 'camera' && (
        <div className="camera-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="camera-preview"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <button 
            className="capture-button"
            onClick={takePhoto}
          >
            Take Photo
          </button>
        </div>
      )}
      
      {stage === 'preview' && capturedImage && (
        <div className="preview-container">
          <img 
            src={capturedImage} 
            alt="Captured issue" 
            className="captured-image"
          />
          <div className="preview-actions">
            <button 
              className="secondary-button"
              onClick={retakePhoto}
            >
              Retake Photo
            </button>
            <button 
              className="primary-button"
              onClick={proceedToDescription}
            >
              Use This Photo
            </button>
          </div>
        </div>
      )}
      
      {stage === 'description' && (
        <div className="description-section">
          <form className="description-form">
            <div className="form-group">
              <label htmlFor="description">Describe the issue:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's the issue you're reporting? Please be specific."
                rows={5}
                required
              />
            </div>
            
            {capturedImage && (
              <div className="image-thumbnail-container">
                <img 
                  src={capturedImage} 
                  alt="Thumbnail" 
                  className="image-thumbnail" 
                />
                <button 
                  type="button"
                  className="change-photo-button"
                  onClick={() => setStage('camera')}
                >
                  Change Photo
                </button>
              </div>
            )}
            
            <button 
              type="button"
              className="submit-button"
              onClick={proceedToCompanySelection}
              disabled={!description.trim()}
            >
              Find Nearby Companies
            </button>
          </form>
        </div>
      )}
      
      {stage === 'company' && (
        <div className="company-selection-section">
          <h2>Select a Company</h2>
          
          {locationError && (
            <div className="error-message">
              <p>{locationError}</p>
              <button 
                className="retry-button"
                onClick={() => {
                  setLocationError(null);
                  setIsLoadingCompanies(true);
                }}
              >
                Retry
              </button>
            </div>
          )}
          
          {isLoadingCompanies ? (
            <div className="loading-indicator">
              <p>Finding companies near your location...</p>
            </div>
          ) : (
            <>
              {nearbyCompanies.length === 0 && !locationError ? (
                <div className="no-companies-message">
                  <p>No companies found near your location. Please try again later.</p>
                </div>
              ) : (
                <div className="companies-list">
                  {nearbyCompanies.map(company => (
                    <div 
                      key={company.id} 
                      className={`company-card ${selectedCompany?.id === company.id ? 'selected' : ''}`}
                      onClick={() => handleCompanySelect(company)}
                    >
                      <div className="company-info">
                        <h3>{company.name}</h3>
                        <p className="company-address">{company.address}</p>
                        <p className="company-distance">{company.distance} km away</p>
                        <div className="company-categories">
                          {company.categories.map((category, index) => (
                            <span key={index} className="category-tag">{category}</span>
                          ))}
                        </div>
                        <div className="company-details">
                          <span className="company-rating">⭐ {company.rating.toFixed(1)}</span>
                          <span className="company-response-time">⏱️ {company.responseTime}</span>
                        </div>
                      </div>
                      {selectedCompany?.id === company.id && (
                        <div className="selected-indicator">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <button 
                className="submit-button"
                onClick={handleSubmit}
                disabled={!selectedCompany}
              >
                Submit Report
              </button>
            </>
          )}
        </div>
      )}
      
      {stage === 'submitting' && (
        <div className="submitting-section">
          <div className="loading-indicator">
            <p>Submitting your issue report...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportIssuePage; 