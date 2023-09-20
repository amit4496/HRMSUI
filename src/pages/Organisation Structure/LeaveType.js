import React, { useState } from "react";
import MaterialTable from "@material-table/core";
import swal from "sweetalert";
import { getData, postData } from "../../Services/Api";
import { get_leavetype, post_leaveType } from "../../Services/service";
import { useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { Trash2 } from "lucide-react";

const LeaveType = () => {
  const [leaveDetails, setLeaveDetails] = useState([]);
  const initialState = {
    leaveType: "",
    description: "",
  };
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [errorShow, setErrorShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
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
  const handleleavedesc = (event) => {
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
  const handleleave = (event) => {
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

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, post_leaveType);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Event Name Added");
        swal("Success", "Event Added Successfully", "success");
        setTimeout(function() {
          swal.close();
      }, 1000);
        setData({
          leaveType: "",
          description: "",
        });
        getLeaveType();
        setErrors({
          leaveType: "",
          description: "",
        });
        setErrorShow(false);
      } else {
        setErrors({
          leaveType: res?.leaveType || "",
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
        // reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });
          fetch(`https://apihrms.atwpl.com/leave/leaveType/${id}`, {
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
                getLeaveType();
              }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
        }
      });
  };

  const getLeaveType = () => {
    getData(get_leavetype)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "res");
        setLeaveDetails(res.Data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getLeaveType();
  }, []);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const url = `https://apihrms.atwpl.com/leave/leaveType/${selectedRow.id}`; // Replace with your updated API endpoint
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
      getLeaveType();
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
      <div className="container">
        <h4>Add Leave Type </h4>
        <hr />
        <div className="bg-light p-3 rounded">
          <div className="row ">
            <div>
              <div className="row ">
                <div className="col-sm-6">
                  <label class="form-label">
                    Leave Type :<span style={{ color: "red" }}> * </span>
                  </label>
                  <br />
                  <input
                    type="text"
                    placeholder="Enter leave type..."
                    class="form-control"
                    id="formGroupExampleInput"
                    value={data.leaveType}
                    name="leaveType"
                    onChange={inputChangeHandler}
                    onKeyPress={handleleave}
                  />

                  {errorShow && (
                    <span className="Errorsmessage">{errors.leaveType}</span>
                  )}
                </div>
                <div className="col-sm-6">
                  <label class="form-label">
                    Description :<span style={{ color: "red" }}> * </span>
                  </label>
                  <br />
                  <input
                    type="text"
                    placeholder="Enter leave type..."
                    class="form-control"
                    id="formGroupExampleInput"
                    value={data.description}
                    name="description"
                    onChange={inputChangeHandler}
                    onKeyPress={handleleavedesc}
                  />
                  {errorShow && (
                    <span className="Errorsmessage">{errors.description}</span>
                  )}
                </div>
              </div>
              <button
                type="submit"
                onClick={submitHandler}
                className="btn btn-primary mt-4"
              >
                save
              </button>
            </div>
          </div>
        </div>
      </div>
      <br></br>

      <br></br>
      <MaterialTable
        style={{ width: "80vw" }}
        columns={[
          {
            title: "Sr.No.",
            field: "id",
          },
          {
            title: "Leave Type",
            field: "leaveType",
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
        data={leaveDetails}
        title="Leave Type Record"
      />
      <div className="container">
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>Edit Leave Data</Modal.Title>
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
              <Form.Group controlId="leaveType">
                <Form.Label>Leave Type</Form.Label>
                <Form.Control
                  type="text"
                  name="leaveType"
                  value={editData.leaveType}
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

export default LeaveType;
