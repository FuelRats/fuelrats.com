// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'
import TabbedPanel from '../components/TabbedPanel'
import UserOverview from '../components/UserOverview'
import UserRatsPanel from '../components/UserRatsPanel'
import UserStatsOverview from '../components/UserStatsOverview'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let {
      path,
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
    ]

    return (
      <Page path={path} title={this.title}>
        <header className="page-header">
          <h1>{this.title}</h1>
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
