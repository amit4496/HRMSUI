import MaterialTable from "@material-table/core";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import Swal from "sweetalert2";
// import { Button, Modal } from "react-bootstrap";
import { Button, Modal, Form } from "react-bootstrap";

import { getData, postData } from "../../Services/Api";
import { get_branch, post_branch } from "../../Services/service";
// import { Form } from "react-router-dom";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { BASE_URL } from "../helper";

const Branch = () => {
  const [data, setData] = useState({
    name: "",
  });
  const [ticketDetails, setTicketDetails] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorShow, setErrorShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
  });

  const handleBranch = (event) => {
    const { key } = event;

    // Block input that consists of spaces only
    if (/^\s+$/.test(key) && event.target.value.trim() === "") {
      event.preventDefault();
      return;
    }

    // Block characters that are not allowed in a holiday type
    if (!/^[a-zA-Z0-9\s]+$/.test(key)) {
      event.preventDefault();
    }
  };
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

  const submitHandler = (e) => {
    e.preventDefault();
    console.log((data, "data"));
    if (!data.name) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Enter Branch Name first!",
      });
    } else {
      postData(data, post_branch)
        .then((resp) => resp.json())
        .then((res) => {
          if (res.Status == 200) {
            console.log("Branch Name Added");
            swal("Success", "Branch Added Successfully", "success");
            setTimeout(function() {
              swal.close();
          }, 1000);
            setData({
              name: "",
            });
            branch();
          } else {
            swal("", `${res.error_message}`);
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
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Your file has been deleted.",
            "success"
          );
          fetch(`${BASE_URL}/branch/delete/${id}`, {
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
                branch();
              }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
        }
      });
  };

  //  const submitHandler=(e)=>{
  //     e.preventDefault();
  //  }
  const branch = () => {
    getData(get_branch)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "res");
        setTicketDetails(res.Data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    branch();
  }, []);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const url = `${BASE_URL}/branch/update/${selectedRow.id}`; // Replace with your updated API endpoint
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
      branch();
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
        <div className="container">
          <div className="d-flex">
            <h3>Branch Office</h3>
            {/* <button type="button" className="btn btn-primary sm-4 mt-2 mx-3">Add Employment Type</button> */}
          </div>
          <hr />
          <h5>Add Branch Office</h5>

          <div className="row ">
            <div className="col-sm-4 mt-2">
              <label for="cars" id="label">
                Branch Name:<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.name}
                placeholder="Enter branch name"
                type="text"
                class="form-control"
                id="formGroupExampleInput"
                name="name"
                onChange={inputChangeHandler}
                onKeyPress={handleBranch}
                required
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.name}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary  mt-4 "
            onClick={submitHandler}
          >
            Save
          </button>

          <br />
          <br />
          <MaterialTable
            style={{ width: "76vw"}}
            title="Branch Record"
            data={ticketDetails}
            columns={[
              {
                title: "Branch Id",
                field: "id",
              },
              {
                title: "Branch Name",
                field: "name",
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
              <Form.Group controlId="name">
                <Form.Label>Branch Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editData.name}
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

export default Branch;
