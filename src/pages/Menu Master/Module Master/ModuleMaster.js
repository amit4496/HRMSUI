import { useState, useEffect, useCallback } from "react";
import MaterialTable from "@material-table/core";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { getData, postData, deleteData } from "../../../Services/Api";
import { 
  get_roles,
  save_role_modules,
  get_all_role_modules,
  delete_role_modules
} from "../../../Services/service";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Trash2, Plus } from "lucide-react";
import { BASE_URL } from "../../helper";

const ModuleMaster = () => {
  const [data, setData] = useState({
    module_id: "",
    controller_name: "",
    controller_url: "",
    roleIds: [], // For many-to-many relationship
  });
  const [errors, setErrors] = useState({
    module_id: "",
    controller_name: "",
    controller_url: "",
  });
  const [errorShow, setErrorShow] = useState(false);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedModuleRoles, setSelectedModuleRoles] = useState([]);
  const [editData, setEditData] = useState({
    id: "",
    controller_name: "",
    controller_url: "",
  });

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleModule = (event) => {
    const { key } = event;

    // Block input that consists of spaces only for module_id
    if (event.target.name === 'module_id' && /^\s+$/.test(key) && event.target.value.trim() === "") {
      event.preventDefault();
      return;
    }

    // Allow alphanumeric and special characters for URLs and controller names
    if (event.target.name === 'controller_url' || event.target.name === 'controller_name') {
      // Allow more characters for URLs and controller names
      if (!/^[a-zA-Z0-9\s/_.-]+$/.test(key)) {
        event.preventDefault();
      }
    } else if (event.target.name === 'module_id') {
      // More restrictive for module ID
      if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
        event.preventDefault();
      }
    }
  };

  const handleRoleSelection = (roleId) => {
    setData((prevData) => {
      const updatedRoleIds = prevData.roleIds.includes(roleId)
        ? prevData.roleIds.filter(id => id !== roleId)
        : [...prevData.roleIds, roleId];
      return {
        ...prevData,
        roleIds: updatedRoleIds
      };
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    // Validation
    if (!data.module_id || !data.controller_name || !data.controller_url) {
      swal("Error", "Please fill all required fields", "error");
      return;
    }

    // Validate that at least one role is selected
    if (!data.roleIds || data.roleIds.length === 0) {
      swal("Error", "Please select at least one role", "error");
      return;
    }

    try {
      // Create module-role assignments directly using roleModule API
      // Each role gets its own entry with this module
      const successfulAssignments = [];
      const failedAssignments = [];

      for (const roleId of data.roleIds) {
        try {
          const roleModuleUrl = `${save_role_modules}?roleId=${roleId}&moduleIds=${data.module_id}&controllerName=${encodeURIComponent(data.controller_name)}&controllerUrl=${encodeURIComponent(data.controller_url)}`;

          const roleResponse = await postData({}, roleModuleUrl);
          const roleResult = await roleResponse.json();
          
          if (roleResult.Status === 201 || roleResult.Status === 200) {
            successfulAssignments.push(roleId);
          } else {
            failedAssignments.push({ roleId, message: roleResult.Message });
            console.warn(`Failed to assign module to role ${roleId}: ${roleResult.Message}`);
          }
        } catch (error) {
          failedAssignments.push({ roleId, message: error.message });
          console.error(`Error assigning module to role ${roleId}:`, error);
        }
      }

      if (successfulAssignments.length > 0) {
        let message = "Module Permission Added Successfully";
        if (failedAssignments.length > 0) {
          message += ` (${failedAssignments.length} role assignments failed)`;
        }
        
        swal("Success", message, "success");
        FetchData();
        resetForm();
      } else {
        swal("Error", "Failed to assign module to any roles", "error");
      }
    } catch (err) {
      console.log(err);
      swal("Error", "Failed to add module permission. Please try again.", "error");
    }
  };

  const resetForm = () => {
    setData({
      module_id: "",
      controller_name: "",
      controller_url: "",
      roleIds: [],
    });
    setErrors({
      module_id: "",
      controller_name: "",
      controller_url: "",
    });
    setErrorShow(false);
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success m-3",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const handleDelete = (id) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Find the module to delete
            const moduleToDelete = ticketDetails.find(item => item.id === id);
            
            if (moduleToDelete && moduleToDelete.assignedRoles) {
              // Remove from all assigned roles using roleModule API
              const deletionPromises = [];
              
              for (const roleObj of moduleToDelete.assignedRoles) {
                const deleteRoleModuleUrl = `${delete_role_modules}?roleId=${roleObj.roleId}&moduleIds=${moduleToDelete.module_id}`;
                deletionPromises.push(deleteData({}, deleteRoleModuleUrl));
              }
              
              // Wait for all deletions to complete
              const deletionResults = await Promise.allSettled(deletionPromises);
              
              // Check if any deletions failed
              const failedDeletions = deletionResults.filter(result => 
                result.status === 'rejected' || 
                (result.status === 'fulfilled' && result.value.status !== 200)
              );
              
              if (failedDeletions.length > 0) {
                console.warn(`Failed to delete ${failedDeletions.length} role assignments`);
              }
            }
            
            // Since we're using roleModule as single source of truth, 
            // deleting all role assignments effectively removes the module
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Module and all its role assignments have been deleted.",
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
            FetchData();
          } catch (error) {
            console.error("Delete error:", error);
            swal("Error", "Failed to delete module assignments", "error");
          }
        }
      });
  };

  const FetchData = () => {
    // Use roleModule/getAll as single source of truth for module data and role assignments
    getData(get_all_role_modules)
      .then((response) => response.json())
      .then((res) => {
        if (res.Status === 200) {
          const roleModuleData = res?.Data || [];
          
          // Transform role module data to create unique module entries with their assigned roles
          const moduleMap = new Map();
          
          roleModuleData.forEach(roleModule => {
            const moduleId = roleModule.moduleId;
            
            if (!moduleMap.has(moduleId)) {
              // Create new module entry
              moduleMap.set(moduleId, {
                id: roleModule.id || `${moduleId}_${Date.now()}`, // Use roleModule.id or generate unique ID
                module_id: roleModule.moduleId,
                controller_name: roleModule.controllerName || roleModule.controller_name || '',
                controller_url: roleModule.controllerUrl || roleModule.controller_url || '',
                assignedRoles: []
              });
            }
            
            // Add roles to this module
            const moduleEntry = moduleMap.get(moduleId);
            if (roleModule.assignedRoles && Array.isArray(roleModule.assignedRoles)) {
              // Extract role objects and merge, removing duplicates by roleId
              const currentRoles = moduleEntry.assignedRoles;
              const currentRoleIds = currentRoles.map(r => r.roleId);
              
              const newRoles = roleModule.assignedRoles.filter(role => 
                !currentRoleIds.includes(role.roleId)
              );
              
              moduleEntry.assignedRoles = [...currentRoles, ...newRoles];
            }
          });
          
          // Convert map to array for display
          const moduleArray = Array.from(moduleMap.values());
          setTicketDetails(moduleArray);
        }
      })
      .catch((err) => {
        console.error(err);
        swal("Error", "Failed to fetch module data", "error");
      });
  };

  const FetchRoles = () => {
    getData(get_roles)
      .then((response) => response.json())
      .then((res) => {
        if (res.Status === 200) {
          setRoles(res?.Data || []);
        }
      })
      .catch((err) => {
        console.error(err);
        swal("Error", "Failed to fetch roles", "error");
      });
  };

  // Function to refresh data after operations - now just calls FetchData since it's the single source
  const FetchRoleModules = () => {
    // Since FetchData now handles both module and role data from roleModule/getAll,
    // we just need to call FetchData to refresh everything
    FetchData();
  };

  useEffect(() => {
    const fetchAllData = () => {
      FetchData(); // Now fetches modules and role assignments from roleModule/getAll
      FetchRoles(); // Still need roles for the form dropdowns
    };
    
    fetchAllData();
  }, []);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData({
      id: rowData.id,
      controller_name: rowData.controller_name,
      controller_url: rowData.controller_url,
    });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      // Since we're using roleModule as single source of truth and module_id cannot be changed,
      // we need to update all role assignments for this module with new controller details
      // This is complex as it requires updating multiple roleModule entries
      swal("Info", "Module editing is currently not supported. Please delete and recreate the module with new details, or use the 'Manage Roles' feature to modify role assignments.", "info");
      setShowModal(false);
      
      // TODO: Implement proper update logic that handles roleModule entries
      // This would require:
      // 1. Finding all roleModule entries for this moduleId
      // 2. Updating each entry's controllerName and controllerUrl (module_id cannot be changed)
      // 3. Handling the complexity of multiple API calls for each role assignment
      
    } catch (error) {
      console.error("Error:", error);
      swal("Error", "Failed to update module information", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleManageRoles = useCallback((rowData) => {
    setSelectedRow(rowData);
    
    // Get current role assignments for this module
    const currentRoles = rowData.assignedRoles || [];
    const currentRoleIds = currentRoles.map(roleObj => String(roleObj.roleId));
    setSelectedModuleRoles(currentRoleIds);
    setShowRoleModal(true);
  }, [roles]);

  const handleRoleAssignment = async () => {
    // Logic to save role assignments to the module using roleModule API
    try {
      // Get current role assignments for this module
      const currentModule = ticketDetails.find(item => item.id === selectedRow.id);
      const currentRoleObjects = currentModule?.assignedRoles || [];
      const currentRoleIds = currentRoleObjects.map(roleObj => String(roleObj.roleId));
      
      // Find roles to add and remove
      const rolesToAdd = selectedModuleRoles.filter(roleId => !currentRoleIds.includes(String(roleId)));
      const rolesToRemove = currentRoleIds.filter(roleId => !selectedModuleRoles.includes(String(roleId)));

      const operations = [];

      // Add new role assignments
      for (const roleId of rolesToAdd) {
        const addRoleModuleUrl = `${save_role_modules}?roleId=${roleId}&moduleIds=${selectedRow.module_id}&controllerName=${encodeURIComponent(selectedRow.controller_name)}&controllerUrl=${encodeURIComponent(selectedRow.controller_url)}`;
        operations.push(
          postData({}, addRoleModuleUrl).then(response => ({ 
            type: 'add', 
            roleId, 
            response 
          }))
        );
      }

      // Remove old role assignments
      for (const roleId of rolesToRemove) {
        const removeRoleModuleUrl = `${delete_role_modules}?roleId=${roleId}&moduleIds=${selectedRow.module_id}`;
        operations.push(
          deleteData({}, removeRoleModuleUrl).then(response => ({ 
            type: 'remove', 
            roleId, 
            response 
          }))
        );
      }

      // Execute all operations
      const results = await Promise.allSettled(operations);
      
      // Check results
      const failures = [];
      for (const result of results) {
        if (result.status === 'fulfilled') {
          const { type, roleId, response } = result.value;
          const jsonResponse = await response.json();
          const expectedStatus = type === 'add' ? [200, 201] : [200];
          
          if (!expectedStatus.includes(jsonResponse.Status)) {
            failures.push(`Failed to ${type} role ${roleId}: ${jsonResponse.Message}`);
          }
        } else {
          failures.push(`Operation failed: ${result.reason}`);
        }
      }
      
      if (failures.length === 0) {
        swal("Success", "Role assignments updated successfully", "success");
      } else {
        console.warn("Some operations failed:", failures);
        swal("Warning", `Role assignments updated with ${failures.length} failures. Check console for details.`, "warning");
      }
      
      setShowRoleModal(false);
      FetchData();
    } catch (error) {
      console.error("Error:", error);
      swal("Error", error.message || "Failed to update role assignments", "error");
    }
  };

  return (
    <>
      <form>
        <div className="container">
          <div className="d-flex">
            <h3>Module Master</h3>
          </div>
          <hr />
          <h6>Add/Edit Module-URL Mapping</h6>
          
          <div className="row">
            <div className="col-lg-3 col-md-3">
              <label htmlFor="module_id" id="label">
                Module ID:
                <span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <input
                value={data.module_id}
                type="text"
                className="form-control"
                id="module_id"
                name="module_id"
                onChange={inputChangeHandler}
                placeholder="Enter Module ID"
                onKeyPress={handleModule}
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.module_id}</span>
              )}
            </div>

            <div className="col-lg-4 col-md-4">
              <label htmlFor="controller_name" id="label">
                Controller Name:
                <span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <input
                value={data.controller_name}
                type="text"
                className="form-control"
                id="controller_name"
                name="controller_name"
                onChange={inputChangeHandler}
                placeholder="Enter Controller Name"
                onKeyPress={handleModule}
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.controller_name}</span>
              )}
            </div>

            <div className="col-lg-5 col-md-5">
              <label htmlFor="controller_url" id="label">
                Controller URL:
                <span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <input
                value={data.controller_url}
                type="text"
                className="form-control"
                id="controller_url"
                name="controller_url"
                onChange={inputChangeHandler}
                placeholder="Enter Controller URL (e.g., /api/users)"
                onKeyPress={handleModule}
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.controller_url}</span>
              )}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12">
              <label id="label">
                Assign to Roles:
              </label>
              <br />
              <div className="d-flex flex-wrap">
                {roles.map((role) => (
                  <div key={role.roleId} className="form-check me-3 mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={role.roleId}
                      id={`role-${role.roleId}`}
                      checked={data.roleIds.includes(role.roleId)}
                      onChange={() => handleRoleSelection(role.roleId)}
                    />
                    <label className="form-check-label" htmlFor={`role-${role.roleId}`}>
                      {role.roleName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-3 mb-3"
            onClick={submitHandler}
          >
            Save
          </button>

          <button
            type="button"
            className="btn btn-secondary mt-3 mb-3 ms-2"
            onClick={resetForm}
          >
            Clear
          </button>

          <br />

          <MaterialTable
            style={{ width: "100%", maxWidth: "100%" }}
            title="Module-URL Permissions"
            data={ticketDetails}
            columns={[
              {
                title: "ID",
                field: "id",
              },
              {
                title: "Module ID",
                field: "module_id",
              },
              {
                title: "Controller Name",
                field: "controller_name",
              },
              {
                title: "Controller URL",
                field: "controller_url",
              },
              {
                title: "Assigned Roles",
                field: "assignedRoles",
                render: (rowData) => (
                  <span>
                    {rowData.assignedRoles && rowData.assignedRoles.length > 0 
                      ? rowData.assignedRoles.map(role => role.roleName).join(", ") 
                      : "No roles assigned"}
                  </span>
                ),
              },
              {
                title: "Manage Roles",
                field: "manageRoles",
                render: (rowData) => (
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleManageRoles(rowData)}
                  >
                    <Plus size={16} /> Roles
                  </Button>
                ),
              },
              {
                title: "Delete",
                field: "actions",
                render: (rowData) => (
                  <span className="push-button">
                    <Trash2
                      color="#c07c7c"
                      onClick={() => handleDelete(rowData.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                ),
              },
              {
                title: "Edit",
                field: "actions",
                render: (rowData) => (
                  <i
                    className="fa fa-pencil-square-o"
                    aria-hidden="true"
                    style={{ fontSize: "25px", cursor: "pointer" }}
                    onClick={() => handleEdit(rowData)}
                    type="submit"
                  ></i>
                ),
              },
            ]}
          />
        </div>
      </form>

      {/* Edit Module Modal */}
      <div className="container">
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>Edit Module Permission</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={12}>
                  <Form.Group controlId="id">
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="id"
                      value={editData.id}
                      onChange={handleInputChange}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="controller_name">
                    <Form.Label>Controller Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="controller_name"
                      value={editData.controller_name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="controller_url">
                    <Form.Label>Controller URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="controller_url"
                      value={editData.controller_url}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleUpdate}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>

      {/* Role Assignment Modal */}
      <div className="container">
        <Modal show={showRoleModal} onHide={() => {
          setShowRoleModal(false);
          setSelectedModuleRoles([]);
          setSelectedRow(null);
        }} size="md">
          <Modal.Header closeButton>
            <Modal.Title>Manage Role Assignments</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Module:</strong> {selectedRow?.controller_name} ({selectedRow?.controller_url})</p>
            <hr />
            <Form>
              {roles.map((role) => {
                const id = String(role.roleId); // Keep as string for consistency
                const isChecked = selectedModuleRoles.includes(id);

                return (
                  <div key={role.roleId} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`modal-role-${role.roleId}`}
                      checked={isChecked}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (!checked) {
                          // Remove from selection
                          setSelectedModuleRoles(prev => prev.filter(rid => rid !== id));
                        } else {
                          // Add to selection (avoid duplicates)
                          setSelectedModuleRoles(prev => prev.includes(id) ? prev : [...prev, id]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor={`modal-role-${role.roleId}`}>
                      {role.roleName} - {role.description || ''}
                    </label>
                  </div>
                );
              })}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowRoleModal(false);
              setSelectedModuleRoles([]);
              setSelectedRow(null);
            }}>
              Close
            </Button>
            <Button variant="primary" onClick={handleRoleAssignment}>
              Save Assignments
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ModuleMaster;