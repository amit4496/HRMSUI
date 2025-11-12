import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import { Employeee } from "../../Services/service";
import { getData } from "../../Services/Api";
import Swal from "sweetalert2";
import { format } from "date-fns";

function WFHfeedback() {
  const [formData, setFormData] = useState({
    name: "",
    startdate: "",
    enddate: "",
  });

  const [view, setView] = useState([]);
  const [xyz, setXyz] = useState([]);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [errorShow, setErrorShow] = useState(false);
  const [user, setUser] = useState("");
  const [form, setForm] = useState({
    month: "",
    feedback: "",
  });
  const [data, setData] = useState({
    employeeId: localStorage.getItem("employeeId"),
    description: "",
    date: "",
    name: localStorage.getItem("user"),
  });
  const [errors, setErrors] = useState({
    employeeId: localStorage.getItem("employeeId"),
    description: "",
    date: "",
    name: localStorage.getItem("user"),
  });

  const addNewEntry = (newEntry) => {
    setView([...view, newEntry]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const regex = /^[a-zA-Z\s]*$/;

    if (name === "name" && !regex.test(value)) {
      setFormData({ ...formData });
      setError(true);
      if (e.target.name === "username") return;
    }

    setFormData({ ...formData, [name]: value });
    setError(false);

    setUser(e.target.value);

    if (e.target.name === "name") {
      setName(e.target.value);
    }
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    let newData = { ...data };
    newData[name] = value;
    setData(newData);
  };

  const inputChangeHandler1 = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "feedback") {
      const updatedView = view.map((entry) => {
        if (entry.id === form.id) {
          return { ...entry, feedback: value };
        }
        return entry;
      });
      setView(updatedView);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Split the date string into parts
    const dateParts = data.date.split("-");
  
    // Create a Date object
    const selectedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  
    if (isNaN(selectedDate)) {
      Swal.fire("Error", "Please select a valid date.", "error");
      return;
    }
  
    const formattedMonth = format(selectedDate, "MMMM yyyy");
    const month1 = formattedMonth.toUpperCase();
  
    // Create a new entry object
    const newEntry = {
      id: view.length + 1,
      selectEmployee: formData.name,
      Date: selectedDate, // Store the Date object
      description: form.feedback,
    };
  
    // Add the new entry to the view state
    setView([...view, newEntry]);
  
    // Clear the date field after submission
    setData({ ...data, date: "" }); // Reset the date field to an empty string
  
    Swal.fire("Success", "Data Fetched Successfully", "success");
    setTimeout(function () {
      Swal.close();
    }, 1000);
  
    // Reset form fields
    setFormData({
      name: "",
    });
    setForm({
      month: "",
      feedback: "",
    });
    setName("");
    setUser("");
    setSelectValue(""); // Clear the select value
  };
  
  

  const FetchData = () => {
    getData(Employeee)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "attt");
        setXyz(data);
      });
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>WFH Feedback</h2>
        <hr />
        <div className="row">
          <div className="col-sm-4">
            <label className="form-label">
              Employee Name:<span style={{ color: "red" }}> * </span>
            </label>
            <input
              value={formData.name}
              type="text"
              className="form-control"
              id="formGroupExampleInput"
              name="name"
              onChange={handleChange}
              placeholder="Select Employee Name"
              list="employee"
              required
            />
            <datalist id="employee">
              {xyz.map((item) => (
                <option
                  value={item.employeeName}
                  key={item.employeeName}
                ></option>
              ))}
            </datalist>
            {error ? (
              <span className="Errorsmessage">
                <i className="fa fa-exclamation-circle" aria-hidden="true"></i>{" "}
                Only Alphabets and Spaces are allowed.
              </span>
            ) : null}
          </div>

          <div className="col-sm-4 mt-2">
            <label htmlFor="cars" id="label">
              User Id :<span style={{ color: "red" }}> * </span>
            </label>
            <br />
            <select
              value={user}
              className="form-select"
              aria-label="Default select example"
              name="userName"
              onChange={handleChange}
            >
              <option>select user Id</option>
              {xyz?.map((e) => (
                <option value={e.username} key={e.username}>
                  {e.username}
                </option>
              ))}
            </select>
          </div>

          <div className="col-sm-3">
            <label for="cars" id="label">
              Date :<span style={{ color: "red" }}> * </span>{" "}
            </label>
            <br />
            <input
              value={data.date}
              type="date"
              className="form-control"
              id="formGroupExampleInput"
              aria-label="Default select example"
              name="date"
              onChange={inputChangeHandler}
            />
          </div>

          <div className="col-sm-6 mt-2">
            <label htmlFor="cars" id="label">
              Work Feedback :<span style={{ color: "red" }}>*</span>
            </label>
            <br />
            <textarea
              type="text"
              className="form-control"
              style={{ height: "70px", width: "453px" }}
              name="feedback"
              value={form.feedback}
              onChange={inputChangeHandler1}
              required
            ></textarea>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Add
        </button>
      </form>
      <br />
      <MaterialTable
  style={{ width: "78vw", margin: "0 auto" }}
  columns={[
    { title: "ID", field: "id" },
    { title: "Employee Name", field: "selectEmployee" },
    {
      title: "Date",
      field: "Date", // Make sure it matches the key in your data object
      render: (rowData) => {
        // Format the date here
        const formattedDate = format(rowData.Date, "dd/MM/yyyy");
        return formattedDate;
      },
    },
    { title: "Work Feedback", field: "description" },
  ]}
  data={view}
  title=" Record"
/>

    </>
  );
}

export default WFHfeedback;
