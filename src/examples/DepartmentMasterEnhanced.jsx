import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { department } from '../../Services/service';
import Swal from 'sweetalert2';

const DepartmentMasterEnhanced = () => {
  const [data, setData] = useState({
    departmentName: '',
    description: ''
  });
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorShow, setErrorShow] = useState(false);

  // Use the new API hook instead of direct API calls
  const { apiGet, apiPost, isLoading } = useApi();

  // Enhanced data fetching with automatic error handling
  const fetchDepartments = async () => {
    const result = await apiGet(department, {
      onSuccess: (response) => {
        if (response.Status === 200) {
          setDepartments(response.Data || []);
        }
      },
      onError: (error) => {
        console.error('Failed to fetch departments:', error);
        // Error is automatically handled by the error context
        // No need for manual error display
      }
    });
  };

  // Enhanced form submission with automatic error handling
  const submitHandler = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!data.departmentName.trim()) {
      setErrors({ departmentName: 'Department name is required' });
      setErrorShow(true);
      return;
    }

    // Clear local errors
    setErrors({});
    setErrorShow(false);

    const result = await apiPost(data, '/department/saveDepartment', {
      onSuccess: (response) => {
        if (response.Status === 200) {
          Swal.fire('Success!', 'Department added successfully!', 'success');
          
          // Reset form
          setData({
            departmentName: '',
            description: ''
          });
          
          // Refresh department list
          fetchDepartments();
        }
      },
      onError: (error) => {
        // Handle specific validation errors from API
        if (error.message.includes('validation')) {
          Swal.fire('Validation Error', error.message, 'error');
        }
        // Other errors are handled automatically by the error context
      }
    });
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear field-specific errors
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
      if (Object.keys(errors).length === 1) {
        setErrorShow(false);
      }
    }
  };

  const handleKeyPress = (event) => {
    const { key } = event;
    if (/^\s+$/.test(key) && event.target.value.trim() === "") {
      event.preventDefault();
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(key)) {
      event.preventDefault();
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="container">
      <h4>Department Master - Enhanced</h4>
      <hr />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label htmlFor="departmentName">Department Name *</label>
              <input
                type="text"
                className={`form-control ${errorShow && errors.departmentName ? 'is-invalid' : ''}`}
                id="departmentName"
                name="departmentName"
                value={data.departmentName}
                onChange={inputChangeHandler}
                onKeyPress={handleKeyPress}
                placeholder="Enter department name"
                disabled={isLoading}
              />
              {errorShow && errors.departmentName && (
                <div className="invalid-feedback">
                  {errors.departmentName}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={data.description}
                onChange={inputChangeHandler}
                placeholder="Enter description (optional)"
                rows="3"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Department'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary ml-2"
                onClick={() => {
                  setData({ departmentName: '', description: '' });
                  setErrors({});
                  setErrorShow(false);
                }}
                disabled={isLoading}
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="col-md-6">
          <h5>Existing Departments</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? (
                  departments.map((dept, index) => (
                    <tr key={dept.id || index}>
                      <td>{dept.id || index + 1}</td>
                      <td>{dept.departmentName}</td>
                      <td>{dept.description || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      {isLoading ? 'Loading departments...' : 'No departments found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Benefits of Enhanced Error Handling */}
      <div className="mt-4">
        <div className="alert alert-info">
          <h6>🚀 Enhanced Features:</h6>
          <ul className="mb-0">
            <li><strong>Automatic 403 Error Handling:</strong> If the API returns a 403 error, a user-friendly modal will appear automatically</li>
            <li><strong>Loading States:</strong> Automatic loading indicators and disabled forms during API calls</li>
            <li><strong>Network Error Handling:</strong> Connection issues are handled gracefully with appropriate user feedback</li>
            <li><strong>Error Recovery:</strong> Users can retry failed operations easily</li>
            <li><strong>Consistent UX:</strong> All error handling follows the same pattern across the application</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DepartmentMasterEnhanced;