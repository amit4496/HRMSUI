import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import Swal from "sweetalert2";
import {
  event_get,
  get_employeeTraining,
  get_feedback,
  trainingName_get,
} from "../../../Services/service";
import { getData } from "../../../Services/Api";
import axios from "axios";
import swal from "sweetalert";
import { Trash2 } from "lucide-react";
import view from "../../../../src/components/img/folder-unscreen.gif";
import { Button, Modal, Form } from "react-bootstrap";
import { BASE_URL } from "../../helper";

const RegisterEmployee = () => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [feedbackData, setFeedbackData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    employee: "",
    eventName: "",
    trainingName: "",
  });
  const [train, setTrain] = useState([]);
  const [show, setShow] = useState([]);
  const [eve,setEve]=useState([])

  const handleViewFeedback = (rowData) => {
    setSelectedRowData(rowData); // Set the selected row data
    setShowPopup(true); // Open the popup
    fetchData4(); // Fetch feedback data
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
          fetch(`${BASE_URL}/employee/delete/${id}`, {
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
                getEmployeee();
              }
            });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
        }
      });
  };

  const getEmployeee = () => {
    getData(get_employeeTraining)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "res");
        setTicketDetails(res.Data);
      })
      .catch((err) => console.error(err));
  };

  const fetchData = () => {
    getData(get_employeeTraining)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "res");
        setTicketDetails(res.Data);
      })
      .catch((err) => console.error(err));
  };

  const FetchData1 = () => {
    getData(event_get)
      .then((response) => response.json())
      .then((res) => {
        if (res.Status == 200) {
          setEve(res?.Data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getEmployeee();
    fetchData();
    FetchData1();
  }, []);
  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const url = `${BASE_URL}/employee/edit/${selectedRow.id}`; // Replace with your updated API endpoint
    try {
      const response = await axios.put(url, editData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log("ressssssssss", response);
      const updatedData = response.data;
      setTicketDetails(updatedData);
      console.log("qqqqqqqqq", updatedData);
      setShowModal(false);
      swal("Success", "Data Updated Successfully", "success");
      setTimeout(function() {
        swal.close();
    }, 1000);
      getEmployeee();
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

  const fetchData2 = () => {
    getData(event_get)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "branch");
        setShow(data?.Data);
      });
  };

  const fetchData3 = () => {
    getData(trainingName_get)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "branch");
        setTrain(data?.Data);
      });
  };

  const fetchData4 = () => {
    getData(get_feedback)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "branch");
        setTrain(data?.Data);
      });
  };
  useEffect(() => {
    fetchData3();
    fetchData4();
    fetchData2();
  }, []);

  return (
    <>
      <div className="container" style={{ width: "80vw" }}>
        <div className="d-flex">
          <h2>Registered Employee for Training</h2>
          <br />
          <br />
        </div>

        <MaterialTable
          title="Training Employee Record"
          data={ticketDetails}
          columns={[
            {
              title: "Employee Name",
              field: "employee",
            },
            {
              title: "Event Name",
              field: "eventName",
            },
            {
              title: "Training Name",
              field: "trainingName",
            },

            // {
            //   title: "View Feedback", // Button to show popup
            //   field: "viewFeedback",
            //   render: (rowData) => (
            //     <button
            //       className="btn btn-primary"
            //       onClick={() => handleViewFeedback(rowData.id)}
            //     >
            //       View
            //     </button>
            //   ),
            // },

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
      <div className="modal">
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Bank Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="employee">
                <Form.Label>Employee Name</Form.Label>
                <Form.Control
                  type="text"
                  name="employee"
                  value={editData.employee}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="eventName">
                <Form.Label>Event Name</Form.Label>
                <Form.Control
                  className="form-select"
                  name="eventName"
                  value={editData.eventName}
                  onChange={handleInputChange}
                  as="select"
                >
                  {Array.isArray(eve) &&
                    eve.map((depItem, index) => (
                      <option
                        key={index}
                        value={depItem.name}
                        select={
                          editData.eventName === depItem.name
                        }
                      >
                        {depItem.name}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="trainingName">
                <Form.Label>Training Name</Form.Label>
                <Form.Control
                  as="select"
                  className="form-select"
                  name="trainingName"
                  value={editData.trainingName}
                  onChange={handleInputChange}
                >
                  {Array.isArray(train) &&
                    train.map((depItem, index) => (
                      <option
                        key={index}
                        value={depItem.trainingName}
                        select={
                          editData.trainingName === depItem.trainingName
                        }
                      >
                        {depItem.trainingName}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default RegisterEmployee;
