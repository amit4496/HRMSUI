import React, { useState } from "react";
import MaterialTable from "@material-table/core";
import "./RequirementDetail.css";
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for react-datepicker
import Swal from "sweetalert2";

function RequirementDetail() {
  const [selectValue, setSelectValue] = useState("");
  const [selectExp, setSelectExp] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("");

  const [salary, setSalary] = useState("");
  const [form, setForm] = useState({
    feedback: "",
  });
  const [formData, setFormData] = useState({
    startdate: new Date(), // Initialize with today's date
    enddate: new Date(), // Initialize with today's date
  });
  const [error, setError] = useState(false);
  const [tableData, setTableData] = useState([]); // State to store table data
  const [tableTitle, setTableTitle] = useState("File Record"); // Initial table title

  const selectedValue = (e) => {
    setSelectValue(e.target.value);
  };

  const selectedExp = (e) => {
    setSelectExp(e.target.value);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const statuscheck = (e) => {
    setStatus(e.target.value);
  };
  const salaryBudget = (e) => {
    setSalary(e.target.value)
  }

  const inputChangeHandler1 = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
  };
  const showSuccessAlert = () => {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Form submitted successfully!",
    });
  };

  const resetFormFields = () => {
    setSelectValue("");
    setSelectExp("");
    setInputValue("");
    setStatus("");
    setSalary("");
    setForm({ feedback: "" });
    setFormData({
      startdate: new Date(),
      enddate: new Date(),
    });
    setError(false);
  };



  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (
      selectValue &&
      selectExp &&
      inputValue &&
      form.feedback &&
      status &&
      formData.startdate &&
      formData.enddate
    ) {

      // Create a new data object based on the form input
      const newData = {
        Openingname: selectValue,
        Experiencelevel: selectExp,
        NoOfOpenings: inputValue,
        SkillsSetRequired: form.feedback,
        SalaryBudget: salary, // Change this to the correct salary value
        Status: status,
        StartDate: formData.startdate.toISOString().substr(0, 10),
        EndDate: formData.enddate.toISOString().substr(0, 10),
      };

      // Update the table data with the new data
      setTableData([...tableData, newData]);

      // Dynamically set the table title based on the selected options
      setTableTitle(`File Record for ${selectValue} - ${selectExp}`);


      resetFormFields();
      showSuccessAlert();
    } else {
      setError(true);
    }
  };
  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="container container-w">
          <h2>Opening Details</h2>
          <hr></hr>
          <div className="flex-container-1">
            <div className="col-sm-3">
              <label className="form-label" htmlFor="month" id="label">
                Name of Designation:<span style={{ color: "red" }}> * </span>
              </label>
              <select
                value={selectValue}
                className="form-select"
                aria-label="Default select example"
                name="Openingname"
                onChange={selectedValue}
                required
              >
                <option value="" selected>
                  Select
                </option>
                <option value="angualar">Angular Js Developer</option>
                <option value="account">Accountant </option>
                <option value="devops">Devops Engineer</option>
                <option value="ux-ui">Graphic/UX-UI Designer</option>
                <option value="react">React Js Developer</option>
                <option value="native">React Native Developer </option>
                <option value="hr">HR Manager</option>
                <option value="php">PHP Developer</option>
                <option value="office">Office Admin</option>
                <option value="java">Java Developer </option>
                <option value="senior">Senior Java Developer </option>
                <option value="fullstack-java">Full Stack Java Developer</option>
                <option value="mern">MERN Stack Developer</option>
                <option value="mean">MEAN Stack Developer</option>
                <option value="flutter">Flutter Developer </option>

              </select>
            </div>

            <div className="col-sm-3">
              <label className="form-label" htmlFor="month" id="label">
                Experience Level:<span style={{ color: "red" }}> * </span>
              </label>
              <select
                value={selectExp}
                className="form-select"
                aria-label="Default select example"
                name=" Experiencelevel"
                onChange={selectedExp}
                required
              >
                <option value="" selected>
                  Select
                </option>
                <option value="0-1">0-1</option>
                <option value="1-2">1-2</option>
                <option value="2-4">2-4</option>
                <option value="4-6">4-6</option>
                <option value="6-8">6-8</option>
                <option value="8-10">8-10</option>
                <option value="10-12">10-12</option>
              </select>
            </div>
            <div className="col-sm-3" id="wap">
              <label className="form-label" htmlFor="inputField" id="label">
                No of Opening:<span style={{ color: "red" }}> * </span>
              </label>
              <input
                type="string"
                className="form-control"
                id="inputField"
                value={inputValue}
                onChange={handleInputChange}
              />
            </div>

          </div>
          <div className="flex-container-1">

            <div className="col-sm-3">
              <label htmlFor="cars" id="label">
                Skills set required :<span style={{ color: "red" }}>*</span>
              </label>
              <br />
              <textarea
                type="text"
                className="form-control"
                style={{}}
                name="feedback"
                value={form.feedback}
                onChange={inputChangeHandler1}
                required
              ></textarea>
            </div>
            <div className="col-sm-3">
              <label className="form-label" htmlFor="inputField" id="label">
                Salary Budget(LPA):<span style={{ color: "red" }}> * </span>
              </label>
              <input
                type="number"
                className="form-control"
                id="inputField"
                value={salary}
              
                onChange={salaryBudget}
              />
            </div>
            <div className="col-sm-3">
              <label className="form-label" htmlFor="month" id="label">
                Status:<span style={{ color: "red" }}> * </span>
              </label>
              <select
                value={status}
                className="form-select"
                aria-label="Default select example"
                name="level"
                onChange={statuscheck}
                required
              >
                <option value="" selected>
                  Select
                </option>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="unsucess">Unsuccess</option>

              </select>
            </div>

          </div>
          <div className="flex-container-1">
            <div className="col-sm-3">
              <label className="form-label">
                {" "}
                From Date :<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <DatePicker
                selected={formData.startdate}
                onChange={(date) => handleDateChange("startdate", date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                required
              />
            </div>

            <div className="col-sm-3">
              <label className="form-label">
                {" "}
                To Date :<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <DatePicker
                selected={formData.enddate}
                onChange={(date) => handleDateChange("enddate", date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"

                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-4"

          >
            Submit
          </button>

          <br />
          <br />


          <MaterialTable
            style={{ width: "78vw", margin: "0 auto" }}
            columns={[
              { title: "Name of Designation", field: "Openingname" },
              { title: "Experience Level", field: "Experiencelevel" },
              { title: "No of Opening", field: "NoOfOpenings" },
              { title: "Skills set required", field: "SkillsSetRequired" },
              { title: "Salary Budget", field: "SalaryBudget" },
              { title: "Status", field: "Status" },
              { title: "From Date", field: "StartDate" },
              { title: "To Date", field: "EndDate" },
            ]}
            data={tableData}
            title={tableTitle}
          />
        </div>

      </form>
    </>

  );
}

export default RequirementDetail;