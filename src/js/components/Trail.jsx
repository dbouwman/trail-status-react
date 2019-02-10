import React, { Component } from 'react';

export class Trail extends Component {
  render () {
    const {name, status, manager} = this.props;
    return (
      <tr>
        <td>{name}</td>
        <td>{manager}</td>
        <td>{status}</td>
      </tr>
    )
  }
}

export default Trail;
