import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import Swal from "sweetalert2";
import { Employeee } from "../../Services/service";
import { getData } from "../../Services/Api";

function AttendanceDetails() {
  const [formData, setFormData] = useState({
    name: "",
    startdate: "",
    enddate: "",
    userName: "",
    status: "",
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
    const regex = /^[a-zA-Z\s]*$/;
    if (name === "name" && !regex.test(value)) {
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
        .post("https://apihrms.atwpl.com/attendance/status", formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (response.status === 202) {
            setView(response.data);
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
        <div className="container">
          <h2>Attendance Details</h2>
          <hr></hr>

          <div className="row">
            <div className=" col-sm-4 mt-2">
              <label for="cars" id="label">
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
              />
              <datalist id="employee">
                {xyz.map((saurabh) => (
                  <option value={saurabh.employeeName}></option>
                ))}
              </datalist>
              {error ? (
                <span style={{ color: "red" }}>
                  <i class="fa fa-exclamation-circle" aria-hidden="true"></i>{" "}
                  Only Alphabets and Spaces are allowed.
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
                class="form-control"
                aria-label="Default select example"
                name="userName"
                onChange={handleChange}
                disabled
              >
                <option>select userName</option>
                {xyz?.map((e) => (
                  <option valueType={e.username}>{e.username}</option>
                ))}
              </select>
              {/* {errorShow && <span style={{ color: "red" }}>{errors.userName}</span>} */}
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
          <br></br>

          <br></br>
          <MaterialTable
            // style={{ width: "80vw" }}
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
        </div>
      </form>
    </>
  );
}
export default AttendanceDetails;
