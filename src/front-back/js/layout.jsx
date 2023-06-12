import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./views/home.jsx";
import { Login } from "./views/login.jsx";
import { Signup } from "./views/signup.jsx";
import { Profile } from "./views/profile.jsx";
import { Characters } from "../../front/js/pages/characters.jsx";
import { Vehicles } from "./views/vehicles.jsx";
import { Planets } from "./views/planets.jsx";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar.jsx";
import { Footer } from "./component/footer.jsx";

//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";

  return (
    <>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <div className="page-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/characters/:theid" element={<Characters />} />
              <Route path="/vehicles/:theid" element={<Vehicles />} />
              <Route path="/planets/:theid" element={<Planets />} />
              <Route path="*" element={<h1>Not found!</h1>} />
            </Routes>
          </div>
          <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </>
  );
};

export default injectContext(Layout);
