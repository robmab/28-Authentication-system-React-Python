import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { Context } from "../../../front-back/js/store/appContext";

import "../../styles/description.css";
import { Description } from "../component/description.jsx";

export const Characters = () => {
  const { store, actions } = useContext(Context);
  const id = useParams().theid;

  useEffect(() => {
    //Check when store is not empty
    actions.loadData(id, "people");
  }, [store.people]);

  return (
    <>
      {store.people.length > 0 && store.people[id].item && (
        <Description
          name={store.people[id].name}
          uid={store.people[id].uid}
          type="characters"
          one={store.people[id].item.properties.name}
          two={store.people[id].item.properties.birth_year}
          three={store.people[id].item.properties.gender}
          four={store.people[id].item.properties.height}
          five={store.people[id].item.properties.skin_color}
          six={store.people[id].item.properties.eye_color}
        />
      )}
    </>
  );
};
