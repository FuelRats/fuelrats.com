// Module imports
import moment from 'moment'
import React from 'react'
import ReactTable from 'react-table'





// Component imports
import { connect } from '../store'
import { Link } from '../routes'
import AddRatForm from './AddRatForm'
import Component from './Component'
import RatDetails from './RatDetails'




@connect
class UserRatsPanel extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  static _renderCreatedAtColumn (row) {
    return moment(row.original.attributes.createdAt).format('DD MMMM, YYYY')
  }

  static _renderPlatformColumn (row) {
    return (
      <div className={['badge', 'platform', 'short', row.original.attributes.platform].join(' ')} />
    )
  }

  static _renderNameColumn (row) {
    const { id } = row.original
    const { name } = row.original.attributes

    return (
      <Link route="rats view" params={{ id }}>
        <a>{name}</a>
      </Link>
    )
  }

  _renderSubcomponent (row) {
    const ships = row.original.relationships.ships.data.map(({ id }) => this.props.ships.ships.find((ship) => ship.id === id))

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
    }
  }

  async onSubmit (event) {
    const {
      name,
      platform,
    } = this.state

    event.preventDefault()

    const rat = {
      name,
      platform,
    }

    await this.props.createRat(rat)
  }

  render () {
    const { rats } = this.props

    return (
      <div className="panel">
        <ReactTable
          className="user-rats"
          columns={this.columns}
          data={rats}
          defaultPageSize={rats.length}
          manual
          showPagination={false}
          SubComponent={this._renderSubcomponent} />
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





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['createRat']

  static mapStateToProps = ({ rats, ships, user }) => ({
    rats: Object.values(rats.rats).filter((rat) => user.id === rat.attributes.userId),
    ships,
  })
}





export default UserRatsPanel
