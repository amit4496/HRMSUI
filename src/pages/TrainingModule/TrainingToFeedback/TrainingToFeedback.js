import { useState, useEffect } from "react";
import swal from "sweetalert";
import { getData, postData } from "../../../Services/Api";
import {
  User,
  get_trainingName,
  post_trainingFeedback,
  trainingName_get,
} from "../../../Services/service";

const TrainingToFeedback = () => {
  const [data, setData] = useState({
    employeeName: "",
    trainingName: "",
    feedback: "",
  });

  const [errors, setErrors] = useState({
    employeeName: "",
    trainingName: "",
    feedback: "",
  });

  const [errorShow, setErrorShow] = useState(false);
  const [show, setShow] = useState([]);
  const [itemshow, setItemshow] = useState([]);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchData = () => {
    getData(User)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "res");
        setShow(res.Data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData1 = () => {
    getData(trainingName_get)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, "res");
        setItemshow(res.Data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData1();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(data));

    try {
      const resp = await postData(data, post_trainingFeedback);
      const res = await resp.json();

      if (res.Status === 200) {
        console.log("Data Name Added");
        swal("Success", "Data Added Successfully", "success");
        setTimeout(function() {
          swal.close();
      }, 1000);
        setData({
          employeeName: "",
          trainingName: "",
          feedback: "",
        });
        setErrors({
          employeeName: "",
          trainingName: "",
          feedback: "",
        });
        setErrorShow(false);
      } else {
        setErrors({
          employeeName: res?.employeeName || "",
          trainingName: res?.trainingName || "",
          feedback: res?.feedback || "",
        });
        setErrorShow(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container2 container">
      <h2>Feedback Of Trainee</h2>
      <hr />
      <form>
        <div className="bg-light">
          <div className="row " style={{gap:"2rem"}}>
            <div className="col-sm-6">
              <label for="cars" id="label">
                Employee Name :<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <select
                value={data.employeeName}
                class="form-select"
                aria-label="Default select example"
                name="employeeName"
                onChange={inputChangeHandler}
              >
                <option>Choose Employee</option>
                {show.map((e) => (
                  <option valueType={e.employeeName}>{e.employeeName}</option>
                ))}
              </select>
              {errorShow && (
                <span className="Errorsmessage">{errors.employeeName}</span>
              )}
            </div>
            <div className="col-sm-6">
              <label for="cars" id="label">
                Training Name:<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <select
                value={data.trainingName}
                class="form-select"
                aria-label="Default select example"
                name="trainingName"
                onChange={inputChangeHandler}
              >
                <option>Choose Training Name</option>
                {itemshow.map((e) => (
                  <option valueType={e.trainingName}>{e.trainingName}</option>
                ))}
              </select>
              {errorShow && (
                <span className="Errorsmessage">{errors.trainingName}</span>
              )}
            </div>
            <div className="col-sm-6">
              <label class="form-label">
                Feedback:<span style={{ color: "red" }}> * </span>
              </label>
              <br />
              <textarea
                placeholder="Write something..."
                value={data.feedback}
                className="form-control"
                id="my box"
                rows="2"
                name="feedback"
                onChange={inputChangeHandler}
              ></textarea>
              {errorShow && (
                <span className="Errorsmessage">{errors.feedback}</span>
              )}
            </div>
          </div>
          <button
            onClick={submitHandler}
            type="submit"
            className="btn btn-primary btn-sm my-3 mx-5 "
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainingToFeedback;
