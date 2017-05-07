import React, { Component } from 'react';
import './App.css';
import ImageUpload from './ImageUpload.js'  


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header" style={{"paddingBottom":'30px'}}>
          <h1>Tracey McTraceface</h1>
          <a  style={{"color":'white'}} href="https://twitter.com/Isa_Kiko">by Isa Kiko</a>
        </div>
        <div className="maindiv">
          <ImageUpload></ImageUpload>
        </div>
      </div>
    );
  }
}

export default App;
