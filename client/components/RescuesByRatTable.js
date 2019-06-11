// Module imports
import React from 'react'
import ReactTable from 'react-table'





// Module imports
import { connect } from '../store'
import {
  selectLeaderboard,
  selectLeaderboardLoading,
} from '../store/selectors'
import Component from './Component'




@connect
class RescuesByRatTable extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this.props.getRatLeaderboard()
  }

  render () {
    const {
      loading,
      statistics,
    } = this.props

    return (
      <section className="panel">
        <ReactTable
          className="rescues-by-rat"
          columns={this.columns}
          data={statistics}
          loading={loading}
          manual
          showPagination={false} />
      </section>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get columns () {
    if (!this._columns) {
      this._columns = [
        {
          accessor: (datum) => datum.attributes['user.displayRat.name'] || datum.attributes.rats[0],
          className: 'name',
          Header: 'Name',
          headerClassName: 'name',
          id: 'name',
          resizable: false,
          sortable: false,
        },
        {
          accessor: 'attributes.rescueCount',
          className: 'rescues',
          Header: 'Rescues',
          headerClassName: 'rescues',
          id: 'rescues',
          resizable: false,
          sortable: false,
          width: 100,
        },
      ]
    }

    return this._columns
  }

  static mapDispatchToProps = ['getRatLeaderboard']

  static mapStateToProps = (state) => ({
    loading: selectLeaderboardLoading(state),
    statistics: selectLeaderboard(state),
  })
}





export default RescuesByRatTable
