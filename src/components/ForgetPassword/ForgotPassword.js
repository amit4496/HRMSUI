import React, { useEffect, useState } from "react";
import classes from "../../Services/forgot.module.css";
import ahom from "../img/AhomNew.png";
import Swal from "sweetalert2";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";

const ForgotPassword = (props) => {
  const [formData, setFormData] = useState({
    userName: "",
    otp: "",
  });

  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [view, setView] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [timer, setTimer] = useState(300);
  const [intervalId, setIntervalId] = useState(null);
  const navigate = useNavigate();

  const inputChangeHandler = (e) => {
    setDisabled(false);
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError(false);
  };

  const startTimer = () => {
    setTimer(300); // Reset the timer to 5 minutes (300 seconds)
    const id = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    setIntervalId(id);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.userName) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Enter your Email first!",
      });
      setLoading(false);
    } else {
      setLoading(true);
      axios
        .post("https://apihrms.atwpl.com/api/forgot-password/email", null, {
          params: {
            userName: formData.userName,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setData(response.data);
            setSubmitted(true);
            setFormData((prevData) => ({ ...prevData, otp: "" }));
            startTimer();
          }
        })
        .catch((error) => {
          console.log(error);
          Swal.fire("Error", error.response.data.error_message, "error");
          console.log(error.response.data.error_message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    setLoading(true);
    startTimer();
    if (!formData.userName) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Enter your Email first!",
      });
      setLoading(false);
    } else {
      setLoading(true);
      axios
        .post("https://apihrms.atwpl.com/api/forgot-password/email", null, {
          params: {
            userName: formData.userName,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setData(response.data);
            setSubmitted(true);
            setFormData((prevData) => ({ ...prevData, otp: "" }));
          }
        })
        .catch((error) => {
          console.log(error);
          Swal.fire("Error", error.response.data.error_message, "error");
          console.log(error.response.data.error_message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const verifyOtpHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.otp) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Enter the OTP first!",
      });
    } else {
      setLoading(true);
      axios
        .post("https://apihrms.atwpl.com/api/forgot-password/verifyOtp", null, {
          params: {
            userName: formData.userName,
            otp: formData.otp,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setView(response.data);
            setSubmitted(true);
            // navigate("/reset");
            navigate("/reset", {
              state: { username: formData.userName, otp: formData.otp },
            });
          }
        })
        .catch((error) => {
          console.log(error);
          Swal.fire("Error", error.response.data.error_message, "error");
          console.log(error.response.data.error_message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    return () => {
      // Clean up the interval when the component is unmounted or the OTP is verified
      clearInterval(intervalId);
    };
  }, [intervalId]);

  // Format the remaining time as minutes and seconds
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  let message;

  if (timer > 0) {
    message = `Remaining Time: ${formattedTime}`;
  } else {
    message = "OTP Expired";
  }

  if (submitted) {
    return (
      <div className={classes.body}>
        {/* New Component for the Second Page */}
        <div className={classes.saurabh}>
          <div className={classes.appForm}>
            <div className={classes.logo}>
              <img src={ahom} alt="logo" />
            </div>
            <form onSubmit={verifyOtpHandler} className={classes.formField}>
              <div className={classes.formField}>
                <label htmlFor="username" className={classes.formFieldLabel}>
                  Username:
                </label>
                <input
                  className={classes.formFieldInput}
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={inputChangeHandler}
                  placeholder="Please Enter Your Email"
                  disabled
                />
              </div>

              {/* OTP field */}
              <div className={classes.formField}>
                <label htmlFor="otp" className={classes.formFieldLabel}>
                  OTP:
                </label>
                <input
                  className={classes.formFieldInput}
                  type="number"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={inputChangeHandler}
                  placeholder="Enter OTP here"
                />
              </div>
              <div>
                <p>{message}</p>
              </div>
              <span
                className={classes.forgotPasswordLink}
                style={{
                  color: "grey",
                  textDecoration: "underline",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
                onClick={handleClick}
              >
                Resend OTP?
              </span>
              <button
                className={classes.formFieldButton}
                type="submit"
                disabled={loading}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.body}>
      <div className={classes.saurabh}>
        <div className={classes.appForm}>
          <div className={classes.logo}>
            <img src={ahom} alt="logo" />
          </div>
          <form onSubmit={submitHandler} className={classes.formField}>
            {error && <p className="Errorsmessage">{error}</p>}
            <div className={classes.formField}>
              <label htmlFor="username" className={classes.formFieldLabel}>
                Username:
              </label>
              <input
                className={classes.formFieldInput}
                type="email"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={inputChangeHandler}
                placeholder="Please Enter Your Email"
              />
            </div>
            <button
              className={classes.formFieldButton}
              type="submit"
              disabled={disabled || loading}
              // onClick={submitHandler}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Loading...</span>
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
