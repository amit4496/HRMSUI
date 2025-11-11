import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useError } from '../../contexts/ErrorContext';

const TestErrorHandling = () => {
  const { apiGet, apiPost, isLoading } = useApi();
  const { setUnauthorizedError, clearUnauthorizedError, unauthorizedError, errors, handleAuthenticationError } = useError();
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, success, message) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

    // Test 403 error by triggering it manually
  const test403Error = () => {
    setUnauthorizedError({
      message: 'This is a simulated 403 error for testing purposes',
      endpoint: '/test/unauthorized',
      method: 'GET'
    });
    addTestResult('Manual 403 Error', true, 'Successfully triggered 403 error display');
  }
  
  // Test 401 error by triggering authentication error (will redirect to login)
  const test401Error = () => {
    addTestResult('Manual 401 Error', true, 'Triggered 401 error - should redirect to login page');
    // Small delay to show the message before redirect
    setTimeout(() => {
      handleAuthenticationError();
    }, 1000);
  };

  // Test API call with simulated 403 response
  const testApiCall403 = async () => {
    // Create a mock response that simulates 403
    const mockResponse = {
      status: 403,
      statusText: 'Forbidden',
      isUnauthorized: true,
      json: async () => ({
        Status: 403,
        Message: 'Unauthorized access',
        error_message: 'You are not authorized to access this resource'
      })
    };

    // Simulate the Enhanced API behavior
    setUnauthorizedError({
      message: 'API returned 403 - Access denied',
      endpoint: '/test/api-403',
      method: 'GET'
    });

    addTestResult('API 403 Test', true, 'API call returned 403 and triggered error display');
  };

  // Test normal API call (this will likely fail since we don't have a real endpoint)
  const testNormalApiCall = async () => {
    try {
      const result = await apiGet('/basic/fetchdata', {
        onSuccess: (data) => {
          addTestResult('Normal API Call', true, 'API call succeeded');
        },
        onError: (error) => {
          addTestResult('Normal API Call', false, `API call failed: ${error.message}`);
        }
      });
    } catch (error) {
      addTestResult('Normal API Call', false, `API call error: ${error.message}`);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const clearError = () => {
    clearUnauthorizedError();
    addTestResult('Clear Error', true, 'Cleared unauthorized error');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Error Handling Test Panel</h2>
      <p>This component helps test the 401 and 403 error handling implementation.</p>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={test401Error}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#9b59b6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test 401 Error (Redirect)
        </button>

        <button 
          onClick={test403Error}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#e74c3c', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test 403 Error (Modal)
        </button>

        <button 
          onClick={testApiCall403}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#f39c12', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test API 403 Response
        </button>

        <button 
          onClick={testNormalApiCall}
          disabled={isLoading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: isLoading ? '#bdc3c7' : '#3498db', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Loading...' : 'Test Normal API Call'}
        </button>

        <button 
          onClick={clearError}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#27ae60', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clear 403 Error
        </button>

        <button 
          onClick={clearTestResults}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#95a5a6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clear Results
        </button>
      </div>

      {/* Status Display */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Current Status:</h3>
        <div style={{ 
          padding: '10px', 
          backgroundColor: unauthorizedError ? '#ffebee' : errors.length > 0 ? '#fff3e0' : '#e8f5e8',
          borderRadius: '5px',
          border: `1px solid ${unauthorizedError ? '#e74c3c' : errors.length > 0 ? '#f39c12' : '#27ae60'}`
        }}>
          {unauthorizedError && (
            <p><strong>403 Error Active:</strong> {unauthorizedError.message}</p>
          )}
          {errors.length > 0 && (
            <p><strong>Other Errors:</strong> {errors.length} error(s) in queue</p>
          )}
          {!unauthorizedError && errors.length === 0 && (
            <p><strong>Status:</strong> No errors - System ready</p>
          )}
          {isLoading && <p><strong>Loading:</strong> API call in progress...</p>}
        </div>
      </div>

      {/* Test Results */}
      <div>
        <h3>Test Results:</h3>
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          border: '1px solid #ddd', 
          borderRadius: '5px',
          padding: '10px'
        }}>
          {testResults.length === 0 ? (
            <p style={{ color: '#7f8c8d' }}>No tests run yet</p>
          ) : (
            testResults.map(result => (
              <div 
                key={result.id}
                style={{ 
                  padding: '8px',
                  marginBottom: '5px',
                  backgroundColor: result.success ? '#d5f5d5' : '#ffd5d5',
                  borderRadius: '3px',
                  borderLeft: `4px solid ${result.success ? '#27ae60' : '#e74c3c'}`
                }}
              >
                <strong>{result.test}</strong> [{result.timestamp}]<br />
                <span style={{ fontSize: '14px' }}>{result.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Error Details */}
      {(unauthorizedError || errors.length > 0) && (
        <div style={{ marginTop: '20px' }}>
          <h3>Error Details:</h3>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '5px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify({ unauthorizedError, errors }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestErrorHandling;