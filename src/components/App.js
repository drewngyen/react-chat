import React, { Component } from "react";
import Navbar from "./Navbar";
import Chat from "./chat/Chat";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <React.Fragment>
          <Navbar />
          <Chat />
        </React.Fragment>
      </div>
    );
  }
}
export default App;
