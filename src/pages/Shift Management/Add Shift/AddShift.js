import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import swal from "sweetalert";
import { getData, postData } from "../../../Services/Api";
import {
  Employeee,
  User,
  shiftManagement_post,
} from "../../../Services/service";
import Swal from "sweetalert2";

const AddShift = () => {
  const [data, setData] = useState({
    employee: "",
    country: "",
    userName: "",
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState({
    employee: "",
    country: "",
    userName: "",
    startTime: "",
    endTime: "",
  });

  const [show, setShow] = useState([]);

  const [errorShow, setErrorShow] = useState(false);
  const [name, setName] = useState([]);
  const [user, setUser] = useState([]);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
    if (e.target.name === "employee") {
      setName(e.target.value);
    }
    if (e.target.name === "userName") {
      setUser(e.target.value);
    }
  };

  useEffect(() => {
    const myData = show?.filter((item) => item.employeeName == name);

    console.log("my emp", myData, name);
    setUser(myData[0]?.username);
    setData({
      employee: myData[0]?.employeeName,
      userName: myData[0]?.username,
    });
  }, [name]);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, shiftManagement_post);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Shift Name Added");
        swal("Success", "Shift Added Successfully", "success");
        setTimeout(function() {
          swal.close();
      }, 1000);
        setData({
          employee: "",
          country: "",
          userName: "",
          startTime: "",
          endTime: "",
        });
        setName("");
        setUser("");
        setErrors({
          employee: "",
          country: "",
          userName: "",
          startTime: "",
          endTime: "",
        });
        setErrorShow(false);
        setName("");
        setUser("");
      } else {
        setErrors({
          employee: res?.employee || "",
          country: res?.country || "",
          userName: res?.userName,
          startTime: res?.startTime || "",
          endTime: res?.endTime || "",
        });
        setErrorShow(true);
        setName("");
        setUser("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData1 = () => {
    getData(Employeee)
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "rep");
        setShow(data);
      })
      .catch((err) => {
        console.log("Error in categories from Post Form", err);
        console.log(" code Error", err);
      });
  };

  useEffect(() => {
    fetchData1();
  }, []);

  return (
    <>
      <div className="container">
        <h2>Shift Duty Assign</h2>
        <hr />
        <div>
          <div className="row ">
            <div className="col-sm-4">
              <label for="car" id="label">
                Employee Name :<span style={{ color: "red" }}> * </span>
              </label>

              <input
                value={name}
                type="text"
                class="form-control"
                aria-label="Default select example"
                name="employee"
                placeholder="Employee Name"
                onChange={inputChangeHandler}
                list="employee"
              />
              <datalist id="employee">
                {show.map((e) => (
                  <option valueType={e.employeeName}>{e.employeeName}</option>
                ))}
              </datalist>

              {errorShow && (
                <span className="Errorsmessage">{errors.employee}</span>
              )}
            </div>

            <div className="col-sm-4">
              <label for="car" id="label">
                User Id :<span style={{ color: "red" }}> * </span>
              </label>

              <select
                value={user}
                class="form-control"
                aria-label="Default select example"
                name="userName"
                onChange={inputChangeHandler}
                disabled
              >
                <option>Select User Id</option>
                {show.map((e) => (
                  <option valueType={e.username}>{e.username}</option>
                ))}
              </select>
              {errorShow && (
                <span className="Errorsmessage">{errors.userName}</span>
              )}
            </div>

            <div className="col-sm-4 ">
              <label for="cars" id="label">
                Country :<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <select
                value={data.country}
                class="form-select"
                aria-label="Default select example"
                name="country"
                onChange={inputChangeHandler}
              >
                <option>Choose Shift</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="Japan">Japan</option>
                {/* <option valueType="afternoon">Shift C</option>
              <option valueType="Evening">Shift D</option> */}
              </select>
              {errorShow && (
                <span className="Errorsmessage">{errors.country}</span>
              )}
            </div>

            <div className="col-sm-4 mt-2">
              <label for="cars" id="label">
                Start Time:<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.startTime}
                type="time"
                class="form-control"
                aria-label="Default select example"
                name="startTime"
                onChange={inputChangeHandler}
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.startTime}</span>
              )}
            </div>
            <div className="col-sm-4 mt-2">
              <label for="cars" id="label">
                End Time:<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.endTime}
                type="time"
                class="form-control"
                aria-label="Default select example"
                name="endTime"
                onChange={inputChangeHandler}
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.endTime}</span>
              )}
            </div>
          </div>
          <button
            type="submit"
            onClick={submitHandler}
            className="btn btn-primary mt-4"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default AddShift;
