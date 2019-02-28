import React, { Component } from 'react';

export class Trail extends Component {
  render () {
    const {name, status, manager} = this.props;
    const statusClass = `status ${status.toLowerCase()}`;
    return (
      <tr>
        <td className="name">{name}</td>
        <td className="mgr">{manager}</td>
        <td className={statusClass}>{status}</td>
      </tr>
    )
  }
}

export default Trail;
