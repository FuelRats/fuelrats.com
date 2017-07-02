// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import ReactTable from 'react-table'
import withRedux from 'next-redux-wrapper'





// Module imports
import {
  actions,
  initStore,
} from '../store'
import Component from './Component'





class RescuesTablePanel extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _generateColumns () {
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

  _renderCodeRedRow (row) {
    let rescue = row.original

    if (rescue.codeRed) {
      return (
        <span className="text-danger">
          <i className="fa fa-fw fa-check" title="Code Red"></i>
        </span>
      )
    }

    return (
      <span className="text-muted">
        <i className="fa fa-fw fa-minus"></i>
      </span>
    )
  }

  _renderDateRow (row) {
    let rescue = row.original

    return moment(rescue.date).add(1286, 'years').format('DD MMM, YYYY')
  }

  _renderRatsRow (row) {
    let { rats } = row.original

    if (rats.length) {
      return (
        <ul className="comma-separated inline">
          {rats.map((rat, index) => <li key={index}>{rat}</li>)}
        </ul>
      )
    }

    return 'There are no rats assigned to this rescue'
  }

  _renderStateRow (row) {
    let {
      active,
      open,
      successful,
    } = row.original

    if (open) {
      if (active) {
        return (
          <span className="text-info">
            <i className="fa fa-fw fa-rocket" title="Active"></i>
            Active
          </span>
        )
      }

      return (
        <span className="text-muted">
          <i className="fa fa-fw fa-pause" title="Inactive"></i>
          Inactive
        </span>
      )
    }

    if (successful) {
      return (
        <span className="text-success">
          <i className="fa fa-fw fa-check" title="Successful"></i>
          Successful
        </span>
      )
    }

    return (
      <span className="text-success">
        <i className="fa fa-fw fa-times" title="Failed"></i>
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
    let {
      rescues,
      retrieving,
    } = this.props

    return (
      <section className="panel">
        <ReactTable
          className="rescues"
          columns={this._generateColumns()}
          data={rescues}
          manual
          showPagination={false} />
      </section>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
    getRescues: bindActionCreators(actions.getRescues, dispatch),
  }
}

const mapStateToProps = state => {
  return Object.assign({
    showAdmin: state.user.isAdmin
  }, state.rescues)
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(RescuesTablePanel)
