// Module imports
import React from 'react'
import ReactTable from 'react-table'





// Module imports
import { connect } from '../store'
import {
  selectLeaderboard,
} from '../store/selectors'
import CodeRedIcon from './Leaderboard/CodeRedIcon'
import Component from './Component'
import FirstYearIcon from './Leaderboard/FirstYearIcon'
import RescueAchievementIcon from './Leaderboard/RescueAchievementIcon'
import safeParseInt from '../helpers/safeParseInt'





const caseInsensitiveFilter = (filter, row) => {
  const id = filter.pivotId || filter.id
  return row[id] === undefined ? true : String(row[id]).toLowerCase().startsWith(filter.value.toLowerCase())
}





@connect
class RescuesByRatTable extends Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    loading: true,
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    if (!this.props.statistics.length) {
      await this.props.getRatLeaderboard()
    }
    this.setState({ loading: false })
  }

  render () {
    const {
      statistics,
    } = this.props

    const {
      loading,
    } = this.state

    return (
      <section className="panel">
        <ReactTable
          className="rescues-by-rat -striped"
          columns={this.columns}
          data={statistics}
          defaultPageSize={20}
          filterable
          sortable={false}
          resizable={false}
          defaultFilterMethod={caseInsensitiveFilter}
          loading={loading}
          showPageSizeOptions={false} />
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
          headerClassName: 'name-header',
          id: 'name',
        },
        {
          accessor: 'attributes.rescueCount',
          className: 'rescues',
          Header: 'Rescues',
          headerClassName: 'rescues-header',
          id: 'rescues',
          filterable: false,
          width: 150,
        },
        {
          accessor: (datum) => datum,
          className: 'badges',
          Header: 'Badges',
          headerClassName: 'badges-header',
          id: 'badges',
          filterable: false,
          width: 200,
          Cell: ({ value }) => {
            const {
              codeRed,
              createdAt,
              rescueCount,
            } = value.attributes

            return (
              <span className="svg-list">
                <RescueAchievementIcon rescueCount={rescueCount} className="size-32 fixed" />
                <CodeRedIcon codeRedCount={safeParseInt(codeRed)} className="size-32 fixed" />
                <FirstYearIcon createdAt={createdAt} className="size-32 fixed" />
              </span>
            )
          },
        },
      ]
    }

    return this._columns
  }

  static mapDispatchToProps = ['getRatLeaderboard']

  static mapStateToProps = (state) => ({
    statistics: selectLeaderboard(state),
  })
}





export default RescuesByRatTable
