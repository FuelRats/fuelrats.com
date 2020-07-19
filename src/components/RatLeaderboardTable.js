// Module imports
import React from 'react'
import ReactTable from 'react-table'
import { createStructuredSelector } from 'reselect'

import { connect } from '~/store'
import {
  selectLeaderboard, selectLeaderboardStatistics,
} from '~/store/selectors'

import CodeRedIcon from './Leaderboard/CodeRedIcon'
import FirstYearIcon from './Leaderboard/FirstYearIcon'
import RescueAchievementIcon from './Leaderboard/RescueAchievementIcon'





@connect
class RatLeaderboardTable extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    loading: true,
  }



  _handlePageChange = async (state) => {
    this.setState({ loading: true })

    await this.props.getRatLeaderboard({ offset: state.page * state.pageSize, limit: state.pageSize })

    this.setState({ loading: false })
  }


  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    if (!this.props.entries.length) {
      await this.props.getRatLeaderboard()
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
          manual
          className="rat-leaderboard -striped"
          columns={this.columns}
          data={entries ?? []}
          loading={loading}
          pages={statistics.lastPage}
          pageSize={statistics?.limit ?? 100}
          sortable={false}
          onFetchData={this._handlePageChange} />
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
    }

    return this._columns
  }

  static mapDispatchToProps = ['getRatLeaderboard']

  static mapStateToProps = createStructuredSelector({
    statistics: selectLeaderboardStatistics,
    entries: selectLeaderboard,
  })
}





export default RatLeaderboardTable
