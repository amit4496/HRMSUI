import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ahom from "../Signin/AhomNew.png";
import classes from "./SignIn.module.css";
import SignInForm from "./SignInForm";

function SignIn(props) {
  // const [loggedIn, SetLoggedIn] = useState(false);
  const [dataInput, setDataInput] = useState(null);
  const navigate = useNavigate();
  const handlerInput = (val) => {
    setDataInput(val);
  };

  return (
    <div className={classes.body}>
      <div className={classes.item}>
        <div className={classes.appForm}>
          <div className={classes.logo }>
            <img src={ahom} alt="logo" />
          </div>

          {<SignInForm handlerInput={handlerInput} />}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
