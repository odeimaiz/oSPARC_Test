import React, { Component } from 'react';
import './App.css';
import BarChart from './components/BarChart'
import BarChart2 from './components/BarChart2'
import WorldMap from './components/WorldMap'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2 className="App-title">D3 within React</h2>
        </header>
        <div>
          <BarChart data={[5,10,1,3]} size={[300,700]} />
          <WorldMap size={[1000,700]} />
          <BarChart2 data={[6,11,2,4]} size={[300,700]} />
        </div>
      </div>
    );
  }
}

export default App;
