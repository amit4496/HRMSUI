import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import MaterialTable from "@material-table/core";
import Swal from "sweetalert2";
import { getData } from "../../../Services/Api";
import { Employeee } from "../../../Services/service";
import { Email } from "@material-ui/icons";
import { BASE_URL } from "../../helper";

function AttendanceDetail() {
  const [formData, setFormData] = useState({
    name: localStorage.getItem("user"),
    startdate: "",
    enddate: "",
    userName: localStorage.getItem("email"),
    status: "",
  });

  const [error, setError] = useState(false);
  const [view, setView] = useState([]);
  const [xyz, setXyz] = useState([]);
  const [name, setName] = useState([]);
  const [user, setUser] = useState([]);

  console.log("emialllllll", localStorage.getItem("email"));

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
    // if(e.target.name === "username")
    // {
    //   setUser(e.target.value)

    // }
    // if(e.target.name === "name")
    // {
    //   setName(e.target.value)
    // }
  };

  // useEffect(()=>{
  //   const myData=xyz?.filter((item)=>item.employeeName == name)

  //   console.log("my emp",myData , name);
  //   setUser(myData[0]?.username)
  //   setFormData({
  //     name:myData[0]?.employeeName,
  //     userName:myData[0]?.username
  //   })
  //  },[name ])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !(
        formData.name &&
        formData.userName &&
        formData.startdate &&
        formData.enddate &&
        formData.status
      )
    ) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Enter your data first!",
      });
    } else {
      axios
        .post(`${BASE_URL}/attendance/status`, formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (response.status === 202) {
            setView(response.data);
            setFormData({
              name: localStorage.getItem("user"),
              userName: localStorage.getItem("email"),
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
            name: localStorage.getItem("user"),
            userName: localStorage.getItem("email"),
            startdate: "",
            enddate: "",
            status: "",
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
      <form>
        <h2>Attendance Details</h2>
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
              placeholder="Enter Your Name"
              list="employee"
              required
              disabled
            />
          </div>

          <div className="col-sm-4 mt-2">
            <label for="cars" id="label">
              User Id :<span style={{ color: "red" }}> * </span>{" "}
            </label>
            <br />
            <input
              value={formData.userName}
              className="form-control"
              id="formGroupExampleInput"
              aria-label="Default select example"
              name="userName"
              onChange={handleChange}
              disabled
            />
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
              required
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
              required
            />
          </div>
          <div className="col-sm-4 mt-2">
            <label for="cars" id="label">
              Status:<span style={{ color: "red" }}> * </span>
            </label>
            <br />
            <select
              value={formData.status}
              class="form-select"
              aria-label="Default select example"
              name="status"
              onChange={handleChange}
            >
              <option selected>select</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="WFH">Work From Home</option>
              <option value="un paid">Un-Paid Leave</option>
              <option value="optional">Optional Holiday</option>
              <option value="leave">Leave</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-4"
          onClick={handleSubmit}
        >
          View
        </button>
      </form>
      <br></br>
      <MaterialTable
        style={{ width: "80vw" }}
        title="Attendence Record"
        columns={[
          { title: "ID", field: "id" },
          { title: "Employee Name", field: "selectEmployee" },
          { title: "Date", field: "date" },
          { title: "In Time", field: "inTime" },
          { title: "Out Time", field: "outTime" },
          { title: "Status", field: "status" },
        ]}
        data={view}
      />
    </>
  );
}
export default AttendanceDetail;
