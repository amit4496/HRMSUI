import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { getData, postData, deleteData } from "../../../Services/Api";
import { post_permission, put_permission, delete_permission, get_permissions, get_roles } from "../../../Services/service";
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
    module_id: "",
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
      if (!/^[a-zA-Z0-9\s\/_.-]+$/.test(key)) {
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

    try {
      const resp = await postData(data, post_permission);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Module Permission Added Successfully");
        swal("Success", "Module Permission Added Successfully", "success");
        FetchData();
        resetForm();
      } else {
        setErrors({
          module_id: res?.module_id || res?.error_message || "",
          controller_name: res?.controller_name || "",
          controller_url: res?.controller_url || "",
        });
        setErrorShow(true);
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
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Module permission has been deleted.",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });
          
          // Using the delete endpoint as specified in API requirements
          const deletePayload = { id: id };
          deleteData(deletePayload, delete_permission)
            .then((result) => result.json())
            .then((response) => {
              console.log(response);
              if (response?.Status === 200) {
                FetchData();
              }
            })
            .catch((error) => {
              console.error("Delete error:", error);
              swal("Error", "Failed to delete module permission", "error");
            });
        }
      });
  };

  const FetchData = () => {
    getData(get_permissions)
      .then((response) => response.json())
      .then((res) => {
        if (res.Status === 200) {
          setTicketDetails(res?.Data || []);
        }
      })
      .catch((err) => {
        console.error(err);
        swal("Error", "Failed to fetch module permissions", "error");
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

  useEffect(() => {
    FetchData();
    FetchRoles();
  }, []);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const url = `${BASE_URL}/permission/update/${selectedRow.id}`;
    try {
      const response = await axios.put(url, editData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log("Update response:", response);
      setShowModal(false);
      swal("Success", "Module Permission Updated Successfully", "success");
      FetchData();
    } catch (error) {
      console.error("Error:", error);
      swal("Error", "Failed to update module permission", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleManageRoles = (rowData) => {
    setSelectedRow(rowData);
    // You would typically fetch the roles assigned to this module
    setSelectedModuleRoles([]);
    setShowRoleModal(true);
  };

  const handleRoleAssignment = async () => {
    // Logic to save role assignments to the module
    try {
      const payload = {
        moduleId: selectedRow.id,
        roleIds: selectedModuleRoles
      };
      
      const resp = await postData(payload, "/permission/assignRoles");
      const res = await resp.json();
      
      if (res.Status === 200) {
        swal("Success", "Role assignments updated successfully", "success");
        setShowRoleModal(false);
        FetchData();
      } else {
        swal("Error", "Failed to update role assignments", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      swal("Error", "Failed to update role assignments", "error");
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
                  <div key={role.id} className="form-check me-3 mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={role.id}
                      id={`role-${role.id}`}
                      checked={data.roleIds.includes(role.id)}
                      onChange={() => handleRoleSelection(role.id)}
                    />
                    <label className="form-check-label" htmlFor={`role-${role.id}`}>
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
                    {rowData.assignedRoles ? rowData.assignedRoles.join(", ") : "No roles assigned"}
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
                <Col md={6}>
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
                <Col md={6}>
                  <Form.Group controlId="module_id">
                    <Form.Label>Module ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="module_id"
                      value={editData.module_id}
                      onChange={handleInputChange}
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
        <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} size="md">
          <Modal.Header closeButton>
            <Modal.Title>Manage Role Assignments</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Module:</strong> {selectedRow?.controller_name} ({selectedRow?.controller_url})</p>
            <hr />
            <Form>
              {roles.map((role) => (
                <div key={role.id} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={role.id}
                    id={`modal-role-${role.id}`}
                    checked={selectedModuleRoles.includes(role.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedModuleRoles([...selectedModuleRoles, role.id]);
                      } else {
                        setSelectedModuleRoles(selectedModuleRoles.filter(id => id !== role.id));
                      }
                    }}
                  />
                  <label className="form-check-label" htmlFor={`modal-role-${role.id}`}>
                    {role.roleName} - {role.description}
                  </label>
                </div>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
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