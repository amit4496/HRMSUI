import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./SignIn.module.css";
import { BASE_URL } from "../helper";

const SignInForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/forgotpassword");
  };

  useEffect(() => {
    if (error === null) {
      setUsername("");
      setPassword("");
    }
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username) {
      setError("Please enter a username");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data?.Data?.token) {
        sessionStorage.setItem("token", JSON.stringify(data?.Data.token));
        localStorage.setItem("token", data?.Data.token);
        localStorage.setItem("user", data?.Data.userName);
        localStorage.setItem("role", data?.Data.roles);
        localStorage.setItem("employeeId", data?.Data.id);
        localStorage.setItem("email", data?.Data.email);
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <form onSubmit={handleSubmit} className={classes.formField}>
      {error && <p className="Errorsmessage">{error}</p>}
      <div className={classes.formField}>
        <label htmlFor="username" className={classes.formFieldLabel}>
          Username:
        </label>
        <input
          className={classes.formFieldInput}
          type="text"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div className={classes.formField}>
        <label htmlFor="password" className={classes.formFieldLabel}>
          Password:
        </label>
        <input
          className={classes.formFieldInput}
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={handleTogglePassword}
          className="eyeButton"
          style={{ color: "black", fontSize: "20px", marginTop: "5px" }}
        >
          {showPassword ? (
            <i className="fa fa-eye" aria-hidden="true"></i>
          ) : (
            <i className="fa fa-eye-slash" aria-hidden="true"></i>
          )}
        </button>
      </div>

      <span className={classes.forgotPasswordLink} onClick={handleClick}>
        Forgot Password?
      </span>

      <button
        className={classes.formFieldButton}
        type="submit"
        disabled={loading}
      >
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
