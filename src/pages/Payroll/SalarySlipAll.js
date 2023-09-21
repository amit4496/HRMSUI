import MaterialTable from "@material-table/core";
import React from "react";
import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { getData } from "../../Services/Api";
import Swal from "sweetalert2";
import axios from "axios";
import view from "../../../src/components/img/folder-unscreen.gif";
import {
  department,
  designation,
  get_salarySlipAll,
} from "../../Services/service";
import PrintIcon from "@material-ui/icons/Print";
import swal from "sweetalert";
import "jspdf-autotable";
import XLSX from "xlsx";
import { get } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import "./button.css";
import { Trash2 } from "lucide-react";

function SalarySlipAll() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [ticketDetails, setTicketDetails] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [isDownloading, setIsDownloading] = useState(false);
  const [formData, setFormData] = useState({
    month: "",
  });
  const [form, setForm] = useState({
    month: "",
  });

  const openPopup = (rowData) => {
    setSelectedRowData(rowData);
    setShowPopup(true);
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const inputChangeHandler1 = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  const columns = [
    { title: "Slip Id", field: "slipId" },
    { title: "Month", field: "monthFor" },
    { title: "Employee Id", field: "id" },
    { title: "Employee Name", field: "name" },
    { title: "Email Id", field: "emailId" },
    { title: "Mobile Number", field: "mobile" },
    { title: "Date of Birth", field: "dob" },
    { title: "Bank Name", field: "bankName" },
    { title: "Account Number", field: "bankAccountNumber" },
    { title: "Branch", field: "bankBranch" },
    { title: "IFSC Code", field: "ifseCode" },
    { title: "PF Number", field: "pfNumber" },
    { title: "PAN Number", field: "panNumber" },
    { title: "Company", field: "company" },
    { title: "Department", field: "department" },
    { title: "Designation", field: "designation" },
    { title: "Joining Date", field: "dateOfJoining" },
    { title: "LOP", field: "lop" },
    { title: "Working Days", field: "workingDays" },
    { title: "Basic Salary", field: "basicSalary" },
    { title: "HRA", field: "hra" },
    { title: "Conveyance", field: "conveyance" },
    { title: "Other Allownace", field: "otherAllowances" },
    { title: "Over  Time", field: "overtime" },
    { title: "Provident Fund", field: "providentFund" },
    { title: "LUF", field: "conveyance" },
    { title: "Advance", field: "advance" },
    { title: "LOP Deduction", field: "lopPay" },
    { title: "Gross Earning", field: "grossEarning" },
    { title: "Gross Deduction", field: "grossDeduction" },
    { title: "NET Pay", field: "netPay" },
    { title: "Created", field: "createdOn" },
  ];

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [dep, setDep] = useState([]);
  const Department = () => {
    getData(department)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "dep");
        setDep(data?.Data);
      })
      .catch((err) => {
        console.log("Error ", err);
        console.log("Error ", err);
      });
  };

  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [desig, setDesig] = useState([]);
  const Designation = () => {
    getData(designation)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "dep");
        setDesig(data?.Data);
      })
      .catch((err) => {
        console.log("Error ", err);
        console.log("Error ", err);
      });
  };

  const handleSubmit = async (e) => {
    try {
      if (!formData.month) {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Enter Month name!",
        });
        return;
      }

      const date = new Date(formData.month);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const response = await axios.post(
        "https://apihrms.atwpl.com/salarySlip/save",
        { month: formattedDate },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setTicketDetails(response.data);
        console.log(response);

        FetchData();
        setFormData({
          month: "",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", error.response.data.error_message, "error");
      console.log(error.response.data.error_message);
      setFormData({
        month: "",
      });
    }
  };

  const FetchData = () => {
    getData(get_salarySlipAll)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "res11111");
        setTicketDetails(res?.Data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    FetchData();
    Department();
    Designation();
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  function exportSalarySlipToExcel(month) {
    if (!form.month) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Enter Month name!",
      });
    } else {
      const date = new Date(form.month);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const url = `https://apihrms.atwpl.com/salarySlip/export-to-excel/${formattedDate}`;

      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + localStorage.getItem("token"),
      };

      fetch(url, {
        method: "GET",
        headers: headers,
      })
        .then((response) => {
          if (response.status === 200) {
            console.log("API hit successful");
            setIsDownloading(true);
            setTimeout(() => {
              setIsDownloading(false);
            }, 1000);
            // Perform actions when the response is 200 (OK)
            response.blob().then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `SalarySlip_${formattedDate}.xlsx`;
              a.click();
            });
          } else {
            console.log("API hit failed");
          }
        })
        .catch((error) => {
          console.log("An error occurred during the API request:", error);
        });
    }
  }

  const [editMode, setEditMode] = useState(false);

  // const [editData, setEditData] = useState({
  //   monthFor: "",
  //   name: "",
  //   emailId: "",
  //   designation: "",
  //   basicAmount: "",
  //   mobile: "",
  //   dob: "",
  //   bankName: "",
  //   accountNumber: "",
  //   ifscCode: "",
  // });

  const handleUpdate = async () => {
    // setEditMode(false);

    const url = `https://apihrms.atwpl.com/salarySlip/update/${selectedRowData.slipId}`; // Replace with your updated API endpoint
    try {
      const response = await axios.put(url, selectedRowData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response, "aaaaaa");
      const updatedData = response.data;
      setSelectedRowData(updatedData);
      console.log("qqqqqqqqq", updatedData);

      setSelectedDepartment(updatedData);
      setEditMode(false);
      setShowPopup(false);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Data Saved Succesfully",
        showConfirmButton: false,
        timer: 1000,
      });
      FetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (rowData) => {
    setSelectedRowData();
    setSelectedRow(rowData);
    // setEditData(rowData);
    setShowPopup(true);
  };

  const handleDownload = () => {
    const element = document.getElementById("pdf");
    const footerElement = document.getElementsByClassName("mt-2")[0]; // Change 'footer' to the class name of your footer element

    footerElement.style.display = "none";
    const scale = 5; // Increase the scale factor for higher resolution

    html2canvas(element, { scale: scale }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 190; // Width of the PDF page
      const pdfHeight = element.offsetHeight / scale; // Adjust the value to add extra height if needed

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [200, 140],
      });

      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight, "", "FAST");
      pdf.save("file.pdf");

      footerElement.style.display = "block"; // Restore the display of the footer element
    });
  };

  const handleInputChange1 = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setSelectedDesignation(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRowData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success m-3",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const handleDelete = (slipId) => {
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
          fetch(`https://apihrms.atwpl.com/salarySlip/delete/${slipId}`, {
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

  return (
    <div className="container container-w ">
      <h1>Generate Salary Of All Employees</h1>
      <hr />
      <div className="row">
        <div className="col-sm-5">
          <label for="cars" id="label">
            Select Month To Generate Record :{" "}
          </label>
          <br />
          <input
            value={formData.month}
            type="month"
            className="form-control"
            id="month"
            name="month"
            onChange={inputChangeHandler}
          />

          <button
            type="submit"
            className="btn btn-primary mt-4"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
        <div className="col-sm-5">
          <label for="cars" id="label">
            Select Month To Download Excel :{" "}
          </label>
          <br />

          <input
            value={form.month}
            type="month"
            className="form-control"
            id="month"
            name="month"
            onChange={inputChangeHandler1}
            // placeholder="Enter your Month  ."
          />

          {/* <button
            type="submit"
            className="downloadbtn mt-4"
            onClick={exportSalarySlipToExcel}
          >
            Download
          </button> */}
          <button
            className={`button${isDownloading ? " downloading" : ""}`}
            type="button"
            onClick={exportSalarySlipToExcel}
          >
            <span class="button__text">Download</span>
            <span class="button__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 35 35"
                id="bdd05811-e15d-428c-bb53-8661459f9307"
                data-name="Layer 2"
                class="svg"
              >
                <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
                <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
                <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
              </svg>
            </span>
          </button>
        </div>

        {/* <button className="btn btn-danger"> Download</button> */}
      </div>

      <br />
      <br />
      <MaterialTable
        style={{}}
        title="Salary Record"
        data={ticketDetails}
        columns={[
          {
            title: "Salary Slip Id",
            field: "slipId",
          },
          {
            title: "Month",
            field: "monthFor",
          },
          {
            title: "Employee Id",
            field: "employeeId",
          },
          {
            title: "Employee Name",
            field: "name",
          },

          {
            title: "Delete Record",
            field: "actions",
            render: (rowData) => (
              // <Button
              //   className="btn btn-danger"
              //   onClick={() => handleDelete(rowData.slipId)}
              // >
              <span className="push-button">
                <Trash2
                  color="#c07c7c"
                  onClick={() => handleDelete(rowData.slipId)}
                />
              </span>
              // Delete
              // </Button>
            ),
          },

          {
            title: "View Details",
            field: "actions",

            render: (rowData) => (
              <img
                src={view}
                className="viewButton"
                alt="iugfd"
                onClick={() => openPopup(rowData)}
              />

              // <Button
              //   className="custom-button primary "
              //   variant="primary"
              //   onClick={() => openPopup(rowData)}
              // >
              //   View
              // </Button>
            ),
          },
        ]}
      />
      <Modal
        show={showPopup}
        onHide={() => {
          closePopup();
          setEditMode(false);
        }}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Salary record</Modal.Title>
          {/* Empty div to push the button to the right */}
          <div className="ml-auto" style={{ marginLeft: "40%" }}>
            {editMode ? (
              // Show the "Save" button when in edit mode
              <Button variant="danger" onClick={handleUpdate}>
                Save
              </Button>
            ) : (
              // Show the "Update" button when not in edit mode
              <span
                className="fa fa-pencil-square-o"
                aria-hidden="true"
                style={{ fontSize: "25px" }}
                onClick={() => setEditMode(true)}
                type="submit"
              ></span>

              // <Button variant="primary" onClick={() => setEditMode(true)}>
              //   Updatesssssssss
              // </Button>
            )}
          </div>
        </Modal.Header>

        <Modal.Body>
          {selectedRowData && (
            <div className="updatebody">
              {editMode ? (
                <form>
                  {/* Editable table format */}
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Field</th>
                        <th>Value</th>
                      </tr>
                      <tr>
                        <td>Month</td>
                        <td>
                          <input
                            disable
                            id="monthFor"
                            name="monthFor"
                            // type="text"
                            className="form-control"
                            value={selectedRowData.monthFor}
                            // onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Employee Name</td>
                        <td>
                          <input
                            disable
                            id="name"
                            name="name"
                            className="form-control"
                            value={selectedRowData.name}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Employee ID</td>
                        <td>
                          <input
                            disable
                            id="name"
                            name="name"
                            className="form-control"
                            value={selectedRowData.employeeId}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Email Id</td>
                        <td>
                          <input
                            id="emailId"
                            name="emailId"
                            type="email"
                            className="form-control"
                            value={selectedRowData.emailId}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Mobile Number</td>
                        <td>
                          <input
                            id="mobile"
                            name="mobile"
                            type="number"
                            className="form-control"
                            value={selectedRowData.mobile}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Date of Birth</td>
                        <td>
                          <input
                            id="dob"
                            name="dob"
                            type="date"
                            className="form-control"
                            value={selectedRowData.dob}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Bank</td>
                        <td>
                          <input
                            id="bankName"
                            name="bankName"
                            type="text"
                            className="form-control"
                            value={selectedRowData.bankName}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Account Number</td>
                        <td>
                          <input
                            id="bankAccountNumber"
                            name="bankAccountNumber"
                            type="number"
                            className="form-control"
                            value={selectedRowData.bankAccountNumber}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Branch</td>
                        <td>
                          <input
                            id="bankBranch"
                            name="bankBranch"
                            type="text"
                            className="form-control"
                            value={selectedRowData.bankBranch}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>IFSC Code</td>
                        <td>
                          <input
                            id="ifscCode"
                            name="ifscCode"
                            type="text"
                            className="form-control"
                            value={selectedRowData.ifscCode}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>PF Number</td>
                        <td>
                          <input
                            id="pfNumber"
                            name="pfNumber"
                            type="number"
                            className="form-control"
                            value={selectedRowData.pfNumber}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>PAN Number</td>
                        <td>
                          <input
                            id="panNumber"
                            name="panNumber"
                            type="text"
                            className="form-control"
                            value={selectedRowData.panNumber}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Company</td>
                        <td>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            className="form-control"
                            value={selectedRowData.company}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      {/* <tr>
                        <td>Department Name</td>
                        <td>
                          <select
                            id="selectedDepartment"
                            name="selectedDepartment"
                            className="form-select"
                            value={selectedDepartment}
                            onChange={handleInputChange1}
                          >
                            {Array.isArray(dep) &&
                              dep.map((depItem, index) => (
                                <option key={index} value={depItem.department}>
                                  {depItem.departmentName}
                                </option>
                              ))}
                          </select>
                        </td>
                      </tr> */}

                      {/* <tr>
                        <td>Designation Name</td>
                        <td>
                          <select
                            id="selectedDesignation"
                            name="selectedDesignation"
                            className="form-select"
                            value={selectedDesignation}
                            onChange={handleInputChange2}
                          >
                            {Array.isArray(desig) &&
                              desig.map((desItem, index) => (
                                <option key={index} value={desItem.designation}>
                                  {desItem.designationName}
                                </option>
                              ))}
                          </select>
                        </td>
                      </tr> */}
                      <tr>
                        <td>Joining Date</td>
                        <td>
                          <input
                            id="dateOfJoining"
                            name="dateOfJoining"
                            type="date"
                            className="form-control"
                            value={selectedRowData.dateOfJoining}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>LOP</td>
                        <td>
                          <input
                            id="lop"
                            name="lop"
                            type="number"
                            className="form-control"
                            value={selectedRowData.lop}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Working Days</td>
                        <td>
                          <input
                            id="workingDays"
                            name="workingDays"
                            type="number"
                            className="form-control"
                            value={selectedRowData.workingDays}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Over Time</td>
                        <td>
                          <input
                            id="overTime"
                            name="overTime"
                            type="number"
                            className="form-control"
                            value={selectedRowData.overTime}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>OverTime Pay</td>
                        <td>
                          <input
                            id="overTimePay"
                            name="overTimePay"
                            type="number"
                            className="form-control"
                            value={selectedRowData.overTimePay}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Basic Salary</td>
                        <td>
                          <input
                            id="basicSalary"
                            name="basicSalary"
                            type="number"
                            className="form-control"
                            value={selectedRowData.basicSalary}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>HRA</td>
                        <td>
                          <input
                            id="hra"
                            name="hra"
                            type="number"
                            className="form-control"
                            value={selectedRowData.hra}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Conveyance</td>
                        <td>
                          <input
                            id="conveyance"
                            name="conveyance"
                            type="number"
                            className="form-control"
                            value={selectedRowData.conveyance}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Other Allowance</td>
                        <td>
                          <input
                            id="otherAllowances"
                            name="otherAllowances"
                            type="number"
                            className="form-control"
                            value={selectedRowData.otherAllowances}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Provident Fund</td>
                        <td>
                          <input
                            id="providentFund"
                            name="providentFund"
                            type="number"
                            className="form-control"
                            value={selectedRowData.providentFund}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>LUF</td>
                        <td>
                          <input
                            id="luf"
                            name="luf"
                            type="number"
                            className="form-control"
                            value={selectedRowData.luf}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Gratuity</td>
                        <td>
                          <input
                            id="gratuity"
                            name="gratuity"
                            type="number"
                            className="form-control"
                            value={selectedRowData.gratuity}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Advance</td>
                        <td>
                          <input
                            id="advance"
                            name="advance"
                            type="number"
                            className="form-control"
                            value={selectedRowData.advance}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>LOP Deduction</td>
                        <td>
                          <input
                            id="lopPay"
                            name="lopPay"
                            type="number"
                            className="form-control"
                            value={selectedRowData.lopPay}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Gross Earning</td>
                        <td>
                          <input
                            id="grossEarning"
                            name="grossEarning"
                            type="number"
                            className="form-control"
                            value={selectedRowData.grossEarning}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Gross Deduction</td>
                        <td>
                          <input
                            id="grossDeduction"
                            name="grossDeduction"
                            type="number"
                            className="form-control"
                            value={selectedRowData.grossDeduction}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>NET pay</td>
                        <td>
                          <input
                            id="netPay"
                            name="netPay"
                            type="number"
                            className="form-control"
                            value={selectedRowData.netPay}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      {/* <tr>
                        <td>Created On</td>
                        <td>
                          <input
                            id="createdOn"
                            name="createdOn"
                            type="date"
                            className="form-control"
                            value={selectedRowData.createdOn}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                      Add other input fields for editing */}
                    </tbody>
                  </table>
                </form>
              ) : (
                <>
                  {/* Read-only table format */}
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>Salary Slip Id</td>
                        <td>{selectedRowData.slipId}</td>
                      </tr>
                      <tr>
                        <td>Month</td>
                        <td>{selectedRowData.monthFor}</td>
                      </tr>
                      <tr>
                        <td>Employee Id</td>
                        <td>{selectedRowData.employeeId}</td>
                      </tr>
                      <tr>
                        <td>Employee Name</td>
                        <td>{selectedRowData.name}</td>
                      </tr>
                      <tr>
                        <td>Email Id</td>
                        <td>{selectedRowData.emailId}</td>
                      </tr>
                      <tr>
                        <td>Mobile Number</td>
                        <td>{selectedRowData.mobile}</td>
                      </tr>
                      <tr>
                        <td>Date of Birth</td>
                        <td>{selectedRowData.dob}</td>
                      </tr>
                      <tr>
                        <td>Bank</td>
                        <td>{selectedRowData.bankName}</td>
                      </tr>
                      <tr>
                        <td>Account Number</td>
                        <td>{selectedRowData.bankAccountNumber}</td>
                      </tr>
                      <tr>
                        <td>Branch</td>
                        <td>{selectedRowData.bankBranch}</td>
                      </tr>
                      <tr>
                        <td>IFSC Code</td>
                        <td>{selectedRowData.ifscCode}</td>
                      </tr>
                      <tr>
                        <td>PF Number</td>
                        <td>{selectedRowData.pfNumber}</td>
                      </tr>
                      <tr>
                        <td>PAN Number</td>
                        <td>{selectedRowData.panNumber}</td>
                      </tr>
                      <tr>
                        <td>Company</td>
                        <td>{selectedRowData.company}</td>
                      </tr>
                      {/* <tr>
                        <td>Department Name</td>
                        <td>{selectedRowData.department}</td>
                      </tr>
                      <tr>
                        <td>Designation Name</td>
                        <td>{selectedRowData.designation}</td>
                      </tr> */}
                      <tr>
                        <td>Joining Date</td>
                        <td>{selectedRowData.dateOfJoining}</td>
                      </tr>
                      <tr>
                        <td>LOP</td>
                        <td>{selectedRowData.lop}</td>
                      </tr>
                      <tr>
                        <td>Working Days</td>
                        <td>{selectedRowData.workingDays}</td>
                      </tr>
                      <tr>
                        <td>Paid Days</td>
                        <td>{selectedRowData.paidDays}</td>
                      </tr>
                      <tr>
                        <td>Basic Salary</td>
                        <td>{selectedRowData.basicSalary}</td>
                      </tr>
                      <tr>
                        <td>HRA</td>
                        <td>{selectedRowData.hra}</td>
                      </tr>
                      <tr>
                        <td>Conveyance</td>
                        <td>{selectedRowData.conveyance}</td>
                      </tr>
                      <tr>
                        <td>Other Allowance</td>
                        <td>{selectedRowData.otherAllowances}</td>
                      </tr>
                      <tr>
                        <td>OverTime </td>
                        <td>{selectedRowData.overTime}</td>
                      </tr>
                      <tr>
                        <td>OverTime Pay </td>
                        <td>{selectedRowData.overTimePay}</td>
                      </tr>
                      <tr>
                        <td>Provident Fund</td>
                        <td>{selectedRowData.providentFund}</td>
                      </tr>
                      <tr>
                        <td>LUF</td>
                        <td>{selectedRowData.luf}</td>
                      </tr>
                      <tr>
                        <td>Advance</td>
                        <td>{selectedRowData.advance}</td>
                      </tr>
                      <tr>
                        <td>LOP Deduction</td>
                        <td>{selectedRowData.lopPay}</td>
                      </tr>
                      <tr>
                        <td>Gross Earning</td>
                        <td>{selectedRowData.grossEarning}</td>
                      </tr>
                      <tr>
                        <td>Gratuity</td>
                        <td>{selectedRowData.gratuity}</td>
                      </tr>
                      <tr>
                        <td>Gross Deduction</td>
                        <td>{selectedRowData.grossDeduction}</td>
                      </tr>
                      <tr>
                        <td>NET pay</td>
                        <td>{selectedRowData.netPay}</td>
                      </tr>
                      {/* <tr>
                        <td>Created On</td>
                        <td>{selectedRowData.createdOn}</td>
                      </tr> */}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              closePopup();
              setEditMode(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}

export default SalarySlipAll;
