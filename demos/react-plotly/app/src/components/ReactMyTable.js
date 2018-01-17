import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class ReactMyTable extends Component {
  render() {
    const columns = [{
        accessor: 'time',
        Header: 'Time'
      }, {
        accessor: 'rate',
        Header: 'Heart Rate'
      }, {
        accessor: 'demand',
        Header: 'Demand'
      }, {
        accessor: 'symEff',
        Header: 'Sym Eff'
      }, {
        accessor: 'indirectPDEfferent',
        Header: 'Indirect PS Efferent'
      }, {
        accessor: 'directPSEff',
        Header: 'Direct PS Eff'
      }, {
        accessor: 'coefVariation',
        Header: 'Coef of Variation'
      }]
      return (
        <ReactTable
          data={this.props.data}
          columns={columns}
          defaultPageSize={10}
        />
      );
  }
}

ReactMyTable.defaultProps = {
  data: []
};

export default ReactMyTable
