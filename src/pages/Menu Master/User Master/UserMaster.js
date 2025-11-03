import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { Button, Form, Row, Col } from "react-bootstrap";
import { getData, postData } from "../../../Services/Api";
import { department, register } from "../../../Services/service";

import Swal from "sweetalert2";
import { useEffect } from "react";

export default function UserMaster() {
  const initialState = {
    userName: "",
    password: "",
    confirmPassword: "",
    roleName: "",
    employeeName: "",
  };

  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [errorShow, setErrorShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleUser = (event) => {
    const { key } = event;
    // Block input that consists of spaces only
    if (/^\s+$/.test(key) && event.target.value.trim() === "") {
      event.preventDefault();
      return;
    }
    // Block characters that are not allowed in a holiday type
    if (!/^[a-zA-Z\s]+$/.test(key)) {
      event.preventDefault();
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleChange = (e) => {
    setDisabled(false);
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    // Update selected role
    if (name === "roleName") {
      setSelectedRole(value);
    }
  };

  const resetForm = () => {
    setData(initialState);
    setErrors({});
    setErrorShow(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Activate the loader

    try {
      const resp = await postData(data, register);
      const res = await resp.json();
      console.log(res);
      if (res.Status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `${res.Message}`,
          showConfirmButton: false,
          timer: 1000,
        });
        resetForm();
        setSelectedRole("");
      } else {
        setErrors({
          userName: res?.userName || res?.response,
          password: res?.password,
          confirmPassword: res.confirmPassword || res?.error_message,
          roles: res?.roles || res?.error_message,
          employeeName: res?.employeeName,
        });
        setErrorShow(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false); // Deactivate the loader
    }
  };

  return (
    <>
      <div className="container">
        <div className="d-flex">
          <h3>Add User</h3>
        </div>
        <hr />
        <h6>Add/Edit User</h6>

        <Form autoComplete="off">
          <Row className="mb-3">
            <Form.Group
              as={Col}
              sm={4}
              controlId="validationCustom05"
              className="mt-2"
            >
              <Form.Label>
                Employee Name :<span style={{ color: "red" }}> * </span>{" "}
              </Form.Label>
              <Form.Control
                input
                type="text"
                name="employeeName"
                placeholder="Enter Your Name"
                onChange={handleChange}
                value={data.employeeName}
                onKeyPress={handleUser}
                invalid
              />

              {errorShow && (
                <span className="Errorsmessage">{errors.employeeName}</span>
              )}
            </Form.Group>

            <Form.Group
              as={Col}
              sm={4}
              controlId="validationCustom01"
              className="mt-2"
            >
              <Form.Label>
                Email : <span className="Errorsmessage"> * </span>
              </Form.Label>
              <Form.Control
                input
                type="text"
                name="userName"
                placeholder="Enter Your Name"
                onChange={handleChange}
                value={data.userName}
                invalid
              />
              {errorShow && (
                <span className="Errorsmessage">{errors.userName}</span>
              )}
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              sm={4}
              controlId="validationCustom02"
              className="mt-2"
            >
              <Form.Label>
                Role Name :<span className="Errorsmessage"> * </span>{" "}
              </Form.Label>
              <select
                as={Row}
                sm={4}
                controlId="validationCustom07"
                className="form-select"
                aria-label="Default select example"
                name="roleName"
                onChange={handleChange}
                value={selectedRole}
              >
                <option value="">Select Role</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="HR">HR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {errorShow && (
                <span className="Errorsmessage">{errors.roleName}</span>
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              sm={4}
              controlId="validationCustom04"
              className="mt-2"
            >
              <Form.Label>
                Password :<span className="Errorsmessage"> * </span>{" "}
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Enter Your Password"
                  onChange={handleChange}
                  value={data.password}
                />
                <span
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                  }}
                >
                  {passwordVisible ? (
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-eye-slash" aria-hidden="true"></i>
                  )}
                </span>
              </div>
              {errorShow && (
                <span className="Errorsmessage">{errors.password}</span>
              )}
            </Form.Group>

            <Form.Group
              as={Col}
              sm={4}
              controlId="validationCustom04"
              className="mt-2"
            >
              <Form.Label>
                Confirm Password :
                <span className="Errorsmessage"> * </span>{" "}
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter Your Password"
                  onChange={handleChange}
                  value={data.confirmPassword}
                  style={{ paddingRight: "2.5rem" }}
                />
                <span
                  className="password-toggle-icon"
                  onClick={toggleConfirmPasswordVisibility}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                  }}
                >
                  {confirmPasswordVisible ? (
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-eye-slash" aria-hidden="true"></i>
                  )}
                </span>
              </div>
              {errorShow && (
                <span className="Errorsmessage">{errors.confirmPassword}</span>
              )}
            </Form.Group>
          </Row>
          <Button
            type="submit"
            disabled={disabled || isLoading}
            onClick={submitHandler}
          >
            {isLoading ? (
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
          </Button>
        </Form>
      </div>
    </>
  );
}
