import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

import "../../styles/card.css";

export const Card = (props) => {
  const { store, actions } = useContext(Context);
  const [like, setLike] = useState(false);

  /* SET/UNSET FAVOURITES */
  useEffect(() => {
    setLike(false);
    store.favourites.forEach((x) => {
      if (props.name === x.name) setLike(true);
    });
  }, [store.favourites]);

  const handlerOnClick = () => {
    if (!like) actions.addFavourites(props);
    else actions.deleteFavourites(props.name);
    setLike(!like);
  };

  /* CHARGE DATA FROM LOCALSTORAGE */
  const [data, setData] = useState({});
  useEffect(() => {
    if (localStorage.getItem(props.name) != null) {
      const properties = JSON.parse(localStorage.getItem(props.name));

      if (props.type === "characters") {
        setData({
          gender: properties.properties.gender,
          hairColor: properties.properties.hair_color,
          eyeColor: properties.properties.eye_color,
        });
      }
      if (props.type === "vehicles") {
        setData({
          model: properties.properties.model,
          length: properties.properties.length,
          cost: properties.properties.cost_in_credits,
        });
      }
      if (props.type === "planets") {
        setData({
          population: properties.properties.population,
          terrain: properties.properties.terrain,
          diameter: properties.properties.diameter,
        });
      }
    }
  }, []);
  return (
    <div className="card">
      <img src={props.url} className="card-img-top" alt="..." height="150em" />
      <div className="card-body">
        <h5
          className="card-title"
          style={
            props.name === "Storm IV Twin-Pod cloud car"
              ? { fontSize: "1.1em" }
              : null
          }
        >
          {props.name}
        </h5>

        {localStorage.getItem(props.name) !== null &&
        props.type === "characters" ? (
          <ul className="card-text">
            <li>Gender: {data.gender}</li>
            <li>Hair Color: {data.hairColor}</li>
            <li>Eye Color: {data.eyeColor}</li>
          </ul>
        ) : null}

        {localStorage.getItem(props.name) !== null &&
        props.type === "vehicles" ? (
          <ul className="card-text">
            <li>Model: {data.model}</li>
            <li>Length: {data.length}</li>
            <li>Cost: {data.cost}</li>
          </ul>
        ) : null}

        {localStorage.getItem(props.name) !== null &&
        props.type === "planets" ? (
          <ul className="card-text">
            <li>Population: {data.population}</li>
            <li>Terrain: {data.terrain}</li>
            <li>Diameter: {data.diameter}</li>
          </ul>
        ) : null}

        {localStorage.getItem(props.name) === null ? (
          <ul className="card-text">
            <li>-------------------------------</li>
            <li>Learn more for more details.</li>
            <li>-------------------------------</li>
          </ul>
        ) : null}

        <div>
          <Link
            to={`/${props.type}/${props.keyStore}`}
            className="btn btn-outline-primary"
          >
            Learn more!
          </Link>

          <a
            onClick={handlerOnClick}
            href="#"
            className={
              !like ? "btn btn-outline-warning" : "btn btn-outline-danger"
            }
          >
            <FontAwesomeIcon icon={faHeart} />
          </a>
        </div>
      </div>
    </div>
  );
};
