import React, { useState } from "react";
import classes from "../../Services/forgot.module.css";
import ahom from "../img/AhomNew.png";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { BASE_URL } from "../../pages/helper";

const PasswordReset = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const location = useLocation();
  const { username, otp } = location.state || {};
  const [formData, setFormData] = useState({
    userName: username,
    otp: otp,
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim(); // Remove leading and trailing spaces
    setFormData((prevData) => ({ ...prevData, [name]: trimmedValue }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z]).{5,}(?=.*\d.*)[A-Za-z\d@$!%*?&]/;
    if (!passwordPattern.test(formData.password)) {
      Swal.fire(
        "Error",
        "Password must start with a capital letter, have a minimum length of five characters (including a capital letter), and contain at least three numbers.",
        "error"
      );
      return;
    }

    // Confirm password pattern validation
    if (formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Passwords do not match.", "error");
      return;
    }

    axios
      .post(`${BASE_URL}/api/forgot-password/reset`, null, {
        params: {
          userName: formData.userName,
          otp: formData.otp,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          //     console.log(response,"responsesssssssss");
          // Swal.fire("Success", "Password reset successfully!", "success");
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", error.response.data.error_message, "error");
        console.log(error.response.data.error_message);
      });
  };

  return (
    <div className={classes.body}>
      <div className={classes.saurabh}>
        <div className={classes.appForm}>
          <div className={classes.logo}>
            <img src={ahom} alt="logo" />
          </div>
          <form
            onSubmit={submitHandler}
            className={classes.formField}
            style={{ width: "100%" }}
          >
            <div className={classes.formField}>
              {/* <label htmlFor="username" className={classes.formFieldLabel}>
                Username:
              </label> */}
              <input
                className={classes.formFieldInput}
                type="hidden"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={inputChangeHandler}
              />
            </div>

            <div className={classes.formField}>
              {/* <label htmlFor="otp" className={classes.formFieldLabel}>
                OTP:
              </label> */}
              <input
                className={classes.formFieldInput}
                type="hidden"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={inputChangeHandler}
              />
            </div>

            <div className={classes.formField}>
              <label htmlFor="password" style={{ color: "black" }}>
                Password:
              </label>
              <div className="position-relative">
                <input
                  className={classes.formFieldInput}
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={inputChangeHandler}
                  placeholder="Enter new password here"
                />
                <span
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    top: "10%",
                    right: "10px",
                    transform: "translate(-50%)",
                    cursor: "pointer",
                    color: "black",
                    fontSize: "20px",
                  }}
                >
                  {passwordVisible ? (
                    <i class="fa fa-eye" aria-hidden="true"></i>
                  ) : (
                    <i class="fa fa-eye-slash" aria-hidden="true"></i>
                  )}
                </span>
              </div>
            </div>

            <div className={classes.formField}>
              <label htmlFor="confirmPassword" style={{ color: "Black" }}>
                Confirm Password:
              </label>
              <div className="position-relative">
                <input
                  className={classes.formFieldInput}
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={inputChangeHandler}
                  placeholder="Enter new password here"
                />
                <span
                  className="password-toggle-icon"
                  onClick={toggleConfirmPasswordVisibility}
                  style={{
                    position: "absolute",
                    top: "10%",
                    right: "10px",
                    transform: "translate(-50%)",
                    cursor: "pointer",
                    color: "black",
                    fontSize: "20px",
                  }}
                >
                  {confirmPasswordVisible ? (
                    <i class="fa fa-eye" aria-hidden="true"></i>
                  ) : (
                    <i class="fa fa-eye-slash" aria-hidden="true"></i>
                  )}
                </span>
              </div>
            </div>

            <button className={classes.formFieldButton} type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
