import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { getData, postData } from "../../../Services/Api";
import { User, resignation } from "../../../Services/service";

const Resignation = () => {
  const [selectedId, setSelectedId] = useState("");
  const [employee, setEmployee] = useState("");
  const [itemshow, setItemshow] = useState([]);
  const [errorShow, setErrorShow] = useState(false);

  const [data, setData] = useState({
    id: localStorage.getItem("employeeId"),
    description: "",
    employeeName: localStorage.getItem("user"),
  });

  const [errors, setErrors] = useState({
    id: localStorage.getItem("employeeId"),
    description: "",
    employeeName: localStorage.getItem("user"),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getData(User);
      const data = await response.json();
      setItemshow(data?.Data);
    } catch (error) {
      console.log(error);
    }
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    let newData = { ...data };
    newData[name] = value;
    setData(newData);
    if (name === "employeeName") {
      setEmployee(value);
    }
    if (name === "id") {
      setSelectedId(value);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, resignation);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Data Name Added");
        swal("Success", "Data Added Successfully", "success");
        setData({
          id: localStorage.getItem("employeeId"),
          description: "",
          employeeName: localStorage.getItem("user"),
        });
        setEmployee("");
        setSelectedId("");
        setErrors({
          id: localStorage.getItem("employeeId"),
          description: "",
          employeeName: localStorage.getItem("user"),
        });
        setErrorShow(false);
      } else {
        setErrors({
          id: res?.id || "",
          description: res?.description || "",
          employeeName: res?.employeeName || "",
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
        <h2>Resignation</h2>
        <hr />
        <div>
          <div className="row ">
            <div className="col-sm-3">
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
            <div className="col-sm-3">
              <label for="cars" id="label">
                Employee Name :<span style={{ color: "red" }}> * </span>{" "}
              </label>
              <br />
              <input
                value={data.employeeName}
                className="form-control"
                id="formGroupExampleInput"
                aria-label="Default select example"
                name="employeeName"
                onChange={inputChangeHandler}
                disabled
              />
              {/* <option>--Select Employee--</option>
                {emp?.map((e) => (
                  <option valueType={e.employeeName}>{e.employeeName}</option>
                ))} */}

              {errorShow && (
                <span className="Errorsmessage">{errors.employeeName}</span>
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

export default Resignation;
