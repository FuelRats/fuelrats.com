// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'
import RescuesByRatTable from '../components/RescuesByRatTable'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ asPath, query }) {
    return Object.assign({
      path: asPath,
      query,
    }, query)
  }

  render () {
    let {
      path,
      query,
    } = this.props

    return (
      <Page
        path={path}
        query={query}
        title={this.title}>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>

        <div className="page-content">
          <RescuesByRatTable />
        </div>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Leaderboard'
  }
}
