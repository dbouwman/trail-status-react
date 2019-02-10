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
        status: 'all',
        query: null
      },
      trailData: null
    }
    this.setFilter = this.setFilter.bind(this);
    this.showOpenTrails = this.showOpenTrails.bind(this);
    this.showClosedTrails = this.showClosedTrails.bind(this);
    this.showAllTrails = this.showAllTrails.bind(this);
  }

  setFilter(filter) {
    const newState = cloneObject(this.status);
    newState.filter = filter;
    this.setState(newState);
  }

  showOpenTrails (e) {
    e.preventDefault();
    this.setFilter({status: 'open'});
  }

  showClosedTrails (e) {
    e.preventDefault();
    this.setFilter({status: 'closed'});
  }

  showAllTrails (e) {
    e.preventDefault();
    this.setFilter({status: 'all'});
  }

  componentDidUpdate ( prevProps, prevState, snapshot ) {
    console.info(`componentDidUpdate...`);
    const curFilter = this.state.filter.status;
    const lastFilter = prevState.filter.status;
    console.info(`componentDidUpdate: curFilter ${curFilter} old filter: ${lastFilter}`);
    if (curFilter !== lastFilter) {
      this.fetchData(this.state.filter);
    }
  }
  componentWillMount () {
    this.fetchData(this.state.filter);
  }

  fetchData (filter) {
    this.setState({loading: true});
    return getData(filter)
      .then((data) => {
        this.setState({trailData: data, loading: false});
      })
      .catch((err) => {
        this.setState({error: err, loading: false});
      })
  }

  render() {
    const {
      setFilter,
      showOpenTrails,
      showClosedTrails,
      showAllTrails} = this;

    return (
      <div className="wrap">
        <Navbar onShowOpenTrails={showOpenTrails}
                onShowClosedTrails={showClosedTrails}
                onShowAllTrails={showAllTrails}/>
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
