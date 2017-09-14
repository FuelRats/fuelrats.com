// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'
import RescuesBySystemChart from '../components/RescuesBySystemChart'
import RescuesOverTimeChart from '../components/RescuesOverTimeChart'





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
          <RescuesOverTimeChart />
          <RescuesBySystemChart />
        </div>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Statistics'
  }
}
