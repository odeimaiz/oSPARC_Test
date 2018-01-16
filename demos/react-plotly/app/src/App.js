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
        <div width={'500px'}>
          <PlotlyPlot size={[500,500]} />
        </div>
      </div>
    );
  }
}

export default App;
