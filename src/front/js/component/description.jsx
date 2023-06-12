import React from "react";

export const Description = (props) => {
  return (
    <div className="container-fluid characters-wrapper ">
      <div className="row characters-wrapper-top ">
        <div className="col-12 col-md-6 m-0 p-0 characters-img">
          <img
            width={props.type === "characters" ? "360px" : "560px"}
            src={
              props.type === "planets" && props.uid === "1"
                ? "https://upload.wikimedia.org/wikipedia/en/6/6d/Tatooine_%28fictional_desert_planet%29.jpg"
                : `https://starwars-visualguide.com/assets/img/${props.type}/${props.uid}.jpg`
            }
            alt=""
            style={props.type === "characters" ? { margin: "0 auto" } : null}
          />
        </div>

        <div className="col-12 col-md-6 m-0  characters-main ">
          <h1>{props.name}</h1>
          <p>
            Quisque gravida, odio in elementum dictum, nisi erat mattis libero,
            in lacinia augue metus in tellus. Etiam sed semper diam, a egestas
            lorem. Mauris non sapien bibendum, gravida nunc vel, ultricies odio.
            Aenean interdum hendrerit lorem, non auctor sapien semper et. Donec
            faucibus varius magna, a pellentesque augue fringilla sit amet.
            Proin vitae cursus tortor, id vehicula sem. Donec ultricies lacus id
            scelerisque pulvinainterdum hendrerit loremr. Proin sed massa
            ultricies, rhoncus urna id, ultricies odio.hendrerit loremr
          </p>
        </div>
      </div>
      <div className="row characters-wrapper-bottom">
        <div className="col-12 col-md-6 table-left">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>
                  {props.type === "characters"
                    ? "Birth Year"
                    : props.type === "vehicles"
                    ? "Model"
                    : "Climate"}
                </th>
                <th>
                  {props.type === "characters"
                    ? "Gender"
                    : props.type === "vehicles"
                    ? "Length"
                    : "Population"}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{props.one}</td>
                <td>{props.two}</td>
                <td>{props.three}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-12 col-md-6 table-rigth">
          <table>
            <thead>
              <tr>
                <th>
                  {props.type === "characters"
                    ? "Heigth"
                    : props.type === "vehicles"
                    ? "Max Atmosphering Speed"
                    : "Orbital Period"}
                </th>
                <th>
                  {props.type === "characters"
                    ? "Skin Color"
                    : props.type === "vehicles"
                    ? "Cost"
                    : "Rotation Period"}
                </th>
                <th>
                  {props.type === "characters"
                    ? "Eye Color"
                    : props.type === "vehicles"
                    ? "Capacity"
                    : "Diameter"}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{props.four}</td>
                <td>{props.five}</td>
                <td>{props.six}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
