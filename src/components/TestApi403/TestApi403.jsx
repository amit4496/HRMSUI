import React, { useState } from 'react';
import { getData, postData } from '../../Services/Api';
import { useError } from '../../contexts/ErrorContext';

const TestApi403 = () => {
  const [testResult, setTestResult] = useState('');
  const { setUnauthorizedError, clearUnauthorizedError } = useError();

  // Test 1: Manual 403 error trigger
  const testManual403 = () => {
    setUnauthorizedError({
      message: 'Manual test: You are not authorized to access this resource',
      endpoint: '/test/manual',
      method: 'GET'
    });
    setTestResult('Manual 403 error triggered - check if modal appears');
  };

  // Test 2: Simulate API call that returns 403
  const testApi403 = async () => {
    try {
      // This will likely return 403 if you don't have proper authorization
      const response = await getData('/admin/sensitive-data');
      const data = await response.json();
      setTestResult(`API Response: ${JSON.stringify(data)}`);
    } catch (error) {
      setTestResult(`API Error: ${error.message}`);
    }
  };

  // Test 3: Clear the 403 error
  const clearError = () => {
    clearUnauthorizedError();
    setTestResult('Cleared 403 error');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '20px', borderRadius: '8px' }}>
      <h3>🧪 403 Error Testing Component</h3>
      <p>Use these buttons to test the 403 error handling:</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testManual403}
          style={{ 
            backgroundColor: '#e74c3c', 
            color: 'white', 
            padding: '10px 15px', 
            margin: '5px', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🚨 Trigger Manual 403 Error
        </button>
        
        <button 
          onClick={testApi403}
          style={{ 
            backgroundColor: '#f39c12', 
            color: 'white', 
            padding: '10px 15px', 
            margin: '5px', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📡 Test Real API Call (may 403)
        </button>
        
        <button 
          onClick={clearError}
          style={{ 
            backgroundColor: '#27ae60', 
            color: 'white', 
            padding: '10px 15px', 
            margin: '5px', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✅ Clear 403 Error
        </button>
      </div>
      
      {testResult && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          <strong>Test Result:</strong> {testResult}
        </div>
      )}
      
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#e8f5e8',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>Expected Behavior:</strong>
        <ul>
          <li>When you click "Trigger Manual 403 Error", a modal should appear with the unauthorized access message</li>
          <li>The modal should have "Try Again" and "Go to Dashboard" buttons</li>
          <li>Clicking "Clear 403 Error" should remove the modal</li>
          <li>Any real API calls returning 403 should automatically trigger the same modal</li>
        </ul>
      </div>
    </div>
  );
};

export default TestApi403;