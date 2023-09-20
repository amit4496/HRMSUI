import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import Swal from "sweetalert2";

import swal from "sweetalert";
import { getData } from "../../Services/Api";
import { get_shift } from "../../Services/service";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Trash2 } from "lucide-react";

const ViewEmployeeShift = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    id: "",
    employee: "",
    country: "",
    startTime: "",
    endTime: "",
    userName: "",
  });
  const inputChangeHandler = (e) => {
    let newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const [ticketDetails, setTicketDetails] = useState([]);

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
          fetch(`https://apihrms.atwpl.com/shiftManagement/addShift/${id}`, {
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
                fetchData();
              }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
        }
      });
  };

  const fetchData = () => {
    getData(get_shift)
      .then((response) => response.json())
      .then((data) => setTicketDetails(data?.Data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const url = `https://apihrms.atwpl.com/shiftManagement/update/${selectedRow.id}`; // Replace with your updated API endpoint
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
      fetchData();
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
      <div className="container" style={{ width: "80vw" }}>
        <div className="d-flex">
          <h3>View Shift Data</h3>
        </div>

        <br />
        <MaterialTable
          title="Shift Record"
          data={ticketDetails}
          columns={[
            {
              title: "Employee Name",
              field: "employee",
            },

            {
              title: "Country",
              field: "country",
            },
            {
              title: "Date",
              field: "date",
            },
            {
              title: "Start Time",
              field: "startTime",
            },
            {
              title: "End Time",
              field: "endTime",
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
              <Form.Group controlId="employee">
                <Form.Label>Employee Name</Form.Label>
                <Form.Control
                  type="text"
                  name="employee"
                  value={editData.employee}
                  onChange={handleInputChange}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="country">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  className="form-select"
                  as="select"
                  name="country"
                  value={editData.country}
                  onChange={handleInputChange}
                >
                  <option>Choose Shift</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="Japan">Japan</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="startTime">
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                  type="time"
                  name="startTime"
                  value={editData.startTime}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="endTime">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="time"
                  name="endTime"
                  value={editData.endTime}
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

export default ViewEmployeeShift;
