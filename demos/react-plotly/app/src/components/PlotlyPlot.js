/* global Plotly:true */

import React, { Component } from 'react'
import createPlotlyComponent from 'react-plotly.js/factory'

const Plot = createPlotlyComponent(Plotly);

class PlotlyPlot extends Component {

  render () {
    let myArray = [
      {
        type: 'scatter',
        x: [1, 2, 3],
        y: [6, 2, 3],
        marker: {
          color: 'rgb(16, 32, 77)'
        }
      },
      {
        type: 'bar',
        x: [1, 2, 3],
        y: [6, 2, 3],
        name: 'bar chart example'
      }
    ];
    return (
      <Plot
        data={myArray}
        layout={{
          width: this.props.size[0],
          height: this.props.size[1],
          title: 'My first Plot'
        }}
      />
    );
  }
}
export default PlotlyPlot
