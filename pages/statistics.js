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

  render () {
    return (
      <Page title={this.title}>
        <header className="page-header">
          <h1>{this.title}</h1>
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
