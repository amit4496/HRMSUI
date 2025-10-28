import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import swal from "sweetalert";
import Swal from "sweetalert2";
import { getData, postData } from "../../../Services/Api";
import { Post_department, get_department } from "../../../Services/service";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { BASE_URL } from "../../helper";

const DepartmentMaster = () => {
  const [data, setData] = useState({
    departmentName: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    departmentName: "",
    description: "",
  });
  const [errorShow, setErrorShow] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    departmentName: "",
    description: "",
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

  const handledept = (event) => {
    const { key } = event;

    // Block input that consists of spaces only
    if (/^\s+$/.test(key) && event.target.value.trim() === "") {
      event.preventDefault();
      return;
    }

    // Block characters that are not allowed in a holiday type
    if (!/^[a-zA-Z\s]+$/.test(key)) {
      event.preventDefault();
    }
  };

  const [ticketDetails, setTicketDetails] = useState([]);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, Post_department);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Department Name Added");
        swal("Success", "Department Added Successfully", "success");
        FetchData();
        setData({
          departmentName: "",
          description: "",
        });
        setErrors({
          departmentName: "",
          description: "",
        });
        setErrorShow(false);
      } else {
        setErrors({
          departmentName: res?.departmentName || "",
          description: res?.description || "",
        });
        setErrorShow(true);
      }
    } catch (err) {
      console.log(err);
    }
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
            text: "Your file has been deleted.",
            icon: "success",
            timer: 1000, // Timer set to 1000 milliseconds (1 second)
            showConfirmButton: false,
          });
          fetch(`${BASE_URL}/department/delete/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
            .then((result) => result.json())
            .then((response) => {
              console.log(response);
              if (response?.Status == 200) {
                FetchData();
              }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
        }
      });
  };

  const FetchData = () => {
    getData(get_department)
      .then((response) => response.json())
      .then((res) => {
        if (res.Status == 200) {
          setTicketDetails(res?.Data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    FetchData();
  }, []);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const url = `${BASE_URL}/department/update/${selectedRow.id}`; // Replace with your updated API endpoint
    try {
      const response = await axios.put(url, editData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log("ressssssssss", response);
      const updatedData = response.data;
      setData(updatedData);
      console.log("qqqqqqqqq", updatedData);
      setShowModal(false);
      swal("Success", "Data Updated Successfully", "success");
      FetchData();
    } catch (error) {
      console.error("Error:", error);
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
        <div className="container ">
          <div className="d-flex">
            <h3>Add Department</h3>
          </div>
          <hr />
          <h6>Add Department</h6>
          <div className="row">
            <div className="col-lg-3 col-md-3">
              <label htmlFor="departmentName" id="label">
                Department Name:
                <span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <input
                value={data.departmentName}
                type="text"
                className="form-control"
                id="departmentName"
                name="departmentName"
                onChange={inputChangeHandler}
                placeholder="Enter Department Name"
                onKeyPress={handledept}
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.departmentName}</span>
              )}
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12">
              <label htmlFor="description" id="label">
                Description:
                <span style={{ color: "red" }}>*</span>
              </label>
              <br />

              <input
                value={data.description}
                type="text"
                className="form-control"
                id="description"
                name="description"
                onChange={inputChangeHandler}
                placeholder="Enter Description Here"
                onKeyPress={handledept}
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.description}</span>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-2 mb-2"
            onClick={submitHandler}
          >
            Save
          </button>

          <br />

          <MaterialTable
            style={{ width: "80vw" }}
            title="Department Record"
            data={ticketDetails}
            columns={[
              {
                title: "Department Name",
                field: "departmentName",
              },
              {
                title: "Description",
                field: "description",
              },
              {
                title: "Actions",
                field: "actions",
                render: (rowData) => (
                  <span className="push-button">
                <Trash2
                  color="#c07c7c"
                  onClick={() => handleDelete(rowData.id)}
                />
              </span>
                ),
              },
              {
                title: "Actions",
                field: "actions",
                render: (rowData) => (
                  <i
                    className="fa fa-pencil-square-o"
                    aria-hidden="true"
                    style={{ fontSize: "25px" }}
                    onClick={() => handleEdit(rowData)}
                    type="submit"
                  ></i>
                ),
              },
            ]}
          />
        </div>
      </form>
      <div className="container">
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>Edit Branch Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Render input fields for editing data */}
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
              <Form.Group controlId="departmentName">
                <Form.Label>Department Name</Form.Label>
                <Form.Control
                  type="text"
                  name="departmentName"
                  value={editData.departmentName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={editData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
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
    </>
  );
};

export default DepartmentMaster;
