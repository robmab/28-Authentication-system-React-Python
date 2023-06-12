import axios from "axios";
const getState = ({ getStore, getActions, setStore }) => {
  const url =
    "https://robmab-probable-space-engine-vrgj77pj6p536p74-3000.preview.app.github.dev";
  return {
    store: {
      people: [],
      vehicles: [],
      planets: [],
      favourites: [],
      user: {},
    },
    actions: {
      private: async () => {
        const data = localStorage.getItem("data");
        if (data !== null) return true

        const token = localStorage.getItem("token");

        const config = {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Origin, Content-Type, X-Auth-Token",
            Authorization: "Bearer " + token,
          },
        };
        try {
          let response = await axios.get(`${url}/private`, config);
          console.log(response.data, response.status);

          const store = getStore();
          store.user = response.data.response;
          setStore(store);

          localStorage.setItem("data", JSON.stringify(response.data.response));

          return true;
        } catch (err) {
          console.log(err.response.data, "error");
          return false;
        }
      },
      logout: () => {
        const store = getStore();
        store.user = {};
        setStore(store);

        localStorage.removeItem("token");
        localStorage.removeItem("data");
      },
      signup: async (contactData) => {
        console.log(contactData);

        const config = {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Origin, Content-Type, X-Auth-Token",
          },
        };

        const data = {
          user_name: contactData.username,
          first_name: contactData.firstname,
          last_name: contactData.lastname,
          email: contactData.email,
          password: contactData.password,
        };

        try {
          let response = await axios.post(`${url}/signup`, data, config);
          console.log(response, response.data, response.status);

          return true;
        } catch (err) {
          return false;
        }
      },
      login: async (object) => {
        /* if (localStorage.getItem("token")) return true */

      

        const config = {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Origin, Content-Type, X-Auth-Token",
          },
        };
        const data = {
          email: object.email,
          password: object.password,
        };

        try {
          let response = await axios.post(`${url}/login`, data, config);
          /* store = getStore() */
          //ASIGN TOKEN TO LOCALSTORAGE
          if (response?.status === 200) {
            console.log(response, response.data, response.status);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("data", JSON.stringify(response.data.user));

            const store = getStore();
            store.user = response.data.user;
            setStore(store);

            return true;
          }
          return true;
        } catch (err) {
          
          if (err.response?.status === 401) {
            console.log(err.response?.data, err.response?.status);
            return false;
          }
          return "error with API";
        }
      },
      deleteFavourites: (name) => {
        let store = getStore();
        store.favourites = store.favourites.filter((x) => x.name != name);
        setStore(store);

        localStorage.setItem("favourites", JSON.stringify(store.favourites));
      },

      addFavourites: (props) => {
        const store = getStore();

        store.favourites.push({
          name: props.name,
          type: props.type,
          keyStore: props.keyStore,
        });
        setStore(store);

        localStorage.setItem("favourites", JSON.stringify(store.favourites));
      },

      loadAllData: () => {
        /* FAVOURITES LOAD FROM LOCALSTORAGE */
        if (localStorage.getItem("favourites") !== null) {
          const store = getStore();
          store.favourites = JSON.parse(localStorage.getItem("favourites"));
          setStore(store);
        }

        /* PEOPLE */
        const people = JSON.parse(localStorage.getItem("people"));
        if (people === null) {
          fetch("https://www.swapi.tech/api/people")
            .then((r) => {
              if (!r.ok) throw Error(r);
              return r.json();
            })
            .then((data) => {
              console.log(data);
              setStore({ people: data.results });
              //SAVE DATA ON LOCALSTORAGE
              localStorage.setItem("people", JSON.stringify(getStore().people));
            })
            .catch((error) => console.log(error));
        } else {
          setStore({ people: people });
        }

        /* VEHICLES */

        const vehicles = localStorage.getItem("vehicles");
        if (vehicles === null) {
          fetch("https://www.swapi.tech/api/vehicles")
            .then((r) => {
              if (!r.ok) throw Error(r);
              return r.json();
            })
            .then((data) => {
              console.log(data);
              setStore({ vehicles: data.results });
              //SAVE DATA ON LOCALSTORAGE
              localStorage.setItem(
                "vehicles",
                JSON.stringify(getStore().vehicles)
              );
            })
            .catch((error) => console.log(error));
        } else {
          setStore({ vehicles: JSON.parse(vehicles) });
        }
        /* PLANETS */
        const planets = localStorage.getItem("planets");
        if (planets === null) {
          fetch("https://www.swapi.tech/api/planets")
            .then((r) => {
              if (!r.ok) throw Error(r);
              return r.json();
            })
            .then((data) => {
              console.log(data);
              setStore({ planets: data.results });
              //SAVE DATA ON LOCALSTORAGE
              localStorage.setItem(
                "planets",
                JSON.stringify(getStore().planets)
              );
            })
            .catch((error) => console.log(error));
        } else {
          setStore({ planets: JSON.parse(planets) });
        }
      },

      loadData: (param, type) => {
        if (getStore().people.length === 0) return; //Check if people is not empty first

        const details = getStore()[type][param];
        const component = localStorage.getItem(details.name);
        if (component === null) {
          //CHARGE DATA FROM API
          fetch(details.url)
            .then((r) => {
              if (!r.ok) throw Error(r);
              return r.json();
            })
            .then((data) => {
              console.log(data);

              const store = getStore();
              store[type][param].item = data.result;
              setStore(store);

              //SAVE DATA ON LOCALSTORAGE
              localStorage.setItem(details.name, JSON.stringify(details.item));
            })
            .catch((error) => console.log(error));
        } else {
          const store = getStore();
          store[type][param].item = JSON.parse(component);
          setStore(store);
        }
      },
    },
  };
};

export default getState;
