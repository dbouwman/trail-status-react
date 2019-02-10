import React, { Component } from 'react';
import { cloneObject } from '../utils';

import ReactDOM from 'react-dom';

export class Navbar extends Component {

  constructor (props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar">
        <a href="#" className="brand">noco trail status</a>
        <div className="right">
          <a href="#" className="link all" onClick={this.props.onShowAllTrails}>All</a>
          <a href="#" className="link closed" onClick={this.props.onShowClosedTrails}>Closed</a>
          <a href="#" className="link open" onClick={this.props.onShowOpenTrails}>Open</a>
        </div>
      </nav>
    )

  }

}

export default Navbar;
