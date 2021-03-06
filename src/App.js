import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/navigation/Navigation.jsx";
import Signin from "./components/signIn/Signin.jsx";
import Register from "./components/register/Register.jsx";
import Logo from "./components/logo/Logo.jsx";
import ImageLinkForm from "./components/imageLinkForm/ImageLinkForm.jsx";
import Rank from "./components/rank/Rank.jsx";
import FaceRecognition from "./components/faceRecognition/FaceRecognition.jsx";

import Clarifai from "clarifai";
import Particles from "react-particles-js";

const app = new Clarifai.App({
  apiKey: "6ed77e4080d147d9b54745412a71bfa1"
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

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      imageUrl: "",
      box: [],
      route: "signin",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: ""
      }
    };
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  calculateFaceLocation = data => {
    //we get bounding box numbers from api and saving it as a const
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;

    // getting the image
    const image = document.getElementById("inputimage");
    //images width
    const width = Number(image.width);
    //images height
    const height = Number(image.height);

    return {
      //calculations for how to get each corner for face box
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    this.setState({
      box: box
    });
  };

  onInputChange = event => {
    this.setState({
      input: event.target.value
    });
  };

  onButtonSubmit = () => {
    this.setState({
      // imageUrl will take inputs value
      imageUrl: this.state.input
    });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        fetch("http://localhost:3001/image", {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            // object assign wont change the user object,
            // it will assign new info into it
            this.setState(Object.assign(this.state.user, { entries: count }));
          });
        //calculatefacelocation takes response as an argument
        // and displayfacebox takes facelocations returned value as argument
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
  };

  //we passed route as argument because we will define what that route is in components
  onRouteChange = route => {
    if (route === "signout") {
      this.setState({
        initialState
      });
    } else if (route === "home") {
      this.setState({
        isSignedIn: true
      });
    }
    this.setState({
      route: route
    });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
