// Module imports
import moment from 'moment'
import React from 'react'
import ReactTable from 'react-table'





// Module imports
import { connect } from '../store'
import { Router } from '../routes'
import Component from './Component'





// Component constants
const ELITE_GAME_YEAR_DESPARITY = 1286 // Years between IRL year and Elite universe year





@connect
class RescuesTablePanel extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  static _handleRowClick (state, row) {
    if (row) {
      const rescue = row.original

      return {
        className: 'clickable',
        onClick: () => {
          Router.pushRoute('paperwork view', { id: rescue.id })
        },
      }
    }

    return {}
  }

  static _renderCodeRedRow (row) {
    const rescue = row.original

    if (rescue.codeRed) {
      return (
        <span className="text-danger">
          <i className="fa fa-fw fa-check" title="Code Red" />
        </span>
      )
    }

    return (
      <span className="text-muted">
        <i className="fa fa-fw fa-minus" />
      </span>
    )
  }

  static _renderDateRow (row) {
    const rescue = row.original

    return moment(rescue.date).add(ELITE_GAME_YEAR_DESPARITY, 'years').format('DD MMM, YYYY')
  }

  static _renderRatsRow (row) {
    const { rats } = row.original

    if (rats.length) {
      return (
        <ul className="comma-separated inline">
          {rats.map((rat) => <li key={rat.id}>{rat}</li>)}
        </ul>
      )
    }

    return 'There are no rats assigned to this rescue'
  }

  static _renderStateRow (row) {
    const {
      active,
      open,
      successful,
    } = row.original

    if (open) {
      if (active) {
        return (
          <span className="text-info">
            <i className="fa fa-fw fa-rocket" title="Active" />
            Active
          </span>
        )
      }

      return (
        <span className="text-muted">
          <i className="fa fa-fw fa-pause" title="Inactive" />
          Inactive
        </span>
      )
    }

    if (successful) {
      return (
        <span className="text-success">
          <i className="fa fa-fw fa-check" title="Successful" />
          Successful
        </span>
      )
    }

    return (
      <span className="text-success">
        <i className="fa fa-fw fa-times" title="Failed" />
        Failed
      </span>
    )
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this.props.getRescues()
  }


  render () {
    const { rescues } = this.props

    return (
      <section className="panel">
        <ReactTable
          className="rescues"
          columns={this.columns}
          data={rescues}
          getTrProps={this._handleRowClick} /* eslint-disable-line react/jsx-handler-names */// Yeah uh "get" as a prop 🤔
          manual
          showPagination={false} />
      </section>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get columns () {
    return [
      {
        accessor: 'date',
        Cell: this._renderDateRow,
        className: 'date',
        Header: 'Date',
        headerClassName: 'date',
        id: 'date',
        resizable: true,
        sortable: true,
        width: 100,
      },
      {
        accessor: 'system',
        className: 'system',
        Header: 'System',
        headerClassName: 'system',
        id: 'system',
        resizable: true,
        sortable: true,
      },
      {
        accessor: 'state',
        Cell: this._renderStateRow,
        className: 'state',
        Header: 'State',
        headerClassName: 'state',
        id: 'state',
        resizable: true,
        sortable: true,
        width: 100,
      },
      {
        accessor: 'codeRed',
        Cell: this._renderCodeRedRow,
        className: 'codeRed',
        Header: 'Code Red',
        headerClassName: 'codeRed',
        id: 'codeRed',
        resizable: true,
        sortable: true,
        width: 80,
      },
      {
        accessor: 'rats',
        className: 'rats',
        Cell: this._renderRatsRow,
        headerClassName: 'rats',
        Header: 'Rats',
        id: 'rats',
        resizable: true,
        sortable: false,
      },
    ]
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['getRescues']

  static mapStateToProps = (state) => ({ ...state.rescues })
}





export default RescuesTablePanel
