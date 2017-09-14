// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'
import TabbedPanel from '../components/TabbedPanel'
import UserOverview from '../components/UserOverview'
import UserRatsPanel from '../components/UserRatsPanel'
import UserSettings from '../components/UserSettings'
import UserStatsOverview from '../components/UserStatsOverview'





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

    let tabs = [
      {
        default: true,
        component: (<UserOverview />),
        title: 'Overview',
      },
      {
        component: (<UserRatsPanel />),
        title: 'Rats',
      },
      {
        component: (<UserStatsOverview />),
        title: 'Stats',
      },
      {
        component: (<div>Badge</div>),
        title: 'Badge',
      },
      {
        component: (<UserSettings />),
        title: 'Settings',
      },
    ]

    return (
      <Page
        path={path}
        query={query}
        title={this.title}>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>

        <div className="page-content">
          <TabbedPanel
            name="User Tabs"
            tabs={tabs} />
        </div>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Profile'
  }
}
