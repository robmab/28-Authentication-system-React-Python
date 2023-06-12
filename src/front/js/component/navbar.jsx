import React, { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

import { Search } from "./search.jsx";

import "../../styles/navbar.css";
import sfLogo from "../../img/sw.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const [fav, setFav] = useState(store.favourites);

  const [hover, setHover] = useState(false);

  // DELETE FAVOURITE
  const deleteHandle = (e) => {
    e.stopPropagation(); //Avoid close dropdown when click inside
    actions.deleteFavourites(e.target.parentNode.id);
  };

  useEffect(() => {
    setFav(store.favourites);
  }, [store.favourites]);

  //CAPTURE WIDTH AND HEIGHT WHEN ZOOM IN/OUT
  const [dimensions, setDimensions] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);
  }, []);

  //TOKEN
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [store.user]);

  return (
    <nav className="navbar navbar-light bg-light container-fluid">
      <div className="row">
        {/* LOGO */}
        <div className="logo col-12 col-md-4">
          <Link to="/">
            <img width="80px" src={sfLogo} alt="" />
          </Link>
        </div>
        {/* SEARCH */}
        <Search />
        {/* DROPDOWN */}
        <div className="dropdown col-6 col-md-2 ">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Favorites
            <div>
              <p>{fav.length}</p>
            </div>
          </button>
          <ul className="dropdown-menu" aria-labelledby="list">
            {fav.length === 0 ? (
              <p>Empty list</p>
            ) : (
              fav.map((x, y) => (
                <li
                  onMouseEnter={() => {
                    setHover(y);
                  }}
                  onMouseLeave={() => {
                    setHover(false);
                  }}
                  key={y}
                >
                  <Link className="fav-name" to={`/${x.type}/${x.keyStore}`}>
                    {x.name}
                  </Link>
                  {/* ON MOBILE, TRASH ICON ALWAYS APPEAR */}
                  {hover === y || dimensions.width < 900 ? (
                    <FontAwesomeIcon
                      id={x.name}
                      onClick={deleteHandle}
                      icon={faTrash}
                    />
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </div>
        {/* LOGIN/PROFILE/LOGOUT */}
        {token ? (
          <>
            <div className="dropdown col-6 col-md-2 ">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {JSON.parse(localStorage.getItem("data"))?.user_name}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <Link
                    onClick={() => actions.logout()}
                    className="fav-name dropdown-item"
                    to={"/"}
                  >
                    Logout
                  </Link>
                </li>
                <li>
                  <Link className="fav-name dropdown-item" to={`/profile`}>
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="dropdown col-6 col-md-2 ">
            <button className="btn btn-primary ">
              <Link to={"/login"}>Login</Link>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
