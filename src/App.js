import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/navigation/Navigation.jsx";
import Logo from "./components/logo/Logo.jsx";
import ImageLinkForm from "./components/imageLinkForm/ImageLinkForm.jsx";
import Rank from "./components/rank/Rank.jsx";
import FaceRecognition from "./components/faceRecognition/FaceRecognition.jsx"

import Clarifai from "clarifai";
import Particles from "react-particles-js";

const app = new Clarifai.App({
 apiKey: '6ed77e4080d147d9b54745412a71bfa1'
});

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      imageUrl: ""
    };
  }

  onInputChange = event => {
    this.setState({
      input: event.target.value
    })
  };

  onButtonSubmit = () => {
    this.setState({
      // imageUrl will take inputs value
      imageUrl: this.state.input
    })
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
      )
      .then(
        function(response) {
          // do something with response
          console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        },
        function(err) {
          // there was an error
        }
      );
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
       <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
