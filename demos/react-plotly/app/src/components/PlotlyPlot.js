/* global Plotly:true */

import React, { Component } from 'react'
import createPlotlyComponent from 'react-plotly.js/factory'

const Plot = createPlotlyComponent(Plotly);

class PlotlyPlot extends Component {
  render () {
    return (
      <Plot
        data={[
          {
            type: 'scatter',
            mode: 'lines+points',
            x: [1, 2, 3],
            y: [2, 6, 3],
            marker: {color: 'red'}
          },
          {
            type: 'bar',
            x: [1, 2, 3],
            y: [2, 5, 3]
          }
        ]}

        layout={{
          width: 320,
          height: 240,
          title: 'A Fancy Plot'
        }}
      />
    );
  }
}
export default PlotlyPlot
