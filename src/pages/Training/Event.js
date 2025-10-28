import { useState, useEffect } from "react";
import swal from "sweetalert";
import { event_get, post_event } from "../../Services/service";
import { getData, postData } from "../../Services/Api";
import Swal from "sweetalert2";
import MaterialTable from "@material-table/core";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { BASE_URL } from "../helper";

const Event = () => {
  const initialState = { name: "", description: "" };
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [errorShow, setErrorShow] = useState(false);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
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
  const handlekey = (event) => {
    const { key } = event;

    // Block input that consists of spaces only
    if (/^\s+$/.test(key) && event.target.value.trim() === "") {
      event.preventDefault();
      return;
    }
  };
  const handleEvent = (event) => {
    const { key } = event;

    // Block characters that are not allowed in a phone number
    if (!/^[a-zA-Z]+$/.test(key)) {
      event.preventDefault();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, post_event);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Event Name Added");
        swal("Success", "Event Added Successfully", "success");
        FetchData();
        setData({
          name: "",
          description: "",
        });
        setErrors({
          name: "",
          description: "",
        });
        setErrorShow(false);
      } else {
        setErrors({
          name: res?.name || "",
          description: res?.description || "",
        });
        setErrorShow(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const FetchData = () => {
    getData(event_get)
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
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Your file has been deleted.",
            "success"
          );
          fetch(`${BASE_URL}/event/delete/${id}`, {
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

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const url = `${BASE_URL}/event/update/${selectedRow.id}`; // Replace with your updated API endpoint
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
          <h3>Add Event</h3>
        </div>
        <hr />
        <form onSubmit={submitHandler}>
          <div className="row">
            <div className="col-sm-6 ">
              <label htmlFor="formGroupExampleInput" id="label">
                Event Name: <span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.name}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                name="name"
                onChange={inputChangeHandler}
                placeholder="Please Enter Event Name"
                onKeyPress={handleEvent}
              />
              {errorShow && <span style={{ color: "red" }}>{errors.name}</span>}
            </div>

            <div className="col-sm-6">
              <label htmlFor="formGroupExampleInput" id="label">
                Description: <span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.description}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                name="description"
                onChange={inputChangeHandler}
                placeholder="Write Something Here"
                onKeyPress={handlekey}
              />
              {errorShow && (
                <span style={{ color: "red" }}>{errors.description}</span>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            Save
          </button>
          <br />
          <br />

          <MaterialTable
            style={{ width: "76vw",margin:"0 auto" }}
            title="Event Details"
            data={ticketDetails}
            columns={[
              {
                title: "Event Name",
                field: "name",
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
        </form>
      </div>

      <div className="container">
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>Edit Event Details</Modal.Title>
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
                <Form.Label>Event Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editData.name}
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

export default Event;
