// Module imports
import { bindActionCreators } from 'redux'
import React from 'react'
import ReactTable from 'react-table'





// Module imports
import { actions, connect } from '../store'
import Component from './Component'




@connect
class RescuesByRatTable extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _getRescuesByRatStatistics = async () => {
    await this.props.getRescuesByRatStatistics()
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._getRescuesByRatStatistics()
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
    return this._columns || (this._columns = [
      {
        accessor: datum => datum.attributes['user.displayRat.name'] || datum.attributes.rats[0],
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
    ])
  }

  static mapDispatchToProps = dispatch => ({
    getRescuesByRatStatistics: bindActionCreators(actions.getRescuesByRatStatistics, dispatch),
  })

  static mapStateToProps = state => {
    const {
      loading,
      statistics,
    } = state.rescuesByRat

    return {
      loading,
      statistics: statistics.filter(rat => rat.attributes.rescueCount > 0),
    }
  }
}





export default RescuesByRatTable
