import React from 'react';
import { useError } from '../../contexts/ErrorContext';
import UnauthorizedAccess from '../UnauthorizedAccess/UnauthorizedAccess';

const GlobalErrorHandler = () => {
  const { unauthorizedError, clearUnauthorizedError } = useError();

  const handleRetry = () => {
    clearUnauthorizedError();
    // Optionally reload the page or retry the last action
    window.location.reload();
  };

  const handleGoHome = () => {
    clearUnauthorizedError();
    window.location.href = '/dashboard';
  };

  // Only render if there's an unauthorized error
  if (!unauthorizedError) {
    return null;
  }

  return (
    <UnauthorizedAccess
      message={unauthorizedError.message}
      onRetry={handleRetry}
      onGoHome={handleGoHome}
      showRetry={true}
    />
  );
};

export default GlobalErrorHandler;