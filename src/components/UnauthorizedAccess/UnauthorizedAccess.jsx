import React from 'react';
import './UnauthorizedAccess.css';

const UnauthorizedAccess = ({ 
  onRetry, 
  onGoHome, 
  message = "You are not authorized to access this resource",
  showRetry = true,
  customAction
}) => {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/dashboard';
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="unauthorized-overlay">
      <div className="unauthorized-modal">
        <div className="unauthorized-content">
          <div className="unauthorized-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <path d="M12 17h.01"/>
            </svg>
          </div>
          
          <h2>Access Denied</h2>
          <p>{message}</p>
          
          <div className="unauthorized-details">
            <p className="error-code">Error Code: 403 - Forbidden</p>
            <p>Please contact your administrator if you believe this is an error.</p>
          </div>

          <div className="unauthorized-actions">
            {showRetry && (
              <button 
                className="retry-btn"
                onClick={handleRetry}
              >
                Try Again
              </button>
            )}
            
            <button 
              className="home-btn"
              onClick={handleGoHome}
            >
              Go to Dashboard
            </button>

            {customAction && (
              <button 
                className="custom-btn"
                onClick={customAction.onClick}
              >
                {customAction.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;