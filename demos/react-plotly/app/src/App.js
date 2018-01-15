import React, { Component } from 'react';
import './App.css';
import PlotlyPlot from './components/PlotlyPlot'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2 className="App-title">D3 within React</h2>
        </header>
        <div>
          <PlotlyPlot data={[5,10,1,3]} size={[200,700]} />
        </div>
      </div>
    );
  }
}

export default App;
