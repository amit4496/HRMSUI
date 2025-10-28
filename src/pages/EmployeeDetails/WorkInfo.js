import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { getData } from "../../Services/Api";
import { work_data } from "../../Services/service";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import { getAllEmp } from "../../Services/service";
import swal from "sweetalert";
import { BASE_URL } from "../helper";

const WorkInfo = () => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({
    workId: "",
    employeeName: "",
    employmentType: "",
    officeBranch: "",
    gender: "",
    bloodGroup: "",
    address: "",
  });

  const fetchData = () => {
    getData(work_data)
      .then((response) => response.json())
      .then((resp) => {
        console.log(resp, "resss");
        setTicketDetails(resp);
      })
      .catch((err) => console.error(err));
  };
  const [empt, setEmpt] = useState([]);
  const Employement = () => {
    getData(getAllEmp)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "empyt");
        if (res.Status == 200) {
          setEmpt(res?.Data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
    Employement();
  }, []);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const url = `${BASE_URL}/work/update/${selectedRow.workId}`; // Replace with your updated API endpoint
    try {
      const response = await axios.put(url, editData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
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
    <div className="container" style={{ width: "80vw" }}>
      <div>
        <h1>Work Information Data</h1>
      </div>
      <hr></hr>
      <div>
        <MaterialTable
          title="Work Information Record"
          data={ticketDetails}
          columns={[
            {
              title: "Work ID",
              field: "workId",
            },
            {
              title: "Employee Name",
              field: "employeeName",
            },
            {
              title: "Employment Type",
              field: "employmentType",
            },
            {
              title: "Office Branch",
              field: "officeBranch",
            },
            {
              title: "Gender",
              field: "gender",
            },
            {
              title: "Blood Group",
              field: "bloodGroup",
            },

            {
              title: "Address",
              field: "address",
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
            <Modal.Title>Edit Work Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Render input fields for editing data */}
              <Form.Group controlId="workId">
                <Form.Label>Work ID</Form.Label>
                <Form.Control
                  type="text"
                  name="workId"
                  value={editData.workId}
                  onChange={handleInputChange}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  className="form-select"
                  as="select"
                  name="gender"
                  value={editData.gender}
                  onChange={handleInputChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="officeBranch">
                <Form.Label>Office Branch</Form.Label>
                <Form.Control
                  type="text"
                  name="officeBranch"
                  value={editData.officeBranch}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="bloodGroup">
                <Form.Label>Blood Group</Form.Label>
                <Form.Control
                  className="form-select"
                  as="select"
                  name="bloodGroup"
                  value={editData.bloodGroup}
                  onChange={handleInputChange}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="employmentType">
                <Form.Label>Employment Type</Form.Label>
                <Form.Control
                  className="form-select"
                  name="employmentType"
                  value={editData.employmentType}
                  onChange={handleInputChange}
                  as="select"
                >
                  {Array.isArray(empt) &&
                    empt.map((emptItem, index) => (
                      <option
                        key={index}
                        value={emptItem.employmentType}
                        selected={
                          editData.employmentType === emptItem.employmentType
                        }
                      >
                        {emptItem.employmentType}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleInputChange}
                />
              </Form.Group>
              {/* Add more input fields for other data properties */}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default WorkInfo;
