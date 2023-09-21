import { useState, useEffect } from "react";
import swal from "sweetalert";
import { getData, postData } from "../../../Services/Api";
import {
  User,
  event_get,
  trainingName_get,
  training_master_post,
} from "../../../Services/service";

const TrainingMaster = () => {
  const [data, setData] = useState({
    id: "",
    eventName: "",
    trainingName: "",
    employee: "",
  });

  const [errors, setErrors] = useState({
    id: "",
    eventName: "",
    trainingName: "",
    employee: "",
  });
  const [errorShow, setErrorShow] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [show, setShow] = useState([]);
  const [itemshow, setItemshow] = useState([]);
  const [train, setTrian] = useState([]);
  const [selectedId, setSelectedId] = useState([]);

  const inputChangeHandler = (e) => {
    let newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
    if (e.target.name === "employeeName") {
      setEmployee(e.target.value);
    }
    if (e.target.name === "id") {
      setSelectedId(e.target.value);
    }
  };

  useEffect(() => {
    const myData = itemshow?.filter((item) => item.employeeId == selectedId);
    console.log("my emp", myData[0]?.employeeName);

    setEmployee(myData[0]?.employeeName);
    setData({
      employee: myData[0]?.employeeName,
      id: myData[0]?.employeeId,
    });
  }, [selectedId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, training_master_post);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Data Name Added");
        swal("Success", "Data Added Successfully", "success");
        setTimeout(function() {
          swal.close();
      }, 1000);
        setData({
          id: "",
          eventName: "",
          trainingName: "",
          employee: "",
        });
        setEmployee("");
        setSelectedId("");
        setErrors({
          id: "",
          eventName: "",
          trainingName: "",
          employee: "",
        });
        setErrorShow(false);
      } else {
        setErrors({
          id: res?.id || "",
          eventName: res?.eventName || "",
          trainingName: res?.trainingName || "",
          employee: res?.employee || "",
        });
        setErrorShow(true);
      }
    } catch (err) {
      setSelectedId("");
      setEmployee("");
      console.log(err);
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

  const fetchData2 = () => {
    getData(event_get)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "branch");
        setShow(data?.Data);
      });
  };

  const fetchData3 = () => {
    getData(trainingName_get)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "branch");
        setTrian(data?.Data);
      });
  };
  useEffect(() => {
    fetchData();
    fetchData3();
    fetchData2();
  }, []);

  return (
    <div className="container2 container">
      <h2>Training Master</h2>
      <hr />
      <div className="bg-light">
        <div className="row " style={{gap:"2rem"}}>
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
            {errorShow && <span className="Errorsmessage">{errors.id}</span>}
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
              name="employee"
              onChange={inputChangeHandler}
            >
              <option>Select Employee</option>
              {itemshow.map((e) => (
                <option valueType={e.employeeName}>{e.employeeName}</option>
              ))}
            </select>
            {errorShow && (
              <span className="Errorsmessage">{errors.employee}</span>
            )}
          </div>

          <div className="col-sm-4">
            <label for="cars" id="label">
              Event Name :<span style={{ color: "red" }}> * </span>{" "}
            </label>
            <br />
            <select
              value={data.eventName}
              class="form-select"
              aria-label="Default select example"
              name="eventName"
              onChange={inputChangeHandler}
            >
              <option>Event Name</option>
              {show.map((e) => (
                <option valueType={e.name}>{e.name}</option>
              ))}
            </select>
            {errorShow && (
              <span className="Errorsmessage">{errors.eventName}</span>
            )}
          </div>
          <div className="col-sm-4">
            <label for="cars" id="label">
              Training Name :<span style={{ color: "red" }}> * </span>{" "}
            </label>
            <br />
            <select
              value={data.trainingName}
              class="form-select"
              aria-label="Default select example"
              name="trainingName"
              onChange={inputChangeHandler}
            >
              <option>Training Name</option>
              {train.map((e) => (
                <option valueType={e.trainingName}>{e.trainingName}</option>
              ))}
            </select>
            {errorShow && (
              <span className="Errorsmessage">{errors.trainingName}</span>
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
  );
};

export default TrainingMaster;
