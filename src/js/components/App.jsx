import React, { Component } from 'react';
import { cloneObject } from '../utils';
import { getData } from '../traildata'
import Navbar from './Navbar.jsx';
import Area from './Area.jsx';
import ReactDOM from 'react-dom';

export class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      filter: {
        state: 'closed',
        query: null
      },
      trailData: null
    }
    this.setFilter = this.setFilter.bind(this);
    this.showOpenTrails = this.showOpenTrails.bind(this);
    this.showClosedTrails = this.showClosedTrails.bind(this);
  }

  setFilter(filter) {
    console.log(`Called setFilter...`);
    const newState = cloneObject(this.state);
    newState.filter = filter;
    this.setState(newState);
  }

  showOpenTrails () {
    this.setFilter({state: 'open'});
  }

  showClosedTrails () {
    this.setFilter({state: 'closed'});
  }
  // componentDidUpdate ( prevProps ) {
  //   getData(this.state.filter)
  //     .then((data) => {
  //       console.log('Got data...');
  //       this.setState({trailData: data, loading: false});
  //     })
  //     .catch((err) => {
  //       this.setState({error: err, loading: false});
  //     })
  // }
  componentWillMount () {
    this.setState({loading: true});

    getData(this.state.filter)
      .then((data) => {
        console.log('Got data...');
        this.setState({trailData: data, loading: false});
      })
      .catch((err) => {
        this.setState({error: err, loading: false});
      })

  }

  render() {
    const { setFilter, showOpenTrails, showClosedTrails} = this;
    return (
      <div className="wrap">
        <Navbar onShowOpenTrails={showOpenTrails} onShowClosedTrails={showClosedTrails}/>
        <div className="content">
          {this.state.loading ?
            <div className="spinner"></div> :
            this.state.trailData.areas.map(area =>
              <Area key={area.group} name={area.group} trails={area.entries} />
            )
          }
        </div>
      </div>

    )


  }

}

export default App;

const wrapper = document.getElementById('app');
wrapper ? ReactDOM.render(<App />, wrapper) : false;
