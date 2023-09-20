import { useEffect, useState } from "react";
import swal from "sweetalert";
import { getData, postData } from "../../../Services/Api";
import {
  Basic_Employee,
  create_leave,
  get_leavetype,
} from "../../../Services/service";
import firebase from "firebase/compat/app";
import "firebase/messaging";

const CreateLeave = () => {
  const [data, setData] = useState({
    selectEmployee: localStorage.getItem("user"),
    leaveApprover: "",
    leaveType: "",
    endDate: "",
    startDate: "",
    reasonForLeave: "",
    id: localStorage.getItem("employeeId"),
  });
  const [leave, setLeave] = useState([]);
  const [show, setShow] = useState([]);
  const [emp, setEmp] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [employee, setEmployee] = useState([]);

  const [errors, setErrors] = useState({
    selectEmployee: localStorage.getItem("user"),
    leaveApprover: "",
    leaveType: "",
    endDate: "",
    startDate: "",
    reasonForLeave: "",
    id: "",
  });
  const [errorShow, setErrorShow] = useState(false);

  const inputChangeHandler = (e) => {
    let newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const LeaveType = () => {
    getData(get_leavetype)
      .then((response) => response.json())
      .then((dataa) => {
        console.log("leave type", dataa);
        setLeave(dataa?.Data);
      })
      .catch((err) => console.log(err));
  };

  const BasicEmployee = () => {
    getData(Basic_Employee)
      .then((response) => response.json())
      .then((data) => {
        console.log("basic employee", data);
        setEmp(data?.Data);
        // setShow(data?.Data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    LeaveType();
    BasicEmployee();
  }, []);

  console.log(data, "obj");

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, create_leave);
      const res = await resp.json();
      if (res.Status == 200) {
        swal("Success", "Data Posted Successfully", "success");

        // Send Firebase notification to HR dashboard
        const messaging = firebase.messaging();
        const title = "New Leave Request";
        const body = `Leave request submitted by ${data.selectEmployee}`;

        messaging
          .getToken()
          .then((token) => {
            return fetch("https://fcm.googleapis.com/fcm/send", {
              method: "POST",
              headers: {
                "Content-Type": "application/javascript",
                Authorization: "key=AIzaSyB51UpROKbFDiEnPtrsuaMYlKSqCBJlImg",
              },
              body: JSON.stringify({
                to: token,
                notification: {
                  title: title,
                  body: body,
                },
              }),
            });
          })
          .then((response) => {
            console.log("Notification sent successfully:", response);
          })
          .catch((error) => {
            console.error("Error sending notification:", error);
          });

        setData({
          selectEmployee: localStorage.getItem("user"),
          leaveApprover: "",
          leaveType: "",
          endDate: "",
          startDate: "",
          reasonForLeave: "",
          id: localStorage.getItem("employeeId"),
        });
        setEmployee("");
        setSelectedId("");
        setErrors({
          selectEmployee: localStorage.getItem("user"),
          leaveApprover: "",
          leaveType: "",
          endDate: "",
          startDate: "",
          reasonForLeave: "",
          id: localStorage.getItem("employeeId"),
        });
        setErrorShow(false);
        setSelectedId("");
        setEmployee("");
      } else {
        setErrors({
          selectEmployee: res?.selectEmployee || "",
          leaveApprover: res?.leaveApprover || "",
          leaveType: res?.leaveType || "",
          endDate: res?.endDate || res.response,
          startDate: res?.startDate || res.error_message,
          reasonForLeave: res?.reasonForLeave || "",
          id: res?.id || "",
        });
        setErrorShow(true);
      }
    } catch (err) {
      console.log(err);
      setSelectedId("");
      setEmployee("");
    }
  };

  return (
    <>
      <div className="container">
        <h4>Create Leave Request</h4>
        <hr />
        <div>
          <div className="row ">
            <div className="col-sm-4 mt-2">
              <label for="cars" id="label">
                Select Id :<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.id}
                className="form-control"
                id="formGroupExampleInput"
                aria-label="Default select example"
                name="id"
                onChange={inputChangeHandler}
                disabled
              ></input>
              {errorShow && <span className="Errorsmessage">{errors.id}</span>}
            </div>
            <div className="col-sm-4 mt-2">
              <label for="cars" id="label">
                Employee Name :<span style={{ color: "red" }}> * </span>{" "}
              </label>
              <br />
              <input
                value={data.selectEmployee}
                className="form-control"
                id="formGroupExampleInput"
                aria-label="Default select example"
                name="selectEmployee"
                onChange={inputChangeHandler}
                disabled
              />
              {/* <option>--Select Employee--</option>
                {emp?.map((e) => (
                  <option valueType={e.employeeName}>{e.employeeName}</option>
                ))} */}

              {errorShow && (
                <span className="Errorsmessage">{errors.selectEmployee}</span>
              )}
            </div>

            <div className="col-sm-4 mt-2">
              <label for="cars" id="label">
                Leave Approver :<span style={{ color: "red" }}> * </span>{" "}
              </label>
              <br />
              <select
                value={data?.leaveApprover}
                class="form-select"
                aria-label="Default select example"
                name="leaveApprover"
                onChange={inputChangeHandler}
              >
                <option>Select Approver</option>
                {emp?.map((e) => (
                  <option valueType={e.employeeName}>{e.employeeName}</option>
                ))}
              </select>
              {errorShow && (
                <span className="Errorsmessage">{errors.leaveApprover}</span>
              )}
            </div>

            <div className="col-sm-4 mt-2">
              <label for="cars" id="label">
                Leave Type :<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <select
                value={data.leaveType}
                class="form-select"
                aria-label="Default select example"
                name="leaveType"
                onChange={inputChangeHandler}
              >
                <option>Choose Leave Type</option>
                {leave?.map((item) => (
                  <option valueType={item.leaveType}>{item.leaveType}</option>
                ))}
              </select>
              {errorShow && (
                <span className="Errorsmessage">{errors.leaveType}</span>
              )}
            </div>

            <div className="col-sm-4 mt-2">
              <label class="form-label">
                Start Date : <span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.startDate}
                type="Date"
                class="form-control"
                id="formGroupExampleInput"
                name="startDate"
                onChange={inputChangeHandler}
                required
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.startDate}</span>
              )}
            </div>

            <div className="col-sm-4 mt-2">
              <label class="form-label">
                End Date : <span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.endDate}
                type="Date"
                class="form-control"
                id="formGroupExampleInput"
                name="endDate"
                onChange={inputChangeHandler}
                required
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.endDate}</span>
              )}
            </div>

            <div className="col-sm-4 mt-2">
              <label class="form-label">
                Reason For Leave :<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <textarea
                placeholder="Write something..."
                value={data.reasonForLeave}
                className="form-control"
                id="my box"
                rows="3"
                name="reasonForLeave"
                onChange={inputChangeHandler}
                required
              ></textarea>
              {errorShow && (
                <span className="Errorsmessage">{errors.reasonForLeave}</span>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-4"
            onClick={submitHandler}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateLeave;
