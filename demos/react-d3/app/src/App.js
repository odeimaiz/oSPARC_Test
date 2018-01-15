import React, { Component } from 'react';
import './App.css';
import BarChart from './components/BarChart'
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
        </div>
      </div>
    );
  }
}

export default App;
