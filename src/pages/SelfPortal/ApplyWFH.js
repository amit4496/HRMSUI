import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { getData, postData } from "../../Services/Api";
import { post_WFH } from "../../Services/service";

const ApplyWFH = () => {
  const [selectedId, setSelectedId] = useState("");
  const [employee, setEmployee] = useState("");
  const [itemshow, setItemshow] = useState([]);
  const [errorShow, setErrorShow] = useState(false);

  const [data, setData] = useState({
    employeeId: localStorage.getItem("employeeId"),
    description: "",
    date:"",
    name: localStorage.getItem("user"),
  });

  const [errors, setErrors] = useState({
    employeeId: localStorage.getItem("employeeId"),
    description: "",
    date:"",
    name: localStorage.getItem("user"),
  });

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   try {
  //     const response = await getData();
  //     const data = await response.json();
  //     setItemshow(data?.Data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    let newData = { ...data };
    newData[name] = value;
    setData(newData);
    if (name === "name") {
      setEmployee(value);
    }
    if (name === "employeeId") {
      setSelectedId(value);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, post_WFH);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Data Name Added");
        swal("Success", "Data Added Successfully", "success");
        setData({
          employeeId: localStorage.getItem("employeeId"),
          description: "",
          date:"",
          name: localStorage.getItem("user"),
        });
        setEmployee("");
        setSelectedId("");
        setErrors({
          employeeId: localStorage.getItem("employeeId"),
          description: "",
          date:"",
          name: localStorage.getItem("user"),
        });
        setErrorShow(false);
      } else {
        setErrors({
          employeeId: res?.employeeId || "",
          description: res?.description || "",
          name: res?.employeeName || "",
          date: res?.date || "",
        });
        setErrorShow(true);
      }
    } catch (err) {
      setSelectedId("");
      setEmployee("");
      console.log(err);
    }
  };

  return (
    <>
      <div className="container">
        <h2>Request For Work From Home</h2>
        <hr />
        <div>
          <div className="row ">
            <div className="col-sm-3">
              <label for="cars" id="label">
                Select Id :<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <input
                value={data.employeeId}
                className="form-control"
                id="formGroupExampleInput"
                aria-label="Default select example"
                name="employeeId"
                onChange={inputChangeHandler}
                disabled
              ></input>
              {errorShow && <span className="Errorsmessage">{errors.employeeId}</span>}
            </div>
            <div className="col-sm-3">
              <label for="cars" id="label">
                Employee Name :<span style={{ color: "red" }}> * </span>{" "}
              </label>
              <br />
              <input
                value={data.name}
                className="form-control"
                id="formGroupExampleInput"
                aria-label="Default select example"
                name="name"
                onChange={inputChangeHandler}
                disabled
              />

              {errorShow && (
                <span className="Errorsmessage">{errors.name}</span>
              )}
            </div>

            <div className="col-sm-3">
              <label for="cars" id="label">
                Date :<span style={{ color: "red" }}> * </span>{" "}
              </label>
              <br />
              <input
                value={data.date}
                type="date"
                className="form-control"
                id="formGroupExampleInput"
                aria-label="Default select example"
                name="date"
                onChange={inputChangeHandler}
              />

              {errorShow && (
                <span className="Errorsmessage">{errors.date}</span>
              )}
            </div>

            <div className="col sm-3">
              <label for="cars" id="label">
                Description:<span style={{ color: "red" }}> * </span>
              </label>
              <input
                placeholder="Write something..."
                value={data.description}
                className="form-control"
                id="my box"
                rows="3"
                name="description"
                onChange={inputChangeHandler}
              ></input>
              {errorShow && (
                <span className="Errorsmessage">{errors.description}</span>
              )}
            </div>
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
    </>
  );
};

export default ApplyWFH;

