import React, { Component } from 'react';
import './App.css';
import ReactMyTable from './components/ReactMyTable'
import PlotlyPlot from './components/PlotlyPlot'
import outputControllerOut from './data/outputControllerOut.json';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      outputControllerOutRaw: [],
      outputControllerOutReduced: []
    }
  }

  componentDidMount() {
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

    this.setState({
      outputControllerOutRaw: outputController,
      outputControllerOutReduced: outputController
    })
  }

  reduceSamples(e) {
    e.preventDefault()
    const reducebyAvg = false
    if (reducebyAvg) {
      const hrAvg = 0.3023866997543023
      let outputControllerOutReduced = []
      for (var i = 0; i < this.state.outputControllerOutRaw.length; i++) {
        if (this.state.outputControllerOutRaw[i]['rate'] > hrAvg) {
          outputControllerOutReduced.push(this.state.outputControllerOutRaw[i])
        }
      }
      this.setState({
        outputControllerOutReduced: outputControllerOutReduced
      })
    } else {
      const min = 0;
      const max = this.state.outputControllerOutRaw.length;
      const rand = min + Math.random() * (max - min);
      this.setState({
        outputControllerOutReduced: this.state.outputControllerOutRaw.slice(0, rand)
      })
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2 className="App-title">Plotly and ReactTables within React</h2>
        </header>
        <div>
          <ReactMyTable data={this.state.outputControllerOutRaw} />
          <button onClick={(e) => this.reduceSamples(e)}>
            Reduce samples
          </button>
          <PlotlyPlot data={this.state.outputControllerOutReduced} size={[1000,500]} title={'Heart Rate(r)'} />
        </div>
      </div>
    );
  }
}

export default App;
