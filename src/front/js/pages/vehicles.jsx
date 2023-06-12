import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { Context } from "../store/appContext";

import "../../styles/description.css";
import { Description } from "../component/description.jsx";

export const Vehicles = () => {
  const { store, actions } = useContext(Context);
  const id = useParams().theid;

  useEffect(() => {
    //Check when store is not empty
    actions.loadData(id, "vehicles");
  }, [store.vehicles]);

  return (
    <>
      {store.vehicles.length > 0 && store.vehicles[id].item && (
        <Description
          name={store.vehicles[id].name}
          uid={store.vehicles[id].uid}
          type="vehicles"
          one={store.vehicles[id].item.properties.name}
          two={store.vehicles[id].item.properties.model}
          three={store.vehicles[id].item.properties.length}
          four={store.vehicles[id].item.properties.max_atmosphering_speed}
          five={store.vehicles[id].item.properties.cost_in_credits}
          six={store.vehicles[id].item.properties.cargo_capacity}
        />
      )}
    </>
  );
};
