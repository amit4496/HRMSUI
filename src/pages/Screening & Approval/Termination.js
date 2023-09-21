import React, { useState, useEffect } from "react";
import { getData, postData } from "../../Services/Api";
import {
  User,
  get_Termiantion,
  post_Termiantion,
} from "../../Services/service";
import Swal from "sweetalert2";
import MaterialTable from "@material-table/core";
import { Spinner } from "react-bootstrap";

const Termination = () => {
  const [data, setData] = useState({
    employeeId: "",
    employeeName: "",
    userName: "",
    description: "",
    terminationDate: "",
  });

  const [errors, setErrors] = useState({
    employeeId: "",
    employeeName: "",
    userName: "",
    description: "",
    terminationDate: "",
  });
  const [description, setDescription] = useState("");
  const [errorShow, setErrorShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [show, setShow] = useState([]);
  const [itemshow, setItemshow] = useState([]);
  const [train, setTrian] = useState([]);
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState([]);
  const [ticketDetails, setTicketDetails] = useState([]);

  const inputChangeHandler = (e) => {
    setDisabled(false);
    let newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
    if (e.target.name === "employeeName") {
      setEmployee(e.target.value);
    }
    if (e.target.name === "id") {
      setSelectedId(e.target.value);
    }
    if (e.target.name === "userName") {
      setUser(e.target.value);
    }
  };

  useEffect(() => {
    const myData = itemshow?.filter((item) => item.employeeId == selectedId);
    console.log("my emp", myData[0]?.employeeName);

    setEmployee(myData[0]?.employeeName);
    setUser(myData[0]?.email);
    setData({
      employeeName: myData[0]?.employeeName,
      employeeId: myData[0]?.employeeId,
      userName: myData[0]?.email,
    });
  }, [selectedId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, post_Termiantion);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Data Name Added");
        Swal.fire({
          position: "center",
          icon: "success",
          title: `${res.Message}`,
          showConfirmButton: false,
          timer: 1000,
        });
        setData({
          employeeId: "",
          employeeName: "",
          userName: "",
          description: "",
          terminationDate: "",
        });
        FetchData();
        setEmployee("");
        setUser("");
        setSelectedId("");
        setErrors({
          employeeId: "",
          employeeName: "",
          userName: "",
          description: "",
          terminationDate: "",
        });
        setErrorShow(false);
      } else {
        setErrors({
          employeeId: res?.employeeId || "",
          employeeName: res?.employeeName || "",
          userName: res?.userName || res?.error_message,
          description: res?.description || "",
          terminationDate: res?.terminationDate || "",
        });
        setData({
          employeeId: "",
          employeeName: "",
          userName: "",
          description: "",
          terminationDate: "",
        });
        setEmployee("");
        setUser("");
        setSelectedId("");
        setErrorShow(true);
      }
    } catch (err) {
      setSelectedId("");
      setUser("");
      setEmployee("");
    } finally {
      setIsLoading(false); // Deactivate the loader
    }
  };

  const fetchData = () => {
    getData(User)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "branch");
        setItemshow(data?.Data);
      });
  };
  const FetchData = () => {
    getData(get_Termiantion)
      .then((response) => response.json())
      .then((res) => {
        if (res.Status == 200) {
          console.log("ttttttt", res?.Data);
          setTicketDetails(res?.Data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
    FetchData();
  }, []);

  return (
    <div className="container2 container-w">
      <h2>Termination Details</h2>
      <hr />
      <div className="bg-light">
        <div className="row ">
          <div className="col-sm-4">
            <label for="cars" id="label">
              Employee Id :<span style={{ color: "red" }}> * </span>{" "}
            </label>
            <br />
            <select
              value={selectedId}
              class="form-select"
              aria-label="Default select example"
              name="id"
              onChange={inputChangeHandler}
            >
              <option>Employee Id</option>
              {itemshow.map((e) => (
                <option valueType={e.employeeId}>{e.employeeId}</option>
              ))}
            </select>
            {errorShow && (
              <span className="Errorsmessage">{errors.employeeId}</span>
            )}
          </div>
          <div className="col-sm-4">
            <label for="cars" id="label">
              Employee Name :<span style={{ color: "red" }}> * </span>{" "}
            </label>
            <br />
            <select
              value={employee}
              class="form-select"
              aria-label="Default select example"
              name="employeeName"
              disabled
              onChange={inputChangeHandler}
            >
              <option>Select Employee</option>
              {itemshow.map((e) => (
                <option valueType={e.employeeName}>{e.employeeName}</option>
              ))}
            </select>
            {errorShow && (
              <span className="Errorsmessage">{errors.employeeName}</span>
            )}
          </div>

          <div className="col-sm-4">
            <label for="cars" id="label">
              Username :<span style={{ color: "red" }}> * </span>{" "}
            </label>
            <br />
            <select
              value={user}
              class="form-select"
              aria-label="Default select example"
              name="userName"
              disabled
              onChange={inputChangeHandler}
            >
              <option>UserName</option>
              {itemshow.map((e) => (
                <option valueType={e.email}>{e.email}</option>
              ))}
            </select>
            {errorShow && (
              <span className="Errorsmessage">{errors.userName}</span>
            )}
          </div>
          <div className="col-sm-4">
            <label for="cars" id="label">
              Date of Termination :<span style={{ color: "red" }}> * </span>{" "}
            </label>
            <br />
            <input
              value={data.terminationDate}
              class="form-control"
              type="date"
              aria-label="Default select example"
              name="terminationDate"
              onChange={inputChangeHandler}
            ></input>
            {errorShow && (
              <span className="Errorsmessage">{errors.terminationDate}</span>
            )}
          </div>
          <div className="col-sm-6">
            <label for="cars" id="label">
              Description :<span style={{ color: "red" }}> * </span>{" "}
            </label>
            <br />
            <textarea
              value={data.description}
              className="textarea"
              type="text"
              placeholder="Description"
              aria-label="Default select example"
              name="description"
              onChange={inputChangeHandler}
            ></textarea>
            {errorShow && (
              <span className="Errorsmessage">{errors.description}</span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={disabled || isLoading}
          onClick={submitHandler}
        >
          {isLoading ? (
            <>
              <Spinner animation="grow" />
              <span className="visually-hidden">Loading...</span>
            </>
          ) : (
            "Submit"
          )}
        </button>
        <br></br>
        <br></br>
        <MaterialTable
          title="Deduction Record"
          data={ticketDetails}
          columns={[
            {
              title: "EmployeeId",
              field: "employeeId",
            },
            {
              title: "Employee Name",
              field: "employeeName",
            },

            {
              title: "User Id",
              field: "userName",
            },
            {
              title: "Date Of Termination",
              field: "terminationDate",
            },
            {
              title: "Descripyion",
              field: "description",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Termination;
