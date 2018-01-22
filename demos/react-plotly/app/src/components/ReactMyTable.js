import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class ReactMyTable extends Component {
  constructor(props) {
    super(props)
    this.onFilterChanged = this.onFilterChanged.bind(this)
    this.updatePlotData = this.updatePlotData.bind(this)
  }

  myFilter(filter, row) {
    if (isNaN(filter.value[0])) {
      var thres = String(filter.value).substring(1, String(filter.value).length);
      if (String(filter.value).length < 2)
        return true
      switch (filter.value[0]) {
        case "<":
          return (row[filter.id] < thres)
        case ">":
          return (row[filter.id] > thres)
        default:
          return false
      }
    } else {
      return String(row[filter.id]).includes(String(filter.value))
    }
  }

  onFilterChanged(state) {
    this.props.callbackFromParent(this.reactTable.getResolvedState().sortedData)
  }

  updatePlotData(e) {
    e.preventDefault()
    this.props.callbackFromParent(this.reactTable.getResolvedState().sortedData);
  }

  render() {
    let avgRate = 0
    for (var i = 0; i < this.props.data.length; i++) {
      avgRate = avgRate + this.props.data[i]['rate']
    }
    avgRate = avgRate / this.props.data.length

    const columns = [{
        accessor: 'time',
        Header: 'Time'
      }, {
        accessor: 'rate',
        Header: 'Heart Rate',
        id: 'rate',
        Cell: ({ value }) => (value),
          filterMethod: (filter, row) => {
            if (filter.value === 'all') {
              return true;
            }
            if (filter.value === 'over') {
              return row[filter.id] >= avgRate;
            }
            if (filter.value === 'under') {
              return row[filter.id] < avgRate;
            }
          },
        Filter: ({ filter, onChange }) =>
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'all'}
          >
            <option value="all">All</option>
            <option value="over">Over Avg</option>
            <option value="under">Under Avg</option>
          </select>,
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
        <div>
          <ReactTable ref={instance => this.reactTable = instance}
            data={this.props.data}
            noDataText="Loading.."
            filterable={true}
            defaultFilterMethod={(filter, row) =>
              this.myFilter(filter, row)}
            columns={columns}
            defaultPageSize={10}
            onFilteredChange={filtered => this.onFilterChanged({ filtered })}
          />
          <button onClick={(e) => this.updatePlotData(e)}>
            Update Plot
          </button>
        </div>
      );
  }
}

ReactMyTable.defaultProps = {
  data: []
};

export default ReactMyTable
