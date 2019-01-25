import React, { Component } from "react";
import ReactDOM from "react-dom";

class TrailContainer extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
  }
  render() {
    return (
      <h4>Whats up doc?</h4>
    );
  }
}
export default TrailContainer;

const wrapper = document.getElementById("trails");
wrapper ? ReactDOM.render(<TrailContainer />, wrapper) : false;
