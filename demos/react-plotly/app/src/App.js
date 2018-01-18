import React, { Component } from 'react';
import './App.css';
import ReactMyTable from './components/ReactMyTable'
import PlotlyPlot from './components/PlotlyPlot'
import outputControllerOut from './data/outputControllerOut.json';

class App extends Component {

  render() {
    let outputController = []
    for (var i = 0; i < outputControllerOut.length; i++) {
      let newItem = {
        time: Number(outputControllerOut[i][0]),
        rate: Number(outputControllerOut[i][1]),
        demand: Number(outputControllerOut[i][2]),
        symEff: Number(outputControllerOut[i][3]),
        indirectPDEfferent: Number(outputControllerOut[i][4]),
        directPSEff: Number(outputControllerOut[i][5]),
        coefVariation: Number(outputControllerOut[i][6])
      }
      outputController.push(newItem)
    }

    return (
      <div className="App">
        <header className="App-header">
          <h2 className="App-title">Plotly and ReactTables within React</h2>
        </header>
        <div>
          <ReactMyTable data={outputController} />
          <PlotlyPlot data={outputController} size={[1000,500]} title={'Heart Rate(r)'} />
        </div>
      </div>
    );
  }
}

export default App;
