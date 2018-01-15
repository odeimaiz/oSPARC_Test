import React, { Component } from 'react'
import worlddata from './world'
import { geoMercator, geoPath } from 'd3-geo'

class WorldMap extends Component {
  render() {
    const projection = geoMercator()
    const pathGenerator = geoPath().projection(projection)
    const countries = worlddata.features.map((d, i) =>
      <path
        key={'path' + i}
        d={pathGenerator(d)}
        className='countries'
      />)

    return <svg
      width={this.props.size[0]} height={this.props.size[1]}>
        {countries}
      </svg>
   }
}
export default WorldMap
