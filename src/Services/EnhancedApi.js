import { BASE_URL } from "../pages/helper";

// Error context reference (will be set by the provider)
let errorContextRef = null;

// Set error context reference
export const setErrorContext = (context) => {
  errorContextRef = context;
};

// Enhanced fetch wrapper with error handling
async function enhancedFetch(url, options = {}, endpoint = '', method = 'GET') {
  try {
    // Set loading state if error context is available
    if (errorContextRef) {
      errorContextRef.setLoading(true);
    }

    const response = await fetch(url, options);
    
    // Handle API errors if error context is available
    if (errorContextRef) {
      const wasHandled = errorContextRef.handleApiError(response, endpoint, method);
      if (wasHandled && response.status === 403) {
        // Return a special response object for 403 errors
        return {
          ...response,
          isUnauthorized: true,
          json: async () => ({ 
            Status: 403, 
            Message: 'Unauthorized access',
            error_message: 'You are not authorized to access this resource' 
          })
        };
      }
      if (wasHandled && response.status === 401) {
        // Return a special response object for 401 errors
        return {
          ...response,
          isAuthenticated: false,
          json: async () => ({ 
            Status: 401, 
            Message: 'Authentication required',
            error_message: 'Your session has expired. Please log in again.' 
          })
        };
      }
    }

    return response;
  } catch (error) {
    // Handle network errors
    if (errorContextRef) {
      errorContextRef.addNetworkError({
        message: 'Network error occurred. Please check your connection.',
        details: error.message
      });
    }
    throw error;
  } finally {
    // Clear loading state
    if (errorContextRef) {
      errorContextRef.setLoading(false);
    }
  }
}

export async function postData(data, urlPath) {
  console.log(urlPath, localStorage.getItem("token"), "Path");
  
  const options = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Origin: process.env.ORIGIN,
      Authorization: "Bearer " + localStorage?.getItem("token"),
      host: BASE_URL,
      Accept: "*/*",
    },
    body: JSON.stringify(data),
  };

  return await enhancedFetch(BASE_URL + urlPath, options, urlPath, 'POST');
}

export async function deleteData(data, urlPath) {
  const options = {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Origin: process.env.ORIGIN,
      Authorization: "Bearer " + localStorage.getItem("token"),
      host: BASE_URL,
      Accept: "*/*",
    },
    body: JSON.stringify(data),
  };

  return await enhancedFetch(BASE_URL + urlPath, options, urlPath, 'DELETE');
}

export async function patchData(data, urlPath) {
  const options = {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Origin: process.env.ORIGIN,
      Authorization: "Bearer " + localStorage.getItem("token"),
      host: BASE_URL,
      Accept: "*/*",
    },
    body: JSON.stringify(data),
  };

  return await enhancedFetch(BASE_URL + urlPath, options, urlPath, 'PATCH');
}

export async function postDataAuth(data, urlPath) {
  const options = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Origin: process.env.ORIGIN,
      Authorization: "Bearer " + localStorage.getItem("token"), // Fixed: was setItem
      host: BASE_URL,
      Accept: "*/*",
    },
    body: JSON.stringify(data),
  };

  return await enhancedFetch(BASE_URL + urlPath, options, urlPath, 'POST');
}

export async function getData(urlPath) {
  let accessTokenKey = "";
  accessTokenKey = localStorage.getItem("token");
  
  const options = {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessTokenKey,
    },
  };

  return await enhancedFetch(BASE_URL + urlPath, options, urlPath, 'GET');
}

// New enhanced functions with better error handling
export async function putData(data, urlPath) {
  const options = {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Origin: process.env.ORIGIN,
      Authorization: "Bearer " + localStorage.getItem("token"),
      host: BASE_URL,
      Accept: "*/*",
    },
    body: JSON.stringify(data),
  };

  return await enhancedFetch(BASE_URL + urlPath, options, urlPath, 'PUT');
}

// Utility function to check if response is unauthorized
export const isUnauthorizedResponse = (response) => {
  return response && response.isUnauthorized === true;
};

// Utility function to check if response is unauthenticated
export const isUnauthenticatedResponse = (response) => {
  return response && response.isAuthenticated === false;
};

// Utility function to handle response with automatic error detection
export const handleApiResponse = async (response, onSuccess, onError) => {
  try {
    if (isUnauthenticatedResponse(response)) {
      // 401 error is already handled by the error context (redirects to login)
      if (onError) {
        onError(new Error('Authentication required'));
      }
      return null;
    }

    if (isUnauthorizedResponse(response)) {
      // 403 error is already handled by the error context
      if (onError) {
        onError(new Error('Unauthorized access'));
      }
      return null;
    }

    const data = await response.json();
    
    if (response.ok && data.Status === 200) {
      if (onSuccess) {
        onSuccess(data);
      }
      return data;
    } else {
      const error = new Error(data.error_message || data.Message || 'API request failed');
      if (onError) {
        onError(error);
      }
      throw error;
    }
  } catch (error) {
    if (onError) {
      onError(error);
    }
    throw error;
  }
};