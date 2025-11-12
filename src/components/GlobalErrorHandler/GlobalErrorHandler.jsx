import React from 'react';
import { useError } from '../../contexts/ErrorContext';
import UnauthorizedAccess from '../UnauthorizedAccess/UnauthorizedAccess';
import { navigateTo } from '../../config/paths';

const GlobalErrorHandler = () => {
  const { unauthorizedError, clearUnauthorizedError } = useError();

  const handleRetry = () => {
    clearUnauthorizedError();
    window.location.reload();
  };

  const handleGoHome = () => {
    clearUnauthorizedError();
    navigateTo('/dashboard');
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