import React, { Component } from 'react';
import { cloneObject } from '../utils';

import ReactDOM from 'react-dom';

export class Navbar extends Component {

  constructor (props) {
    super(props);
    this.showOpenTrails.bind(this);
    this.showClosedTrails.bind(this);
  }

  showOpenTrails() {
    console.log(`Called showOpenTrails...`);
    this.props.onSetFilter({state: 'open'});
  }

  showClosedTrails() {
    console.log(`Called showClosedTrails...`);
    debugger;
    this.props.onSetFilter({state: 'closed'});
  }

  render() {
    return (
      <nav className="navbar">
        <a href="#" className="brand">noco trail status</a>
        <div className="right">
          <a href="#" className="link closed" onClick={this.props.onShowClosedTrails}>Closed</a>
          <a href="#" className="link open" onClick={this.props.onShowOpenTrails}>Open</a>
        </div>
      </nav>
    )

  }

}

export default Navbar;
