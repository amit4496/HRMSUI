import { useEffect, useState } from "react";
import swal from "sweetalert";
import { getData, postData } from "../../Services/Api";
import { Employeee, User, post_attendance } from "../../Services/service";
import Swal from "sweetalert2";

const AddAttendance = () => {
  const [data, setData] = useState({
    selectEmployee: "",
    userName: "",
    status: "",
    inTime: "",
    outTime: "",
  });
  const [errors, setErrors] = useState({
    selectEmployee: "",
    userName: "",
    status: "",
    inTime: "",
    outTime: "",
  });
  const [errorShow, setErrorShow] = useState(false);
  const [show, setShow] = useState([]);
  const [hide, setHide] = useState([]);
  const [name, setName] = useState([]);
  const [user, setUser] = useState([]);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
    if (e.target.name === "username") {
      setUser(e.target.value);
    }
    if (e.target.name === "selectEmployee") {
      setName(e.target.value);
    }
  };

  useEffect(() => {
    const myData = hide?.filter((item) => item.employeeName == name);

    console.log("my emp", myData, name);
    setUser(myData[0]?.username);
    setData({
      selectEmployee: myData[0]?.employeeName,
      userName: myData[0]?.username,
    });
  }, [name]);

  const fetchData1 = () => {
    getData(User)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "res");
        setShow(res.Data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData1();
  }, []);

  const fetchData2 = async () => {
    try {
      const response = await getData(Employeee);
      const data = await response.json();
      console.log("edefef", data);
      setHide(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData2();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, post_attendance);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Attendance Name Added");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Attendance completed",
          timer: 1000,
        });
        setData({
          selectEmployee: "",
          userName: "",
          status: "",
          inTime: "",
          outTime: "",
        });
        setUser("");
        setName("");
        setErrors({
          selectEmployee: "",
          userName: "",
          status: "",
          inTime: "",
          outTime: "",
        });
        setErrorShow(false);
      } else {
        setErrors({
          selectEmployee: res?.selectEmployee || "",
          userName: res?.userName || "",
          status: res?.status || "",
          inTime: res?.inTime || "",
          outTime: res?.outTime || "",
        });
        setErrorShow(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h4>Add Attendance</h4>
      <hr />
      <div className="bg-light">
        <div className="row ">
          <div className="col-sm-4 mt-2">
            <label for="cars" id="label">
              Employee Name:<span style={{ color: "red" }}> * </span>{" "}
            </label>
            <input
              value={name}
              class="form-control"
              aria-label="Default select example"
              name="selectEmployee"
              placeholder="Employee Name"
              onChange={inputChangeHandler}
              list="employee"
            />
            <datalist id="employee">
              <option>select employee</option>
              {hide.map((e) => (
                <option valueType={e.employeeName}>{e.employeeName}</option>
              ))}
            </datalist>

            {errorShow && (
              <span className="Errorsmessage">{errors.selectEmployee}</span>
            )}
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
              onChange={inputChangeHandler}
              disabled
            >
              <option>select user ID</option>
              {hide?.map((e) => (
                <option valueType={e.username}>{e.username}</option>
              ))}
            </select>
            {errorShow && (
              <span className="Errorsmessage">{errors.userName}</span>
            )}
          </div>

          <div className="col-sm-4 mt-2">
            <label for="cars" id="label">
              Status: <span style={{ color: "red" }}> * </span>
            </label>
            <br />
            <select
              value={data.status}
              class="form-select"
              aria-label="Default select example"
              name="status"
              onChange={inputChangeHandler}
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
            {errorShow && (
              <span className="Errorsmessage">{errors.status}</span>
            )}
          </div>

          <div className="col-sm-4 mt-2">
            <label for="cars" id="label">
              In Time:<span style={{ color: "red" }}> * </span>
            </label>
            <br />
            <input
              value={data.inTime}
              type="time"
              class="form-control"
              aria-label="Default select example"
              name="inTime"
              onChange={inputChangeHandler}
            />
            {errorShow && (
              <span className="Errorsmessage">{errors.inTime}</span>
            )}
          </div>
          <div className="col-sm-4 mt-2">
            <label for="cars" id="label">
              Out Time:<span style={{ color: "red" }}> * </span>
            </label>
            <br />
            <input
              value={data.outTime}
              type="time"
              class="form-control"
              aria-label="Default select example"
              name="outTime"
              onChange={inputChangeHandler}
            />
            {errorShow && (
              <span className="Errorsmessage">{errors.outTime}</span>
            )}
          </div>
        </div>

        <button onClick={submitHandler} className="btn btn-primary mt-4">
          Save
        </button>
      </div>
    </div>
  );
};

export default AddAttendance;
