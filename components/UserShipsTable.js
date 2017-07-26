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
        accessor: 'attributes.name',
        className: 'name',
        Header: 'Ships',
        headerClassName: 'name',
        id: 'name',
        resizable: true,
        sortable: true,
      },
    ]
  }
}
