import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

import { Context } from "../store/appContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

import "../../styles/formulary.css";

export const Signup = () => {
  const navigate = useNavigate();

  const [load, setLoad] = useState(false);
  //Redirect in case user is logged
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      navigate("/");
    }
    setLoad(true);
  }, []);

  const { actions } = useContext(Context);

  const [alert, setAlert] = useState(false);
  const [alertText, setAlertText] = useState("An error has occurred.");

  /* INPUT CHECKS */
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");

  /* FORMULARY */
  const handleFormulary = async (e) => {
    e.preventDefault();

    const contactData = {
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
    };

    const signup = await actions.signup(contactData);
    if (signup) {
      const login = await actions.login(contactData);
      if (login){
        navigate("/")
      }
    
    }
    setAlert(true);
    setAlertText("Error with signup"); 
  };

  return (
    <div className="wrapper-formulary pt-5 w-25">
      {load && (
        <>
          <div className="form">
            {/* ALERT */}
            {alert ? (
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  style={{ color: "#fa0000" }}
                />
                <div>{alertText}</div>
              </div>
            ) : null}

            {/* ALERT END*/}
            <form onSubmit={handleFormulary}>
              <div className="form-group mb-1">
                <label htmlFor="exampleInputEmail1">Username</label>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  className="form-control"
                  id="username"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="form-group mb-1">
                <label htmlFor="exampleInputEmail1">First name</label>
                <input
                  onChange={(e) => setFirstname(e.target.value)}
                  value={firstname}
                  type="text"
                  className="form-control "
                  id="firstname"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="form-group mb-1">
                <label htmlFor="exampleInputEmail1">Last name</label>
                <input
                  onChange={(e) => setLastname(e.target.value)}
                  value={lastname}
                  type="text"
                  className="form-control"
                  id="lastname"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="form-group mb-1">
                <label htmlFor="exampleInputEmail1">Email</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="form-group mb-1">
                <label htmlFor="exampleInputEmail1">Password</label>
                <input
                onBlur={(e)=>{
                  if (e.target.value !== passwordTwo && passwordTwo !== ""){
                    setAlert(true)
                    setAlertText("Invalid password")
                  }else{
                    setAlert(false)
                  }
                }}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  className="form-control"
                  id="password"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Repeat password</label>
                <input
                  onChange={(e) => setPasswordTwo(e.target.value)}
                  onBlur={(e)=>{
                    if (e.target.value !== password && password !== ""){
                      setAlert(true)
                      setAlertText("Invalid password")
                    }else{
                      setAlert(false)
                    }
                  }}
                  value={passwordTwo}
                  type="password"
                  className="form-control"
                  id="passwordTwo"
                  aria-describedby="emailHelp"
                />
              </div>
              <button
                type="submit"
                className={`btn btn-primary ${
                  (!username || !firstname || !lastname || !email
                    || !password || !passwordTwo || !(password === passwordTwo)) && "noclick"
                }`}
              >
                Register
              </button>
            </form>
          </div>
          <Link to="/">Back to Home</Link>
        </>
      )}
    </div>
  );
};
