import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { navigateTo } from '../config/paths';

// Error types
const ERROR_TYPES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  GENERAL: 'GENERAL',
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION'
};

// Initial state
const initialState = {
  errors: [],
  isLoading: false,
  unauthorizedError: null
};

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  ADD_ERROR: 'ADD_ERROR',
  REMOVE_ERROR: 'REMOVE_ERROR',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  SET_UNAUTHORIZED_ERROR: 'SET_UNAUTHORIZED_ERROR',
  CLEAR_UNAUTHORIZED_ERROR: 'CLEAR_UNAUTHORIZED_ERROR'
};

// Reducer
const errorReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ACTION_TYPES.ADD_ERROR:
      return {
        ...state,
        errors: [...state.errors, {
          id: Date.now() + Math.random(),
          ...action.payload
        }]
      };

    case ACTION_TYPES.REMOVE_ERROR:
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload)
      };

    case ACTION_TYPES.CLEAR_ERRORS:
      return {
        ...state,
        errors: []
      };

    case ACTION_TYPES.SET_UNAUTHORIZED_ERROR:
      return {
        ...state,
        unauthorizedError: action.payload
      };

    case ACTION_TYPES.CLEAR_UNAUTHORIZED_ERROR:
      return {
        ...state,
        unauthorizedError: null
      };

    default:
      return state;
  }
};

// Create context
const ErrorContext = createContext();

// Custom hook to use error context
export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

// Error Provider component
export const ErrorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  // Set loading state
  const setLoading = useCallback((isLoading) => {
    dispatch({
      type: ACTION_TYPES.SET_LOADING,
      payload: isLoading
    });
  }, []);

  // Add general error
  const addError = useCallback((error) => {
    dispatch({
      type: ACTION_TYPES.ADD_ERROR,
      payload: {
        type: ERROR_TYPES.GENERAL,
        message: error.message || 'An unexpected error occurred',
        details: error.details || null,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  // Add network error
  const addNetworkError = useCallback((error) => {
    dispatch({
      type: ACTION_TYPES.ADD_ERROR,
      payload: {
        type: ERROR_TYPES.NETWORK,
        message: error.message || 'Network error occurred',
        details: error.details || null,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  // Add validation error
  const addValidationError = useCallback((error) => {
    dispatch({
      type: ACTION_TYPES.ADD_ERROR,
      payload: {
        type: ERROR_TYPES.VALIDATION,
        message: error.message || 'Validation error occurred',
        details: error.details || null,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  // Set unauthorized error (403)
  const setUnauthorizedError = useCallback((error) => {
    dispatch({
      type: ACTION_TYPES.SET_UNAUTHORIZED_ERROR,
      payload: {
        type: ERROR_TYPES.UNAUTHORIZED,
        message: error.message || 'You are not authorized to access this resource',
        details: error.details || null,
        timestamp: new Date().toISOString(),
        endpoint: error.endpoint || null,
        method: error.method || null
      }
    });
  }, []);

  // Clear unauthorized error
  const clearUnauthorizedError = useCallback(() => {
    dispatch({
      type: ACTION_TYPES.CLEAR_UNAUTHORIZED_ERROR
    });
  }, []);

  // Remove specific error
  const removeError = useCallback((errorId) => {
    dispatch({
      type: ACTION_TYPES.REMOVE_ERROR,
      payload: errorId
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    dispatch({
      type: ACTION_TYPES.CLEAR_ERRORS
    });
  }, []);

  // Handle authentication error (401) - clear session and redirect to login
  const handleAuthenticationError = useCallback(() => {
    // Clear session data
    localStorage.clear();
    // Redirect to login
    navigateTo('/');
  }, []);

  // Handle API response errors
  const handleApiError = useCallback((response, endpoint, method) => {
    if (response.status === 401) {
      handleAuthenticationError();
      return true; // Indicates 401 error was handled
    }

    if (response.status === 403) {
      setUnauthorizedError({
        message: 'You are not authorized to access this resource',
        endpoint,
        method,
        details: response.statusText
      });
      return true; // Indicates 403 error was handled
    }
    
    if (response.status >= 400) {
      addNetworkError({
        message: `Server error: ${response.status} ${response.statusText}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          endpoint,
          method
        }
      });
      return false; // Indicates other error was handled
    }

    return false; // No error
  }, [setUnauthorizedError, addNetworkError, handleAuthenticationError]);

  const value = {
    // State
    errors: state.errors,
    isLoading: state.isLoading,
    unauthorizedError: state.unauthorizedError,
    
    // Actions
    setLoading,
    addError,
    addNetworkError,
    addValidationError,
    setUnauthorizedError,
    clearUnauthorizedError,
    removeError,
    clearAllErrors,
    handleApiError,
    handleAuthenticationError,
    
    // Constants
    ERROR_TYPES
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContext;