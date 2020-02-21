import React from "react";
import "./App.css";
import Navigation from "./components/navigation/Navigation.jsx";
import Logo from "./components/logo/Logo.jsx";
import ImageLinkForm from "./components/imageLinkForm/ImageLinkForm.jsx";
import Rank from "./components/rank/Rank.jsx";

import Particles from "react-particles-js";

const particleOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

function App() {
  return (
    <div className="App">
      <Particles className="particles" params={ particleOptions } />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      {/* <FaceRecognition/> */}
    </div>
  );
}

export default App;
