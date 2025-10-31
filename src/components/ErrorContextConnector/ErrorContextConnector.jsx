import React, { useEffect } from 'react';
import { useError } from '../../contexts/ErrorContext';
import { setErrorContext as setEnhancedErrorContext } from '../../Services/EnhancedApi';
import { setErrorContext as setApiErrorContext } from '../../Services/Api';

const ErrorContextConnector = ({ children }) => {
  const errorContext = useError();

  useEffect(() => {
    // Connect the error context to both API services
    setEnhancedErrorContext(errorContext);
    setApiErrorContext(errorContext);
  }, [errorContext]);

  return children;
};

export default ErrorContextConnector;