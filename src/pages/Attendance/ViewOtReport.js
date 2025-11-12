import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import { Employeee } from "../../Services/service";
import { getData } from "../../Services/Api";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { BASE_URL } from "../helper";

function OverTimeReport() {
  const [formData, setFormData] = useState({
    name: "",
    startdate: "",
    enddate: "",
  });

  const [view, setView] = useState([]);
  const [xyz, setXyz] = useState([]);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [form, setForm] = useState({
    month: "",
  });

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
  };

  useEffect(() => {
    const myData = xyz?.filter((item) => item.employeeName === name);

    console.log("my emp", myData, name);
    setUser(myData[0]?.username);
    setFormData({
      name: myData[0]?.employeeName,
      userName: myData[0]?.username,
    });
  }, [name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedMonth = format(new Date(form.month), "MMMM yyyy");
    const month1 = formattedMonth.toUpperCase();

    axios
      .post(`${BASE_URL}/OverTime/byDate`,
        {
          ...formData,
          month: month1,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        console.log(response, "eeee");
        setView(response.data.Data);
        Swal.fire("Success", "Data Fetched Successfully", "success");
        setTimeout(function () {
          Swal.close();
        }, 1000);

        setFormData({
          name: "",
        });
        setForm({
          month: "",
        });
        setName("");
        setUser("");
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
        });
        setName("");
        setUser("");
        setView([]);
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Overtime Report</h2>
        <hr></hr>
        <div className="row">
          <div className="col-sm-4">
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
              placeholder="Select Employee Name"
              list="employee"
              required
            />
            <datalist id="employee">
              {xyz.map((item) => (
                <option value={item.employeeName}></option>
              ))}
            </datalist>
            {error ? (
              <span className="Errorsmessage">
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i> Only
                Alphabets and Spaces are allowed.
              </span>
            ) : null}
          </div>

          <div className="col-sm-4 mt-2">
            <label for="cars" id="label">
              User Id :<span style={{ color: "red" }}> * </span>
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
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          View
        </button>
      </form>
      <br></br>
      <MaterialTable style={{width:'78vw',margin:"0 auto"}}
        columns={[
          { title: "ID", field: "id" },
          { title: "Employee Name", field: "selectEmployee" },
          { title: "Description", field: "description" },
          { title: "Date", field: "date" },
          { title: "Start Time", field: "startTime" },
          { title: "End Time", field: "endTime" },
        ]}
        data={view}
        title="Over Time Record"
      />
    </>
  );
}

export default OverTimeReport;
