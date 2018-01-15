import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'

class BarChart2 extends Component {
  render() {
    const dataMax = max(this.props.data);
    const upperLimit = this.props.size[1];
    const yScale = scaleLinear()
      .domain([0, dataMax])
      .range([0, upperLimit]);
    const myLine = this.props.data.map((d, i) =>
      <rect
        key={i}
        fill={'#fe9922'}
        x={i * 25}
        y={upperLimit - yScale(d)}
        height={yScale(d)}
        width={25}
      />)
      return <svg
        width={this.props.size[0]} height={this.props.size[1]}>
          {myLine}
        </svg>
  }
}
export default BarChart2
