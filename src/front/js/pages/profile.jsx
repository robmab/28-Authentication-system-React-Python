import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

import { Context } from "../store/appContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

import "../../styles/profile.css";

export const Profile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      navigate("/login");
      return;
    }

    const priv = async () => {
      const profile = await actions.private();
      if (!profile) {
        actions.logout();
        navigate("/");
      }

      console.log(data);
      setLoad(true);
    };
    priv();
  }, []);

  const [data, setData] = useState(JSON.parse(localStorage.getItem("data")));

  return (
    <>
      {load && (
        <div className="profile-wrapper">
          <h1>User Info</h1>
          <div className="profile">
            <div>
              <p>
                <strong>Username: </strong>
                {data?.user_name}
              </p>
            </div>
            <div>
              <p>
                <strong>First name: </strong>
                {data?.first_name}
              </p>
            </div>

            <div>
              <p>
                <strong>Last name: </strong>
                {data?.last_name}
              </p>
            </div>

            <div>
              <p>
                <strong>Email: </strong>
                {data?.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
