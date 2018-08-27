// Module imports
import { bindActionCreators } from 'redux'
import React from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'





// Module imports
import { actions } from '../store'
import Component from './Component'





class RescuesByRatTable extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  async _getRescuesByRatStatistics () {
    await this.props.getRescuesByRatStatistics()
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._getRescuesByRatStatistics()
  }

  constructor (props) {
    super(props)

    this._bindMethods(['_getRescuesByRatStatistics'])
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
          data={statistics.filter(rat => rat.attributes.rescueCount > 0)}
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
}





const mapDispatchToProps = dispatch => ({
  getRescuesByRatStatistics: bindActionCreators(actions.getRescuesByRatStatistics, dispatch),
})

const mapStateToProps = state => {
  const {
    loading,
    statistics,
  } = state.rescuesByRat

  return Object.assign({}, {
    loading,
    statistics,
  })
}





export default connect(mapStateToProps, mapDispatchToProps)(RescuesByRatTable)
