import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { getData, postData, deleteData } from "../../../Services/Api";
import { 
  get_employee_roles, 
  post_employee_role, 
  put_employee_roles, 
  delete_employee_role,
  get_roles 
} from "../../../Services/service";
import { Button, Modal, Form, Row, Col, Badge, ListGroup, Alert } from "react-bootstrap";
import axios from "axios";
import { Trash2, Plus, Edit, Settings, User, UserCheck } from "lucide-react";
import { BASE_URL } from "../../helper";

const UserRoleMaster = () => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);

  // Helper function to get the correct employee ID field
  const getEmployeeId = (userData) => {
    // Primary field from /employees/roles API response is 'id'
    return userData?.id || userData?.employeeId || userData?.empId || userData?.employee_id || userData?.emp_id;
  };

  // Helper function to get the correct employee name field
  const getEmployeeName = (userData) => {
    // Try different possible field names for employee name
    return userData?.employeeName || userData?.name || userData?.fullName || userData?.empName || userData?.employee_name;
  };
  
  // Role management states
  const [roleData, setRoleData] = useState({
    selectedRoleId: "",
    copyModules: false,
  });
  const [roleErrors, setRoleErrors] = useState({
    selectedRoleId: "",
  });
  const [editingRole, setEditingRole] = useState(null);
  const [bulkUpdate, setBulkUpdate] = useState(false);
  const [pendingRoleChanges, setPendingRoleChanges] = useState([]);

  const roleInputChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setRoleData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setRoleErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const submitRoleHandler = async (e) => {
    e.preventDefault();
    
    if (!roleData.selectedRoleId) {
      swal("Error", "Please select a role", "error");
      return;
    }

    // Find the selected role from available roles
    const selectedRole = availableRoles.find(role => role.roleId == roleData.selectedRoleId);
    if (!selectedRole) {
      swal("Error", "Selected role not found", "error");
      return;
    }

    // Check if role is already assigned to this user
    const isAlreadyAssigned = selectedUserRoles.some(role => role.roleId == selectedRole.roleId);
    if (isAlreadyAssigned && !editingRole) {
      swal("Error", "This role is already assigned to this user", "error");
      return;
    }

    try {
      const empId = getEmployeeId(selectedUser);
      console.log("Using employee ID:", empId, "for user:", selectedUser);
      
      if (!empId) {
        swal("Error", "Employee ID not found", "error");
        return;
      }
      
      let apiEndpoint = post_employee_role.replace('{id}', empId);
      let updatedRoles;

      if (editingRole) {
        // Update existing role assignment
        updatedRoles = selectedUserRoles.map(role => 
          role.roleId === editingRole.roleId 
            ? { 
                roleId: selectedRole.roleId,
                roleName: selectedRole.roleName
              }
            : role
        );
        apiEndpoint = put_employee_roles.replace('{id}', empId);
      } else {
        // Add new role assignment
        updatedRoles = [...selectedUserRoles, {
          roleId: selectedRole.roleId,
          roleName: selectedRole.roleName
        }];
      }

      // Use PUT for bulk update approach - send all roles for the user
      const roleUpdateData = {
        employeeId: empId,
        roles: updatedRoles,
        copyModules: roleData.copyModules
      };

      const resp = await postData(roleUpdateData, put_employee_roles.replace('{id}', empId));
      const res = await resp.json();

      if (res.Status === 200) {
        swal("Success", editingRole ? "Role Updated Successfully" : "Role Added Successfully", "success");
        setSelectedUserRoles(updatedRoles);
        resetRoleForm();
        FetchData(); // Refresh the main data
        updateFilteredRoles(updatedRoles); // Update available roles
      } else {
        swal("Error", "Failed to save role assignment", "error");
      }
    } catch (err) {
      console.log(err);
      swal("Error", "Failed to save role assignment. Please try again.", "error");
    }
  };

  const submitBulkRoleUpdate = async () => {
    if (pendingRoleChanges.length === 0) {
      swal("Error", "No changes to save", "error");
      return;
    }

    try {
      const empId = getEmployeeId(selectedUser);
      console.log("Bulk update using employee ID:", empId);
      
      if (!empId) {
        swal("Error", "Employee ID not found", "error");
        return;
      }
      
      const roleUpdateData = {
        employeeId: empId,
        roles: pendingRoleChanges,
        copyModules: roleData.copyModules
      };

      const resp = await postData(roleUpdateData, put_employee_roles.replace('{id}', empId));
      const res = await resp.json();

      if (res.Status === 200) {
        swal("Success", "All role assignments updated successfully", "success");
        setSelectedUserRoles(pendingRoleChanges);
        setPendingRoleChanges([]);
        setBulkUpdate(false);
        FetchData();
        updateFilteredRoles(pendingRoleChanges);
      } else {
        swal("Error", "Failed to update role assignments", "error");
      }
    } catch (err) {
      console.log(err);
      swal("Error", "Failed to update role assignments. Please try again.", "error");
    }
  };

  const resetRoleForm = () => {
    setRoleData({
      selectedRoleId: "",
      copyModules: false,
    });
    setRoleErrors({
      selectedRoleId: "",
    });
    setEditingRole(null);
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success m-3",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const FetchData = () => {
    getData(get_employee_roles)
      .then((response) => response.json())
      .then((res) => {
        console.log("Employee Roles API Response:", res);
        // Handle direct array response or response with Status/Data structure
        let employeeData = [];
        if (Array.isArray(res)) {
          employeeData = res;
        } else if (res.Status === 200) {
          employeeData = res?.Data || [];
        } else {
          employeeData = res || [];
        }
        
        // Debug: Log the first employee record to see field structure
        if (employeeData.length > 0) {
          console.log("First employee record fields:", Object.keys(employeeData[0]));
          console.log("First employee record:", employeeData[0]);
        }
        
        setTicketDetails(employeeData);
      })
      .catch((err) => {
        console.error(err);
        swal("Error", "Failed to fetch employee roles", "error");
      });
  };

  const FetchAvailableRoles = () => {
    getData(get_roles)
      .then((response) => response.json())
      .then((res) => {
        console.log("Available Roles Response:", res);
        
        // Handle direct array response or response with Status/Data structure
        if (Array.isArray(res)) {
          setAvailableRoles(res);
        } else if (res.Status === 200) {
          setAvailableRoles(res?.Data || []);
        } else {
          setAvailableRoles(res || []);
        }
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
        swal("Error", "Failed to fetch available roles", "error");
      });
  };

  const updateFilteredRoles = (currentUserRoles) => {
    console.log("updateFilteredRoles called with:", currentUserRoles);
    console.log("availableRoles:", availableRoles);
    
    // Filter out already assigned roles
    const assignedRoleIds = currentUserRoles.map(role => role.roleId);
    console.log("assignedRoleIds:", assignedRoleIds);
    
    const filtered = (availableRoles || [])?.filter(role => !assignedRoleIds.includes(role.roleId));
    console.log("filtered roles:", filtered);
    
    setFilteredRoles(filtered);
  };

  useEffect(() => {
    FetchData();
    FetchAvailableRoles();
  }, []);

  useEffect(() => {
    // Update filtered roles when available roles or selected user roles change
    console.log("useEffect triggered - availableRoles:", availableRoles);
    console.log("useEffect triggered - selectedUserRoles:", selectedUserRoles);
    
    if (availableRoles.length > 0) {
      updateFilteredRoles(selectedUserRoles);
      console.log("After updateFilteredRoles - filteredRoles will be updated");
    }
  }, [availableRoles, selectedUserRoles]);

  const handleManageRoles = (userData) => {
    console.log("handleManageRoles called with userData:", userData);
    console.log("Available fields in userData:", Object.keys(userData));
    console.log("Employee ID (using helper):", getEmployeeId(userData));
    console.log("Employee Name (using helper):", getEmployeeName(userData));
    setSelectedUser(userData);
    const currentRoles = userData.roles || [];
    console.log("currentRoles:", currentRoles);
    setSelectedUserRoles(currentRoles);
    setPendingRoleChanges([...currentRoles]); // Initialize pending changes
    updateFilteredRoles(currentRoles);
    setShowRoleModal(true);
  };

  const handleEditRole = (role) => {
    setRoleData({
      selectedRoleId: role.roleId,
    });
    setEditingRole(role);
  };

  const handleDeleteRole = async (roleId) => {
    if (bulkUpdate) {
      // In bulk mode, just update pending changes
      const updatedRoles = pendingRoleChanges.filter(role => role.roleId !== roleId);
      setPendingRoleChanges(updatedRoles);
      updateFilteredRoles(updatedRoles);
      return;
    }

    const result = await Swal.fire({
      title: "Delete Role Assignment",
      html: `
        <div class="text-start">
          <p>Are you sure you want to remove this role assignment?</p>
          <div class="form-check mt-3">
            <input class="form-check-input" type="checkbox" id="removeRoleModules">
            <label class="form-check-label" for="removeRoleModules">
              Also remove role modules
            </label>
            <div class="form-text">Check this to remove modules associated with this role</div>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      preConfirm: () => {
        const checkbox = document.getElementById('removeRoleModules');
        return {
          removeRoleModules: checkbox.checked
        };
      }
    });

    if (result.isConfirmed) {
      try {
        const empId = getEmployeeId(selectedUser);
        console.log("Delete role using employee ID:", empId);
        console.log("Remove role modules:", result.value.removeRoleModules);
        
        if (!empId) {
          swal("Error", "Employee ID not found", "error");
          return;
        }
        
        // Use individual DELETE API for single role removal
        const deleteEndpoint = delete_employee_role
          .replace('{id}', empId);
        
        const deleteData = { 
          roleId: roleId,
          removeRoleModules: result.value.removeRoleModules
        };
        
        const resp = await fetch(`${BASE_URL}${deleteEndpoint}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(deleteData)
        });
        
        const res = await resp.json();

        if (res.Status === 200) {
          swal("Success", "Role assignment deleted successfully", "success");
          const updatedRoles = selectedUserRoles.filter(role => role.roleId !== roleId);
          setSelectedUserRoles(updatedRoles);
          FetchData();
          updateFilteredRoles(updatedRoles);
        } else {
          swal("Error", "Failed to delete role assignment", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        swal("Error", "Failed to delete role assignment", "error");
      }
    }
  };

  const handleBulkModeToggle = () => {
    setBulkUpdate(!bulkUpdate);
    if (!bulkUpdate) {
      setPendingRoleChanges([...selectedUserRoles]);
    } else {
      setPendingRoleChanges([]);
    }
  };

  const addRoleToPending = () => {
    if (!roleData.selectedRoleId) {
      swal("Error", "Please select a role", "error");
      return;
    }

    const selectedRole = availableRoles.find(role => role.roleId == roleData.selectedRoleId);
    if (!selectedRole) {
      swal("Error", "Selected role not found", "error");
      return;
    }

    const isAlreadyInPending = pendingRoleChanges.some(role => role.roleId == selectedRole.roleId);
    if (isAlreadyInPending) {
      swal("Error", "This role is already in pending changes", "error");
      return;
    }

    const updatedPending = [...pendingRoleChanges, {
      roleId: selectedRole.roleId,
      roleName: selectedRole.roleName
    }];

    setPendingRoleChanges(updatedPending);
    updateFilteredRoles(updatedPending);
    resetRoleForm();
  };

  return (
    <>
      <div className="container">
        <div className="d-flex">
          <h3>User Role Master</h3>
        </div>
        <hr />
        <h6>Manage User Role Assignments</h6>

        <MaterialTable
          style={{ width: "100%", maxWidth: "100%" }}
          title="Employee Role Assignments"
          data={ticketDetails}
          columns={[
            {
              title: "Employee ID",
              field: "id",
              width: "10%",
              render: (rowData) => getEmployeeId(rowData)
            },
            {
              title: "Employee Name",
              field: "employeeName",
              width: "20%",
              render: (rowData) => getEmployeeName(rowData) || 'N/A'
            },
            {
              title: "Email",
              field: "email",
              width: "20%"
            },
            {
              title: "Roles Assigned",
              field: "roles",
              width: "30%",
              render: (rowData) => (
                <div>
                  {rowData.roles && rowData.roles.length > 0 ? (
                    <div>
                      <Badge bg="success" className="me-1">
                        {rowData.roles.length} role(s)
                      </Badge>
                      <div className="mt-1" style={{ fontSize: "12px" }}>
                        {rowData.roles.slice(0, 3).map((role, index) => (
                          <Badge key={role.roleId} bg="outline-primary" className="me-1 mb-1">
                            {role.roleName}
                          </Badge>
                        ))}
                        {rowData.roles.length > 3 && (
                          <div><em>... and {rowData.roles.length - 3} more</em></div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Badge bg="warning">No roles assigned</Badge>
                  )}
                </div>
              ),
            },
            {
              title: "Manage Roles",
              field: "manageRoles",
              width: "20%",
              render: (rowData) => (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleManageRoles(rowData)}
                >
                  <UserCheck size={16} /> Manage Roles
                </Button>
              ),
            },
          ]}
        />
      </div>

      {/* Role Management Modal */}
      <div className="container">
        <Modal show={showRoleModal} onHide={() => {
          setShowRoleModal(false);
          resetRoleForm();
          setBulkUpdate(false);
          setPendingRoleChanges([]);
        }} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              <User size={20} className="me-2" />
              Manage Roles for: {getEmployeeName(selectedUser) || 'Employee'} ({getEmployeeId(selectedUser) || 'Unknown ID'})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Bulk Update Toggle */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <Form.Check
                  type="switch"
                  id="bulk-update-switch"
                  label="Bulk Update Mode"
                  checked={bulkUpdate}
                  onChange={handleBulkModeToggle}
                />
                <small className="text-muted">
                  {bulkUpdate ? "Make multiple changes and save all at once" : "Changes are saved immediately"}
                </small>
              </div>
              {bulkUpdate && pendingRoleChanges.length > 0 && (
                <Button variant="success" onClick={submitBulkRoleUpdate}>
                  Save All Changes ({pendingRoleChanges.length} roles)
                </Button>
              )}
            </div>

            {/* Pending Changes Alert */}
            {bulkUpdate && pendingRoleChanges.length !== selectedUserRoles.length && (
              <Alert variant="info">
                <strong>Pending Changes:</strong> You have unsaved changes. 
                Current roles: {selectedUserRoles.length}, Pending: {pendingRoleChanges.length}
              </Alert>
            )}

            {/* Add/Edit Role Form */}
            <div className="border p-3 mb-3 bg-light">
              <h6>{editingRole ? 'Edit Role Assignment' : 'Add New Role Assignment'}</h6>
              <Form>
                <Row>
                  <Col md={bulkUpdate ? 8 : 12}>
                    <Form.Group controlId="selectedRoleId">
                      <Form.Label>Select Role <span style={{ color: "red" }}>*</span></Form.Label>
                      <Form.Select
                        name="selectedRoleId"
                        value={roleData.selectedRoleId}
                        onChange={roleInputChangeHandler}
                        disabled={editingRole ? true : false}
                      >
                        <option value="">-- Select a Role --</option>
                        {editingRole ? (
                          // When editing, show all roles including currently selected one
                          availableRoles.map((role) => (
                            <option key={role.roleId} value={role.roleId}>
                              {role.roleName}
                            </option>
                          ))
                        ) : (
                          // When adding, show only unassigned roles
                          filteredRoles.map((role) => (
                            <option key={role.roleId} value={role.roleId}>
                              {role.roleName}
                            </option>
                          ))
                        )}
                      </Form.Select>
                      {roleErrors.selectedRoleId && (
                        <span className="text-danger">{roleErrors.selectedRoleId}</span>
                      )}
                    </Form.Group>
                  </Col>
                  {bulkUpdate && (
                    <Col md={4} className="d-flex align-items-end">
                      <Button variant="outline-primary" onClick={addRoleToPending} className="w-100">
                        <Plus size={16} /> Add to Pending
                      </Button>
                    </Col>
                  )}
                </Row>

                {/* Copy Modules Checkbox */}
                <Row className="mt-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        id="copyModules"
                        name="copyModules"
                        checked={roleData.copyModules}
                        onChange={roleInputChangeHandler}
                        label="Copy modules from existing roles"
                      />
                      <Form.Text className="text-muted">
                        Backend will handle module copying logic based on this flag
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* Show preview of selected role */}
                {roleData.selectedRoleId && (
                  <Row className="mt-3">
                    <Col md={12}>
                      <div className="alert alert-info">
                        <strong>Selected Role Preview:</strong>
                        {(() => {
                          const selected = availableRoles.find(role => role.roleId == roleData.selectedRoleId);
                          return selected ? (
                            <div>
                              <div><strong>Role:</strong> {selected.roleName}</div>
                              <div><strong>Role ID:</strong> {selected.roleId}</div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </Col>
                  </Row>
                )}

                {!bulkUpdate && (
                  <div className="mt-2">
                    <Button variant="primary" onClick={submitRoleHandler} className="me-2">
                      {editingRole ? 'Update Role Assignment' : 'Add Role Assignment'}
                    </Button>
                    {editingRole && (
                      <Button variant="secondary" onClick={resetRoleForm}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                )}
              </Form>
            </div>

            {/* Current/Pending Roles List */}
            <div>
              <h6>
                {bulkUpdate ? `Pending Role Assignments (${pendingRoleChanges.length})` : `Current Role Assignments (${selectedUserRoles.length})`}
              </h6>
              {(bulkUpdate ? pendingRoleChanges : selectedUserRoles).length === 0 ? (
                <div className="text-muted">No roles assigned to this user</div>
              ) : (
                <ListGroup>
                  {(bulkUpdate ? pendingRoleChanges : selectedUserRoles).map((role) => (
                    <ListGroup.Item key={role.roleId} className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{role.roleName}</div>
                        <small className="text-muted">Role ID: {role.roleId}</small>
                      </div>
                      <div>
                        {!bulkUpdate && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit size={14} />
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteRole(role.roleId)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowRoleModal(false);
              resetRoleForm();
              setBulkUpdate(false);
              setPendingRoleChanges([]);
            }}>
              Close
            </Button>
            {bulkUpdate && (
              <Button variant="success" onClick={submitBulkRoleUpdate}>
                Save All Changes
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default UserRoleMaster;