import _debounce from 'lodash/debounce'
import React from 'react'
import { useSelector } from 'react-redux'
import ReactTable from 'react-table-6'

import { connectState } from '~/store'
import { getLeaderboard } from '~/store/actions/statistics'
import {
  selectLeaderboard,
  selectLeaderboardStatistics,
} from '~/store/selectors'

import CodeRedIcon from './Leaderboard/CodeRedIcon'
import FirstYearIcon from './Leaderboard/FirstYearIcon'
import RescueAchievementIcon from './Leaderboard/RescueAchievementIcon'





// Component constants
const FETCH_DATA_DEBOUNCE = 500
const DEFAULT_PAGE_SIZE = 25

const columns = [
  {
    accessor: 'attributes.preferredName',
    className: 'name',
    Header: 'Name',
    headerClassName: 'name-header',
    id: 'name',
    minWidth: 125,
  },
  {
    accessor: 'attributes.rescueCount',
    className: 'rescues',
    Header: 'Rescues',
    headerClassName: 'rescues-header',
    id: 'rescues',
    filterable: false,
    minWidth: 60,
    maxWidth: 80,
  },
  {
    accessor: (datum) => {
      return datum
    },
    className: 'badges',
    Header: 'Badges',
    headerClassName: 'badges-header',
    id: 'badges',
    minWidth: 150,
    maxWidth: 200,
    filterable: false,
    Cell: ({ value }) => {
      const {
        codeRedCount,
        joinedAt,
        rescueCount,
      } = value.attributes

      return (
        <div className="badge-list">
          <RescueAchievementIcon className="size-32 fixed" rescueCount={rescueCount} />
          <CodeRedIcon className="size-32 fixed" codeRedCount={codeRedCount} />
          <FirstYearIcon className="size-32 fixed" createdAt={joinedAt} />
        </div>
      )
    },
  },
]




@connectState(() => {
  return {
    statistics: useSelector(selectLeaderboardStatistics),
    entries: useSelector(selectLeaderboard),
  }
})
class RatLeaderboardTable extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    loading: true,
  }


  _fetchData = async (state) => {
    await this.props.dispatch(getLeaderboard({
      filter: {
        name: state.filtered.length > 0 ? `%${state.filtered[0]?.value}%` : undefined,
      },
      page: {
        offset: state.page * state.pageSize,
        limit: state.pageSize,
      },
    }))

    this.setState({ loading: false })
  }

  _queueFetchData = _debounce(this._fetchData, FETCH_DATA_DEBOUNCE)

  _handleFetchData = (state) => {
    if (!this.state.loading) {
      this.setState({ loading: true })
    }

    this._queueFetchData(state)
  }


  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    if (!this.props.statistics?.page) { // page would be undefined if we haven't grabbed the leaderboard yet.
      await this.props.dispatch(getLeaderboard({
        page: {
          limit: DEFAULT_PAGE_SIZE,
        },
      }))
    }

    this.setState({ loading: false })
  }

  render () {
    const {
      statistics,
      entries,
    } = this.props

    const {
      loading,
    } = this.state

    return (
      <section className="panel">
        <ReactTable
          filterable
          manual
          className="rat-leaderboard -striped"
          columns={columns}
          data={entries ?? []}
          loading={loading}
          pages={statistics.lastPage}
          pageSize={statistics?.limit ?? DEFAULT_PAGE_SIZE}
          sortable={false}
          onFetchData={this._handleFetchData} />
      </section>
    )
  }
}





export default RatLeaderboardTable
