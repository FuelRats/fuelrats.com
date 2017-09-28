// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'
import RescuesBySystemChart from '../components/RescuesBySystemChart'
import RescuesOverTimeChart from '../components/RescuesOverTimeChart'





// Component imports
const title = 'Statistics'





class Statistics extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        <div className="page-content">
          <RescuesOverTimeChart />
          <RescuesBySystemChart />
        </div>
      </div>
    )
  }
}





export default Page(Statistics, title)
