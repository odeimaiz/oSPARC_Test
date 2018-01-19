/* global Plotly:true */

import React, { Component } from 'react'
import createPlotlyComponent from 'react-plotly.js/factory'

const Plot = createPlotlyComponent(Plotly);

class PlotlyPlot extends Component {

  render () {
    let x_values = []
    let y1_values = []
    let y2_values = []
    let y3_values = []
    let y5_values = []
    for (var i = 0; i < this.props.data.length; i++) {
      x_values.push(this.props.data[i]['time'])
      y1_values.push(this.props.data[i]['rate'])
      y2_values.push(this.props.data[i]['demand'])
      y3_values.push(this.props.data[i]['symEff']/0.0008)
      y5_values.push(this.props.data[i]['directPSEff']/0.0008)
    }

    let myData = [
      {
        type: 'scatter',
        mode: 'markers',
        x: x_values,
        y: y1_values,
        name: 'rate',
        marker: { color: 'magenta', size: 1 }
      }, {
        type: 'markers',
        x: x_values,
        y: y2_values,
        name: 'demand',
        marker: { color: 'black' }
      }, {
        type: 'markers',
        x: x_values,
        y: y3_values,
        name: 'sympathetic efferent',
        marker: { color: 'red' }
      }, {
        type: 'markers',
        x: x_values,
        y: y5_values,
        name: 'direct parasympathetic efferent',
        marker: { color: 'blue' }
      }
    ];

    return (
      <Plot
        data={myData}
        layout={{
          width: this.props.size[0],
          height: this.props.size[1],
          title: this.props.title,
          xaxis: {
            title: 'tau (sec)'
          },
          yaxis: {
            autorange: false,
            range: [-0.1, 0.85]
          }
        }}
      />
    );
  }
}
export default PlotlyPlot
