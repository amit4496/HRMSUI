import MaterialTable from "@material-table/core";
import React from "react";
import swal from "sweetalert";
import { useState, useEffect } from "react";
import { getData, postData } from "../../../Services/Api";
import {
  designation,
  get_Designation,
  post_Deignation,
} from "../../../Services/service";
import Swal from "sweetalert2";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { BASE_URL } from "../../helper";

const DesignationMaster = () => {
  const [data, setData] = useState({
    designationName: "",
  });
  const [ticketDetails, setTicketDetails] = useState([]);
  const [errors, setError] = useState("");
  const [errorShow, setErrorShow] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    designationName: "",
  });

  const handledesc = (event) => {
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

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const submitHandler = (e) => {
    if (!data.designationName) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Enter Designation name first!",
      });
    } else {
      postData(data, post_Deignation)
        .then((resp) => resp.json())
        .then((res) => {
          console.log(res, "Designation Name Added");
          if (res?.Status == 201) {
            swal("Success", "Designation Added Successfully", "success");
            FetchData();
            setData({
              designationName: "",
            });
          } else {
            swal("", `${res.error_message}`, "");
          }
        })
        .catch((err) => console.log(err));
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
            timer: 1000, // Timer set to 1000 milliseconds (1 second)
            showConfirmButton: false,
          });
          fetch(`${BASE_URL}/designation/designation/${id}`, {
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
    getData(designation)
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
    const url = `${BASE_URL}/designation/update/${selectedRow.id}`; // Replace with your updated API endpoint
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
      <div className="container">
        <div className="d-flex">
          <h3>Designation Master</h3>
        </div>
        <hr />
        <div className="bg-light">
          <div className="row ">
            <div className="col-sm-6 mt-2">
              <label for="cars" id="label">
                Designation Name: <span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <input
                value={data.designationName}
                type="text"
                class="form-control"
                id="formGroupExampleInput"
                name="designationName"
                onChange={inputChangeHandler}
                placeholder="Enter Designation Name"
                onKeyPress={handledesc}
              />
              {errorShow && (
                <span style={{ color: "red" }}>{errors.designationName}</span>
              )}
            </div>
          </div>
          <button
            // disabled={disabled}
            onClick={submitHandler}
            type="button"
            class="btn btn-primary  mt-4 vvv "
          >
            Submit
          </button>
          {/* <button type="button" class="btn btn-primary mt-4">
            View All
          </button> */}
        
      <br />
      <br />

      <MaterialTable
      style={{ width: "80vw" }}
        title="Designation Record"
        data={ticketDetails}
        columns={[
          {
            title: "Designation Id",
            field: "id",
          },

          {
            title: "Designation Name",
            field: "designationName",
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
      </div>
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
              <Form.Group controlId="designationName">
                <Form.Label>Designation Name</Form.Label>
                <Form.Control
                  type="text"
                  name="designationName"
                  value={editData.designationName}
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

export default DesignationMaster;
