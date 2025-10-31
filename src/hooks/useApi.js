import { useState, useCallback } from 'react';
import { useError } from '../contexts/ErrorContext';
import { 
  postData, 
  getData, 
  deleteData, 
  patchData, 
  putData, 
  postDataAuth,
  isUnauthorizedResponse,
  handleApiResponse 
} from '../Services/EnhancedApi';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { addError, addNetworkError, setUnauthorizedError } = useError();

  // Generic API call wrapper
  const makeApiCall = useCallback(async (
    apiFunction, 
    ...args
  ) => {
    setIsLoading(true);
    try {
      const response = await apiFunction(...args);
      
      // Check for 403 unauthorized response
      if (isUnauthorizedResponse(response)) {
        return null; // Error is already handled by the enhanced API
      }

      return response;
    } catch (error) {
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        addNetworkError({
          message: 'Unable to connect to the server. Please check your internet connection.',
          details: error.message
        });
      } else {
        addError({
          message: error.message || 'An unexpected error occurred',
          details: error.stack
        });
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [addError, addNetworkError]);

  // Enhanced API methods with automatic error handling
  const apiPost = useCallback(async (data, urlPath, options = {}) => {
    const { onSuccess, onError, showErrorToUser = true } = options;
    
    try {
      const response = await makeApiCall(postData, data, urlPath);
      if (!response) return null;

      return await handleApiResponse(response, onSuccess, onError);
    } catch (error) {
      if (showErrorToUser) {
        addError({
          message: error.message || 'Failed to post data',
          details: `Endpoint: ${urlPath}`
        });
      }
      if (onError) onError(error);
      return null;
    }
  }, [makeApiCall, addError]);

  const apiGet = useCallback(async (urlPath, options = {}) => {
    const { onSuccess, onError, showErrorToUser = true } = options;
    
    try {
      const response = await makeApiCall(getData, urlPath);
      if (!response) return null;

      return await handleApiResponse(response, onSuccess, onError);
    } catch (error) {
      if (showErrorToUser) {
        addError({
          message: error.message || 'Failed to fetch data',
          details: `Endpoint: ${urlPath}`
        });
      }
      if (onError) onError(error);
      return null;
    }
  }, [makeApiCall, addError]);

  const apiDelete = useCallback(async (data, urlPath, options = {}) => {
    const { onSuccess, onError, showErrorToUser = true } = options;
    
    try {
      const response = await makeApiCall(deleteData, data, urlPath);
      if (!response) return null;

      return await handleApiResponse(response, onSuccess, onError);
    } catch (error) {
      if (showErrorToUser) {
        addError({
          message: error.message || 'Failed to delete data',
          details: `Endpoint: ${urlPath}`
        });
      }
      if (onError) onError(error);
      return null;
    }
  }, [makeApiCall, addError]);

  const apiPatch = useCallback(async (data, urlPath, options = {}) => {
    const { onSuccess, onError, showErrorToUser = true } = options;
    
    try {
      const response = await makeApiCall(patchData, data, urlPath);
      if (!response) return null;

      return await handleApiResponse(response, onSuccess, onError);
    } catch (error) {
      if (showErrorToUser) {
        addError({
          message: error.message || 'Failed to update data',
          details: `Endpoint: ${urlPath}`
        });
      }
      if (onError) onError(error);
      return null;
    }
  }, [makeApiCall, addError]);

  const apiPut = useCallback(async (data, urlPath, options = {}) => {
    const { onSuccess, onError, showErrorToUser = true } = options;
    
    try {
      const response = await makeApiCall(putData, data, urlPath);
      if (!response) return null;

      return await handleApiResponse(response, onSuccess, onError);
    } catch (error) {
      if (showErrorToUser) {
        addError({
          message: error.message || 'Failed to update data',
          details: `Endpoint: ${urlPath}`
        });
      }
      if (onError) onError(error);
      return null;
    }
  }, [makeApiCall, addError]);

  const apiPostAuth = useCallback(async (data, urlPath, options = {}) => {
    const { onSuccess, onError, showErrorToUser = true } = options;
    
    try {
      const response = await makeApiCall(postDataAuth, data, urlPath);
      if (!response) return null;

      return await handleApiResponse(response, onSuccess, onError);
    } catch (error) {
      if (showErrorToUser) {
        addError({
          message: error.message || 'Authentication failed',
          details: `Endpoint: ${urlPath}`
        });
      }
      if (onError) onError(error);
      return null;
    }
  }, [makeApiCall, addError]);

  return {
    // State
    isLoading,
    
    // API methods
    apiPost,
    apiGet,
    apiDelete,
    apiPatch,
    apiPut,
    apiPostAuth,
    
    // Raw API call for custom handling
    makeApiCall
  };
};

export default useApi;