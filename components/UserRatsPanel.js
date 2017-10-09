// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
import moment from 'moment'
import React from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'





// Module imports
import { actions } from '../store'
import AddRatForm from './AddRatForm'
import Component from './Component'
import RatDetails from './RatDetails'





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
      <RatDetails ships={ships} />
    )
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

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
          SubComponent={this._renderSubcomponent}/>
        <AddRatForm />
      </div>
    )
  }





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

  rats = Object.assign(rats, {
    rats: rats.rats.filter(rat => user.id === rat.attributes.userId),
  })

  return {
    rats,
    ships,
  }
}





export default connect(mapStateToProps, mapDispatchToProps)(UserRatsPanel)
