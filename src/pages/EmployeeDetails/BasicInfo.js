import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import Swal from "sweetalert2";
import { getData } from "../../Services/Api";
import { Basic_Employee } from "../../Services/service";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

import { designation, department, Employeee } from "../../Services/service";
import swal from "sweetalert";
import { Trash2 } from "lucide-react";
import { BASE_URL } from "../helper";

const BasicInfo = () => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [editData, setEditData] = useState({
    employeeId: "",
    employeeName: "",
    whichCompany: "",
    selectDepartment: "",
    designation: "",
    email: "",
    mobile: "",
    dob: "",
    workType: "",
    ctc: "",
    pfnumber: "",
    panNumber: "",
    aadhaarNumber: "",
    joiningDate: "",
    reportingTo: "",
  });
  const [des, setDes] = useState([]);
  const FetchData = () => {
    getData(designation)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.Status == 200) {
          setDes(res?.Data);
        }
      })
      .catch((err) => console.error(err));
  };

  const [reportingToOptions, setReportingToOptions] = useState([]);
  const fetchReportingToOptions = () => {
    getData(Employeee)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "reportingTo");
        setReportingToOptions(data);
      })
      .catch((err) => {
        console.log("Error in categories from Post Form", err);
        console.log("Error code", err);
      });
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success m-3",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  console.log("hello");

  const handleDelete = (employeeId) => {
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
          fetch(`${BASE_URL}/basic/delete/${employeeId}`, {
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
                BasicEmployee();
              }
            });
        }
      });
  };
  const [dep, setDep] = useState([]);
  const Department = () => {
    getData(department)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "dep");
        setDep(data?.Data);
      })
      .catch((err) => {
        console.log("Error in categories from Post Form", err);
        console.log(" code Error", err);
      });
  };
  const BasicEmployee = () => {
    getData(Basic_Employee)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "res11111");
        setTicketDetails(res?.Data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    BasicEmployee();
    FetchData();
    Department();
    fetchReportingToOptions();
  }, []);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setEditData(rowData);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    const url = `${BASE_URL}/basic/update/${selectedRow.employeeId}`; // Replace with your updated API endpoint
    try {
      const response = await axios.put(url, editData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response, "aaaaaa");
      const updatedData = response.data;
      setData(updatedData);
      console.log("qqqqqqqqq", updatedData);
      setShowModal(false);
      swal("Success", "Data Updated Successfully", "success");
      BasicEmployee();
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
        <div>
          <h2>Basic Information Data</h2>
        </div>
        <hr></hr>
        <MaterialTable
          title="Basic Information Record"
          data={ticketDetails}
          columns={[
            {
              title: "Employee Id",
              field: "employeeId",
            },
            {
              title: "Employee Name",
              field: "employeeName",
            },
            {
              title: "Company",
              field: "whichCompany",
            },

            {
              title: "Department Name",
              field: "selectDepartment",
            },
            {
              title: "Designation Name",
              field: "designation",
            },
            {
              title: "Email Id",
              field: "email",
            },
            {
              title: "Mobile Number",
              field: "mobile",
            },

            {
              title: "Joining Date",
              field: "joiningDate",
            },
            {
              title: "Reporting To",
              field: "reportingTo",
            },
            {
              title: "Date of Birth",
              field: "dob",
            },
            {
              title: "CTC",
              field: "ctc",
            },
            {
              title: "PF Number",
              field: "pfnumber",
            },
            {
              title: "PAN Number",
              field: "panNumber",
            },
            {
              title: "Work Type",
              field: "workType",
            },
            {
              title: "Aadhar Number",
              field: "aadhaarNumber",
            },

            {
              title: "Actions",
              field: "actions",
              render: (rowData) => (
                <span className="push-button">
                  <Trash2
                    color="#c07c7c"
                    onClick={() => handleDelete(rowData.employeeId)}
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
          icons={
            {
              // Export: () => <SaveAlt />,
            }
          }
          options={{
            exportButton: true,
            exportCsv: (columns, data) => {
              alert(
                "You should develop a code to export " + data.length + " rows"
              );
            },
          }}
        />
      </div>
      <div className="modal">
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Basic Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Render input fields for editing data */}

              <Form.Group controlId="employeeId">
                <Form.Label>Basic ID</Form.Label>
                <Form.Control
                  type="text"
                  name="employeeId"
                  value={editData.employeeId}
                  onChange={handleInputChange}
                  disabled
                />
              </Form.Group>

              <Form.Group controlId="employeeName">
                <Form.Label>Employee Name</Form.Label>
                <Form.Control
                  type="text"
                  name="employeeName"
                  value={editData.employeeName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="selectDepartment">
                <Form.Label>Department Name</Form.Label>
                <Form.Control
                  className="form-select"
                  name="selectDepartment"
                  value={editData.selectDepartment}
                  onChange={handleInputChange}
                  as="select"
                >
                  {Array.isArray(dep) &&
                    dep.map((depItem, index) => (
                      <option
                        key={index}
                        value={depItem.departmentName}
                        select={
                          editData.selectDepartment === depItem.departmentName
                        }
                      >
                        {depItem.departmentName}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="designation">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  className="form-select"
                  name="designation"
                  value={editData.designation}
                  onChange={handleInputChange}
                  as="select"
                >
                  {Array.isArray(des) &&
                    des.map((desItem, index) => (
                      <option
                        key={index}
                        value={desItem.designationName}
                        selected={
                          editData.designation === desItem.designationName
                        }
                      >
                        {desItem.designationName}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>

              {/* 
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                />
              </Form.Group> */}
              <Form.Group controlId="mobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile"
                  value={editData.mobile}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="pfnumber">
                <Form.Label>Pf Number</Form.Label>
                <Form.Control
                  type="text"
                  name="pfnumber"
                  value={editData.pfnumber}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="dob">
                <Form.Label>D.O.B</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={editData.dob}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="joiningDate">
                <Form.Label>Joining Date</Form.Label>
                <Form.Control
                  type="date"
                  name="joiningDate"
                  value={editData.joiningDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="workType">
                <Form.Label>Work Type</Form.Label>
                <Form.Control
                  className="form-select"
                  as="select"
                  name="workType"
                  value={editData.workType}
                  onChange={handleInputChange}
                >
                  <option value="technical">Technical</option>
                  <option value="nontechnical">Non-Technical</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="reportingTo">
                <Form.Label>Reporting To</Form.Label>
                <Form.Control
                  className="form-select"
                  name="reportingTo"
                  value={editData.reportingTo}
                  onChange={handleInputChange}
                  as="select"
                >
                  {reportingToOptions.map((resItem, index) => (
                    <option
                      key={index}
                      value={resItem.employeeName}
                      selected={editData.employeeName === resItem.reportingTo}
                    >
                      {resItem.employeeName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="pfnumber">
                <Form.Label>PF Number</Form.Label>
                <Form.Control
                  type="text"
                  name="pfnumber"
                  value={editData.pfnumber}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="ctc">
                <Form.Label>CTC</Form.Label>
                <Form.Control
                  type="text"
                  name="ctc"
                  value={editData.ctc}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="panNumber">
                <Form.Label>PAN Number</Form.Label>
                <Form.Control
                  type="text"
                  name="panNumber"
                  value={editData.panNumber}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="aadhaarNumber">
                <Form.Label>Aadhaar Number</Form.Label>
                <Form.Control
                  type="text"
                  name="aadhaarNumber"
                  value={editData.aadhaarNumber}
                  onChange={handleInputChange}
                />
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

export default BasicInfo;
