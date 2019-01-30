import React, { Component } from 'react';
import Trail from './Trail.jsx';
export class Area extends Component {
  render () {
    const {name, trails} = this.props;
    return (
      <div className="area">
        <h3>{name}</h3>
        <table className="table table-striped">
          <tbody>
          {(trails.length === 0) ?
           <tr><td>No Trails</td></tr> :
           trails.map((trail, idx) =>
            <Trail key={idx} {...trail}/>
          )}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Area;
