// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
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
import UserShipsTable from './UserShipsTable'





class UserRatsPanel extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleRowClick () {}

  _renderCreatedAtColumn (row) {
    return moment(row.original.attributes.createdAt).format('DD MMMM, YYYY')
  }

  _renderPlatformColumn (row) {
    return (
      <div className={['badge', 'platform', 'short', row.original.attributes.platform].join(' ')} />
    )
  }

  _renderNameColumn (row) {
    let {
      id,
    } = row.original
    let {
      name,
    } = row.original.attributes

    return (
      <Link href={`/rats/${id}`}>
        <a>{name}</a>
      </Link>
    )
  }

  _renderSubcomponent (row) {
    let ships = row.original.relationships.ships.data.map(({ id }) => this.props.ships.ships.find(ship => ship.id === id))

    return (
      <UserShipsTable data={ships} />
    )
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentWillMount () {
    let {
      CMDRs,
      getRats,
      rats,
    } = this.props

    if (CMDRs && !rats) {
      getRats(CMDRs)
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods(['onSubmit', '_renderSubcomponent'])

    this.state = {
      name: '',
      platform: 'pc',
      submitting: false,
    }
  }

  async onSubmit (event) {
    let {
      createRat,
    } = this.props
    let {
      name,
      platform,
    } = this.state

    event.preventDefault()

    this.setState({ submitting: true })

    let rat = {
      name,
      platform
    }

    await this.props.createRat(rat)
  }

  render () {
    let {
      id,
      rats,
    } = this.props
    let {
      name,
      platform,
      submitting,
    } = this.state

    return (
      <div className="panel">
        <ReactTable
          className="user-rats"
          columns={this.columns}
          data={rats.rats}
          defaultPageSize={rats.rats.length}
          manual
          showPagination={false}
          SubComponent = {this._renderSubcomponent}/>
      </div>
    )
  }
//          <form
//            className="row"
//            onSubmit={this.onSubmit}>
//
//            <div className="input-group stretch-9">
//              <input
//                disabled={submitting}
//                name="add-rat"
//                onChange={event => this.setState({ name: event.target.value })}
//                placeholder="Add a rat..."
//                type="text" />
//
//              <input
//                defaultChecked={platform === 'pc'}
//                hidden
//                id="platform-pc"
//                name="platform"
//                onChange={event => this.setState({ platform: event.target.value })}
//                type="radio"
//                value="pc" />
//              <label
//                className="button"
//                htmlFor="platform-pc">
//                PC
//              </label>
//
//              <input
//                defaultChecked={platform === 'xb'}
//                hidden
//                id="platform-xb"
//                name="platform"
//                onChange={event => this.setState({ platform: event.target.value })}
//                type="radio"
//                value="xb" />
//              <label
//                className="button"
//                htmlFor="platform-xb">
//                XB
//              </label>
//
//              <input
//                defaultChecked={platform === 'ps'}
//                hidden
//                id="platform-ps"
//                name="platform"
//                onChange={event => this.setState({ platform: event.target.value })}
//                type="radio"
//                value="ps" />
//              <label
//                className="button"
//                htmlFor="platform-ps">
//                PS
//              </label>
//            </div>
//
//            <button
//              disabled={!name || submitting}
//              type="submit">Add</button>
//          </form>





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get columns () {
    return [
      {
        accessor: 'attributes.platform',
        Cell: this._renderPlatformColumn,
        className: 'platform',
        Header: 'Platform',
        headerClassName: 'platform',
        id: 'platform',
        resizable: true,
        sortable: true,
        width: 80,
      },
      {
        accessor: 'attributes.name',
        Cell: this._renderNameColumn,
        className: 'name',
        Header: 'Rat',
        headerClassName: 'name',
        id: 'name',
        resizable: true,
        sortable: true,
      },
      {
        accessor: 'attributes.createdAt',
        Cell: this._renderCreatedAtColumn,
        className: 'createdAt',
        Header: 'Created At',
        headerClassName: 'createdAt',
        id: 'createdAt',
        resizable: true,
        sortable: true,
        width: 150,
      },
    ]
  }
}





const mapDispatchToProps = dispatch => {
  return {
    createRat: bindActionCreators(actions.createRat, dispatch),
  }
}

const mapStateToProps = state => {
  let {
    rats,
    ships,
    user,
  } = state

  return {
    rats,
    ships,
    user,
  }
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(UserRatsPanel)
