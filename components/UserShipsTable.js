// Module imports
import Link from 'next/link'
import moment from 'moment'
import React from 'react'
import ReactTable from 'react-table'





// Module imports
import Component from './Component'





export default class UserShipsTable extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleRowClick () {}

  _renderIDCell (row) {
    let id = row.value.toString()

    while (id.length < 4) {
      id = `0${id}`
    }

    console.log(row.original)

    return `FR${id}`
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let {
      data
    } = this.props

    return (
      <ReactTable
        className="user-ships"
        columns={this.columns}
        data={data}
        defaultPageSize={data.length}
        showPagination={false} />
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get columns () {
    return [
      {
        accessor: 'attributes.shipId',
        Cell: this._renderIDCell,
        className: 'shipId',
        Header: 'ID',
        headerClassName: 'shipId',
        id: 'shipId',
        resizable: true,
        sortable: true,
        width: 100,
      },
      {
        accessor: 'attributes.name',
        className: 'name',
        Header: 'Name',
        headerClassName: 'name',
        id: 'name',
        resizable: true,
        sortable: true,
      },
      {
        accessor: 'attributes.shipType',
        className: 'type',
        Header: 'Type',
        headerClassName: 'type',
        id: 'type',
        resizable: true,
        sortable: true,
      },
    ]
  }
}
