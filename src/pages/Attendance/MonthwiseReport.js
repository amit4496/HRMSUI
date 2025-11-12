import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../helper";
import MaterialTable from "@material-table/core";
import { getData, postData } from "../../Services/Api";
import {
  Employeee,
  User,
  get_attendence,
  post_attendencebyDate,
} from "../../Services/service";
import Swal from "sweetalert2";

function MonthwiseReport() {
  const [formData, setFormData] = useState({
    name: "",
    startdate: "",
    enddate: "",
    userName: "",
  });

  const [error, setError] = useState(false);
  const [view, setView] = useState([]);
  const [xyz, setXyz] = useState([]);
  const [name, setName] = useState([]);
  const [user, setUser] = useState([]);

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Regex pattern to allow only alphabets and spaces
    const regex = /^[a-zA-Z\s]*$/;

    if (name === "name" && !regex.test(value)) {
      // Invalid input, show error message or handle validation error
      // For example, you can display an error message or prevent form submission
      // Here, I'm setting an empty value for the name field
      setFormData({ ...formData });
      setError(true);
      return;
    }

    setFormData({ ...formData, [name]: value });
    setError(false);
    if (e.target.name === "username") {
      setUser(e.target.value);
    }
    if (e.target.name === "name") {
      setName(e.target.value);
    }
  };

  useEffect(() => {
    const myData = xyz?.filter((item) => item.employeeName == name);

    console.log("my emp", myData, name);
    setUser(myData[0]?.username);
    setFormData({
      name: myData[0]?.employeeName,
      userName: myData[0]?.username,
    });
  }, [name]);

  const handleSubmit = (e) => {
    if (
      !(
        formData.name &&
        formData.userName &&
        formData.startdate &&
        formData.enddate
      )
    ) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Enter your name first!",
      });
    } else {
      axios
        .post(`${BASE_URL}/attendance/byDate`, formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setView(response.data);
            // Swal.fire("Success", "Data Fetched Successfully","success")
            setFormData({
              name: "",
              userName: "",
              startdate: "",
              enddate: "",
              status: "",
            });
            setUser("");
          }
        })
        .catch((error) => {
          console.log(error);
          Swal.fire("Error", error.response.data.error_message, "error");
          console.log(error.response.data.error_message);
          setFormData({
            name: "",
            userName: "",
            startdate: "",
            enddate: "",
          });
          setUser("");
        });
    }
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
      <div>
        <h2>Monthwise Attendance Details</h2>
        <hr></hr>
        <div className="row">
          <div className=" col-sm-4">
            <label class="form-label">
              Employee Name:<span style={{ color: "red" }}> * </span>
            </label>
            <input
              value={formData.name}
              type="text"
              className="form-control"
              id="formGroupExampleInput"
              name="name"
              onChange={handleChange}
              placeholder="Select Employeee Name"
              list="employee"
              required
            />
            <datalist id="employee">
              {xyz.map((item) => (
                <option value={item.employeeName}></option>
              ))}
            </datalist>
            {error ? (
              <span style={{ color: "red" }}>
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i> Only
                Alphabets and Spaces are allowed.
              </span>
            ) : null}
          </div>

          <div className="col-sm-4 mt-2">
            <label for="cars" id="label">
              User Id :<span style={{ color: "red" }}> * </span>{" "}
            </label>
            <br />
            <select
              value={user}
              class="form-select"
              aria-label="Default select example"
              name="userName"
              onChange={handleChange}
            >
              <option>select user Id</option>
              {xyz?.map((e) => (
                <option valueType={e.username}>{e.username}</option>
              ))}
            </select>
            {/* {errorShow && <span className="Errorsmessage">{errors.userName}</span>} */}
          </div>

          <div className="col-sm-4">
            <label class="form-label">
              {" "}
              From Date :<span style={{ color: "red" }}> * </span>
            </label>
            <br />
            <input
              value={formData.startdate}
              type="date"
              class="form-control"
              id="formGroupExampleInput"
              name="startdate"
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-4">
            <label class="form-label">
              {" "}
              To Date :<span style={{ color: "red" }}> * </span>
            </label>
            <br />
            <input
              value={formData.enddate}
              type="date"
              class="form-control"
              id="formGroupExampleInput"
              name="enddate"
              onChange={handleChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-4"
          onClick={handleSubmit}
        >
          View
        </button>
      </div>
      <br></br>
      <MaterialTable
        style={{ width: "78vw", margin:'0 auto'}}
        columns={[
          { title: "ID", field: "id" },
          { title: "Employee Name", field: "selectEmployee" },
          { title: "Date", field: "date" },
          { title: "In Time", field: "inTime" },
          { title: "Out Time", field: "outTime" },
          { title: "Status", field: "status" },
        ]}
        data={view}
        title="Attendence Record"
      />
    </>
  );
}
export default MonthwiseReport;
