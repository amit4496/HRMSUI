import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import { Employeee } from "../../Services/service";
import { getData } from "../../Services/Api";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { BASE_URL } from "../helper";

  function AddEmployeePerformance() {
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
  const [user, setUser] = useState("");
  const [project, setProject]= useState("");
  const [form, setForm] = useState({
    month: "",
    feedback: "",
  });
 
  const addNewEntry = (newEntry) => {
    setView([...view, newEntry]);
  };
   console.warn(addNewEntry);
  const selectedValue = (e) => {
    setSelectValue(e.target.value);
  };
  const NoProject =(e)=>{
   setProject(e.target.value);

  }


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

  const inputChangeHandler1 = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "feedback") {
      // Update the feedback in the table dynamically
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
    const formattedMonth = format(new Date(form.month), "MMMM yyyy");
    const month1 = formattedMonth.toUpperCase();
    
    axios
      .post(
        `${BASE_URL}/OverTime/byDate`,
        {
          EmpId: formData.name,
          name: formData.name,
          designation: user,
          month: month1,
          feedback: form.feedback,
          performanceStatus: selectValue,
          NoOfProject: project,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        console.log(response, "eeee");
    
        // Add the new entry to the view state with a unique ID
        const newEntry = {
          id: view.length + 1,
          selectEmployee: formData.name,
          description: selectValue,
          Month: month1,
          Project: project,
          feedback: form.feedback,

        };
        addNewEntry(newEntry);
    
        // Fetch data again after successfully submitting the form
        FetchData(); // Call FetchData here
    
        Swal.fire("Success", "Data Fetched Successfully", "success");
        setTimeout(function () {
          Swal.close();
        }, 1000);
    
        setFormData({
          name: "",
        });
        setForm({
          month: "",
          feedback: "",
        });
        setName("");
        setUser("");
        setSelectValue("");
      })
      .catch((error) => {
        Swal.fire("Error", error.response.data.error_message, "error");
        setTimeout(function () {
          Swal.close();
        }, 1000);
        setFormData({
          name: "",
        });
        setForm({
          month: "",
          feedback: "",
        });
        setName("");
        setUser("");
        setView([]);
        setSelectValue("");
        setProject("");
    
        console.log(error.response.data.error_message);
      });
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

  console.error(view);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Performance Details</h2>
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
              {xyz.map((saurabh) => (
                <option value={saurabh.employeeName} key={saurabh.employeeName}></option>
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
                <option value={e.username} key={e.username}>{e.username}</option>
              ))}
            </select>
          </div>

          <div className="col-sm-4">
            <label className="form-label">
              Month Name :<span style={{ color: "red" }}> * </span>
            </label>
            <br />
            <input
              value={form.month}
              type="month"
              className="form-control"
              id="month"
              name="month"
              onChange={inputChangeHandler1}
              required
            />
          </div>

          <div className="col-sm-4 ">
            <label className="form-label" htmlFor="month" id="label">
              Performance:<span style={{ color: "red" }}> * </span>
            </label>
            <select
              value={selectValue}
              className="form-select"
              aria-label="Default select example"
              name="feedback"
              onChange={selectedValue}
              required
            >
              <option value="" selected>
                Select
              </option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Below Average">Below Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="col-sm-4">
            <label className="form-label" htmlFor="month" id="label">
              Completed Projects:<span style={{ color: "red" }}> * </span>
            </label>
            <select
              value={project}
              className="form-select"
              aria-label="Default select example"
              name="feedback"
              onChange={NoProject}
              required
            >
              <option value="" selected>
                Select
              </option>
              <option value="one">1</option>
              <option value="two">2</option>
              <option value="three">3</option>
              <option value="four">4</option>
              <option value="five">5</option>
              <option value="six">6</option>
            </select>
          </div>

          <div className="col-sm-3 mt-2 ">
            <label htmlFor="cars" id="label">
              Feedback :<span style={{ color: "red" }}>*</span>
            </label>
            <br />
            <textarea
              type="text"
              className="form-control"
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
          { title: "Month", field: "Month" },
          { title: "Performance", field: "decription" },
          { title: "Completed Project", field: "Project" },
          { title: "Feedback", field: "feedback" },
        ]}
        data={view}
        title="Performance Record"
      />
    </>
  );
}

export default AddEmployeePerformance;
