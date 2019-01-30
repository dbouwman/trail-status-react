import React, { Component } from 'react';

export class Trail extends Component {
  render () {
    const {name, status} = this.props;
    return (
      <tr>
        <td>{name}</td>
        <td>{status}</td>
      </tr>
    )
  }
}

export default Trail;
