import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { getData, postData, putData } from "../../../Services/Api";
import { post_role, get_roles, update_role, get_permission_urls } from "../../../Services/service";
import { Button, Modal, Form, Row, Col, Badge, ListGroup } from "react-bootstrap";
import axios from "axios";
import { Trash2, Plus, Edit, Settings } from "lucide-react";
import { BASE_URL } from "../../helper";

const RoleMaster = () => {
  const [data, setData] = useState({
    roleName: "",
  });
  const [errors, setErrors] = useState({
    roleName: "",
  });
  const [errorShow, setErrorShow] = useState(false);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRoleModules, setSelectedRoleModules] = useState([]);
  const [editData, setEditData] = useState({
    roleId: "",
    roleName: "",
  });
  
  // Module management states
  const [moduleData, setModuleData] = useState({
    selectedModuleId: "",
  });
  const [moduleErrors, setModuleErrors] = useState({
    selectedModuleId: "",
  });
  const [editingModule, setEditingModule] = useState(null);
  const [availableModules, setAvailableModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);

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

  const moduleInputChangeHandler = (e) => {
    const { name, value } = e.target;
    setModuleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setModuleErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleRole = (event) => {
    const { key } = event;

    // Block input that consists of spaces only
    if (/^\s+$/.test(key) && event.target.value.trim() === "") {
      event.preventDefault();
      return;
    }

    // Block characters that are not allowed in a role name
    if (!/^[a-zA-Z_]+$/.test(key)) {
      event.preventDefault();
    }
  };



  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    // Validation
    if (!data.roleName.trim()) {
      swal("Error", "Please enter a role name", "error");
      return;
    }

    try {
      const resp = await postData(data, post_role);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Role Added Successfully");
        swal("Success", "Role Added Successfully", "success");
        FetchData();
        setData({
          roleName: "",
        });
        setErrors({
          roleName: "",
        });
        setErrorShow(false);
      } else {
        setErrors({
          roleName: res?.roleName || res?.error_message || "",
        });
        setErrorShow(true);
      }
    } catch (err) {
      console.log(err);
      swal("Error", "Failed to add role. Please try again.", "error");
    }
  };

  const submitModuleHandler = async (e) => {
    e.preventDefault();
    
    if (!moduleData.selectedModuleId) {
      swal("Error", "Please select a module", "error");
      return;
    }
    const selectedModule = availableModules.find(mod => mod.moduleId == moduleData.selectedModuleId);
    if (!selectedModule) {
      swal("Error", "Selected module not found", "error");
      return;
    }
    const isAlreadyAssigned = selectedRoleModules.some(module => module.moduleId == selectedModule.moduleId);
    if (isAlreadyAssigned && !editingModule) {
      swal("Error", "This module is already assigned to this role", "error");
      return;
    }

    try {
      const updatedModules = editingModule 
        ? selectedRoleModules.map(module => 
            module.moduleId === editingModule.moduleId 
              ? { 
                  moduleId: selectedModule.moduleId,
                  controllerName: selectedModule.controllerName, 
                  controllerUrl: selectedModule.controllerUrl 
                }
              : module
          )
        : [...selectedRoleModules, {
            moduleId: selectedModule.moduleId,
            controllerName: selectedModule.controllerName,
            controllerUrl: selectedModule.controllerUrl
          }];

      // Update the role with new modules using existing update API
      const roleUpdateData = {
        roleId: selectedRow.roleId,
        roleName: selectedRow.roleName,
        modules: updatedModules
      };

      const resp = await putData(roleUpdateData, update_role.replace('{id}', selectedRow.roleId));
      const res = await resp.json();
      console.log('after save response is', res)
      if (res.Status === 200) {
        swal("Success", editingModule ? "Module Updated Successfully" : "Module Added Successfully", "success");
        setSelectedRoleModules(updatedModules);
        resetModuleForm();
        FetchData(); // Refresh the main data
        updateFilteredModules(updatedModules); // Update available modules
      } else {
        swal("Error", "Failed to save module", "error");
      }
    } catch (err) {
      console.log(err);
      swal("Error", "Failed to save module. Please try again.", "error");
    }
  };

  const resetModuleForm = () => {
    setModuleData({
      selectedModuleId: "",
    });
    setModuleErrors({
      selectedModuleId: "",
    });
    setEditingModule(null);
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success m-3",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const handleDelete = (roleId) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Role has been deleted.",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });
          fetch(`${BASE_URL}/role/delete/${roleId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
            .then((result) => result.json())
            .then((response) => {
              console.log(response);
              if (response?.Status === 200) {
                FetchData();
              }
            })
            .catch((error) => {
              console.error("Delete error:", error);
              swal("Error", "Failed to delete role", "error");
            });
        }
      });
  };

  const FetchData = () => {
    getData(get_roles)
      .then((response) => response.json())
      .then((res) => {
        console.log("API Response:", res); // Debug log
        // Handle direct array response or response with Status/Data structure
        if (Array.isArray(res)) {
          setTicketDetails(res);
        } else if (res.Status === 200) {
          setTicketDetails(res?.Data || []);
        } else {
          setTicketDetails(res || []);
        }
      })
      .catch((err) => {
        console.error(err);
        swal("Error", "Failed to fetch roles", "error");
      });
  };

  const FetchAvailableModules = () => {
    getData(get_permission_urls)
      .then((response) => response.json())
      .then((res) => {
        if (Array.isArray(res?.Data) && res.Status == 200) {
          setAvailableModules(res?.Data);
        }
      })
      .catch((err) => {
        console.error("Error fetching modules:", err);
        swal("Error", "Failed to fetch available modules", "error");
      });
  };

  const updateFilteredModules = (currentRoleModules) => {
    const assignedModuleIds = currentRoleModules.map(module => module.moduleId);
    const filtered = (availableModules)?.filter(module => !assignedModuleIds.includes(module.moduleId));
    setFilteredModules(filtered);
  };

  useEffect(() => {
    FetchData();
    FetchAvailableModules();
  }, []);

  useEffect(() => {
    if (availableModules.length > 0) {
      updateFilteredModules(selectedRoleModules);
    }
  }, [availableModules, selectedRoleModules]);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData({
      roleId: rowData.roleId,
      roleName: rowData.roleName,
    });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        roleId: editData.roleId,
        roleName: editData.roleName,
        modules: selectedRow.module || [] // Keep existing modules
      };

      const resp = await putData(updateData, update_role.replace('{id}', editData.roleId));
      const res = await resp.json();

      if (res.Status === 200) {
        setShowModal(false);
        swal("Success", "Role Updated Successfully", "success");
        FetchData();
      } else {
        swal("Error", "Failed to update role", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      swal("Error", "Failed to update role", "error");
    }
  };

  const handleManageModules = (rowData) => {
    setSelectedRow(rowData);
    const currentModules = rowData.module || [];
    setSelectedRoleModules(currentModules);
    updateFilteredModules(currentModules);
    setShowModuleModal(true);
  };

  const handleEditModule = (module) => {
    setModuleData({
      selectedModuleId: module.moduleId,
    });
    setEditingModule(module);
  };

  const handleDeleteModule = async (moduleId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!"
    });

    if (result.isConfirmed) {
      try {
        const updatedModules = selectedRoleModules.filter(module => module.moduleId !== moduleId);
        
        const roleUpdateData = {
          roleId: selectedRow.roleId,
          roleName: selectedRow.roleName,
          modules: updatedModules
        };

        const resp = await postData(roleUpdateData, update_role);
        const res = await resp.json();

        if (res.Status === 200) {
          swal("Success", "Module Deleted Successfully", "success");
          setSelectedRoleModules(updatedModules);
          FetchData();
        } else {
          swal("Error", "Failed to delete module", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        swal("Error", "Failed to delete module", "error");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <form>
        <div className="container">
          <div className="d-flex">
            <h3>Role Master</h3>
          </div>
          <hr />
          <h6>Add/Edit Role</h6>
          <div className="row">
            <div className="col-lg-4 col-md-4">
              <label htmlFor="roleName" id="label">
                Role Name:
                <span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <input
                value={data.roleName}
                type="text"
                className="form-control"
                id="roleName"
                name="roleName"
                onChange={inputChangeHandler}
                placeholder="Enter Role Name (e.g., ADMIN, HR)"
                onKeyPress={handleRole}
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.roleName}</span>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-3 mb-3"
            onClick={submitHandler}
          >
            Save Role
          </button>

          <br />

          <MaterialTable
            style={{ width: "100%", maxWidth: "100%" }}
            title="Role Records with Module Access"
            data={ticketDetails}
            columns={[
              {
                title: "Role ID",
                field: "roleId",
                width: "10%"
              },
              {
                title: "Role Name",
                field: "roleName",
                width: "15%"
              },
              {
                title: "Modules Assigned",
                field: "module",
                width: "40%",
                render: (rowData) => (
                  <div>
                    {rowData.module && rowData.module.length > 0 ? (
                      <div>
                        <Badge bg="info" className="me-1">
                          {rowData.module.length} module(s)
                        </Badge>
                        <div className="mt-1" style={{ fontSize: "12px" }}>
                          {rowData.module.slice(0, 2).map((mod, index) => (
                            <div key={mod.moduleId}>
                              <strong>{mod.controllerName}</strong>: {mod.controllerUrl}
                            </div>
                          ))}
                          {rowData.module.length > 2 && (
                            <div><em>... and {rowData.module.length - 2} more</em></div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Badge bg="secondary">No modules assigned</Badge>
                    )}
                  </div>
                ),
              },
              {
                title: "Manage Modules",
                field: "manageModules",
                width: "15%",
                render: (rowData) => (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleManageModules(rowData)}
                  >
                    <Settings size={16} /> Modules
                  </Button>
                ),
              },
              {
                title: "Edit Role",
                field: "editRole",
                width: "10%",
                render: (rowData) => (
                  <i
                    className="fa fa-pencil-square-o"
                    aria-hidden="true"
                    style={{ fontSize: "20px", cursor: "pointer", color: "#007bff" }}
                    onClick={() => handleEdit(rowData)}
                    title="Edit Role"
                  ></i>
                ),
              },
              {
                title: "Delete Role",
                field: "deleteRole",
                width: "10%",
                render: (rowData) => (
                  <span className="push-button">
                    <Trash2
                      color="#dc3545"
                      onClick={() => handleDelete(rowData.roleId)}
                      style={{ cursor: "pointer" }}
                      title="Delete Role"
                    />
                  </span>
                ),
              },
            ]}
          />
        </div>
      </form>

      {/* Edit Role Modal */}
      <div className="container">
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>Edit Role</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="roleId">
                <Form.Label>Role ID</Form.Label>
                <Form.Control
                  type="text"
                  name="roleId"
                  value={editData.roleId}
                  onChange={handleInputChange}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="roleName" className="mt-3">
                <Form.Label>Role Name</Form.Label>
                <Form.Control
                  type="text"
                  name="roleName"
                  value={editData.roleName}
                  onChange={handleInputChange}
                  placeholder="Enter role name"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleUpdate}>
                Update Role
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>

      {/* Module Management Modal */}
      <div className="container">
        <Modal show={showModuleModal} onHide={() => {
          setShowModuleModal(false);
          resetModuleForm();
        }} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Manage Modules for Role: {selectedRow?.roleName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Add/Edit Module Form */}
            <div className="border p-3 mb-3 bg-light">
              <h6>{editingModule ? 'Edit Module' : 'Add New Module'}</h6>
              <Form>
                <Row>
                  <Col md={12}>
                    <Form.Group controlId="selectedModuleId">
                      <Form.Label>Select Module <span style={{ color: "red" }}>*</span></Form.Label>
                      <Form.Select
                        name="selectedModuleId"
                        value={moduleData.selectedModuleId}
                        onChange={moduleInputChangeHandler}
                        disabled={editingModule ? true : false}
                      >
                        <option value="">-- Select a Module --</option>
                        {editingModule ? (
                          // When editing, show all modules including currently selected one
                          availableModules.map((module) => (
                            <option key={module.moduleId} value={module.moduleId}>
                              {module.controllerName} - {module.controllerUrl}
                            </option>
                          ))
                        ) : (
                          // When adding, show only unassigned modules
                          filteredModules.map((module) => (
                            <option key={module.moduleId} value={module.moduleId}>
                              {module.controllerName} - {module.controllerUrl}
                            </option>
                          ))
                        )}
                      </Form.Select>
                      {moduleErrors.selectedModuleId && (
                        <span className="text-danger">{moduleErrors.selectedModuleId}</span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* Show preview of selected module */}
                {moduleData.selectedModuleId && (
                  <Row className="mt-3">
                    <Col md={12}>
                      <div className="alert alert-info">
                        <strong>Selected Module Preview:</strong>
                        {(() => {
                          const selected = availableModules.find(mod => mod.moduleId == moduleData.selectedModuleId);
                          return selected ? (
                            <div>
                              <div><strong>Name:</strong> {selected.controllerName}</div>
                              <div><strong>URL:</strong> {selected.controllerUrl}</div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </Col>
                  </Row>
                )}

                <div className="mt-2">
                  <Button variant="primary" onClick={submitModuleHandler} className="me-2">
                    {editingModule ? 'Update Module' : 'Add Module'}
                  </Button>
                  {editingModule && (
                    <Button variant="secondary" onClick={resetModuleForm}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </Form>
            </div>

            {/* Existing Modules List */}
            <div>
              <h6>Current Modules ({selectedRoleModules.length})</h6>
              {selectedRoleModules.length === 0 ? (
                <div className="text-muted">No modules assigned to this role</div>
              ) : (
                <ListGroup>
                  {selectedRoleModules.map((module) => (
                    <ListGroup.Item key={module.moduleId} className="d-flex justify-content-between align-items-start">
                      <div className="me-auto">
                        <div className="fw-bold">{module.controllerName}</div>
                        <small className="text-muted">{module.controllerUrl}</small>
                      </div>
                      <div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleEditModule(module)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteModule(module.moduleId)}
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
              setShowModuleModal(false);
              resetModuleForm();
            }}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default RoleMaster;