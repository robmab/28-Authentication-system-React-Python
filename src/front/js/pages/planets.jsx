import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { Context } from "../store/appContext";

import "../../styles/description.css";
import { Description } from "../component/description.jsx";

export const Planets = () => {
  const { store, actions } = useContext(Context);
  const id = useParams().theid;

  useEffect(() => {
    //Check when store is not empty
    actions.loadData(id, "planets");
  }, [store.planets]);

  return (
    <>
      {store.planets.length > 0 && store.planets[id].item && (
        <Description
          name={store.planets[id].name}
          uid={store.planets[id].uid}
          type="planets"
          one={store.planets[id].item.properties.name}
          two={store.planets[id].item.properties.climate}
          three={store.planets[id].item.properties.population}
          four={store.planets[id].item.properties.orbital_period}
          five={store.planets[id].item.properties.rotation_period}
          six={store.planets[id].item.properties.diameter}
        />
      )}
    </>
  );
};
