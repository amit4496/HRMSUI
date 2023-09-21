import { useState, useEffect } from "react";
import swal from "sweetalert";
import { getData, postData } from "../../Services/Api";
import { Employeee, User, post_OverTime } from "../../Services/service";

const OvertimeReport = () => {
  const [data, setData] = useState({
    selectEmployee: "",
    userName: "",
    startTime: "",
    endTime: "",
    description: "",
    rate: "",
  });
  const [name, setName] = useState([]);
  const [user, setUser] = useState([]);

  const [errors, setErrors] = useState([]);
  const [errorShow, setErrorShow] = useState([]);
  const [hide, setHide] = useState([]);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "rate" && isNaN(Number(value))) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        rate: "Overtime rate should be a number.",
      }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, rate: "" }));
    }

    if (name === "username") {
      setUser(value);
    }

    if (name === "selectEmployee") {
      setName(value);
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
      const resp = await postData(data, post_OverTime);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Attendance Name Added");
        swal("Success", "OverTime Added Successfully", "success");
        setTimeout(function() {
          swal.close();
      }, 1000);
        setData({
          selectEmployee: "",
          userName: "",
          startTime: "",
          endTime: "",
          description: "",
          rate: "",
        });
        setUser("");
        setName("");
        setErrors({
          selectEmployee: "",
          userName: "",
          startTime: "",
          endTime: "",
          description: "",
          rate: "",
        });
        setErrorShow(false);
      } else {
        setErrors({
          selectEmployee: res?.selectEmployee || "",
          userName: res?.userName || "",
          startTime: res?.startTime || "",
          endTime: res?.endTime || res.error_message,
          description: res?.description || "",
          rate: res?.rate || "",
        });
        setErrorShow(true);
      }
    } catch (err) {
      setUser("");
      setName("");
      console.log(err);
    }
  };

  return (
    <>
      <div className="container">
        <h4>Add OverTime</h4>
        <hr />
        <div className="bg-light">
          <div className="row " style={{rowGap: "2rem"}}>
            <div className="col-sm-4 mt-2">
              <label for="cars" id="label">
                Employee Name:<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.selectEmployee}
                class="form-control"
                aria-label="Default select example"
                name="selectEmployee"
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
                User Id : <span style={{ color: "red" }}> * </span>
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
                <option>select user Id</option>
                {hide?.map((e) => (
                  <option valueType={e.username}>{e.username}</option>
                ))}
              </select>
              {errorShow && (
                <span className="Errorsmessage">{errors.userName}</span>
              )}
            </div>

            <div className="col-sm-4">
              <label class="form-label">
                Start Time :<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.startTime}
                type="time"
                class="form-control"
                id="formGroupExampleInput"
                name="startTime"
                onChange={inputChangeHandler}
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.startTime}</span>
              )}
            </div>
            <div className="col-sm-4">
              <label class="form-label">
                EndTime:<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.endTime}
                type="time"
                class="form-control"
                id="formGroupExampleInput"
                name="endTime"
                onChange={inputChangeHandler}
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.endTime}</span>
              )}
            </div>
            <div className="col-sm-4">
              <label class="form-label">
                OverTime Rate:<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.rate}
                type="text"
                class="form-control"
                id="formGroupExampleInput"
                name="rate"
                onChange={inputChangeHandler}
                placeholder="Please Write Overtime Rate Per Hour Here"
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.rate}</span>
              )}
            </div>
            <div className="col-sm-4">
              <label class="form-label">
                Description:<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.description}
                type="text"
                class="form-control"
                id="formGroupExampleInput"
                name="description"
                onChange={inputChangeHandler}
                placeholder="Write Something Here"
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.description}</span>
              )}
            </div>
          </div>
          <button onClick={submitHandler} className="btn btn-primary mt-4">
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default OvertimeReport;
