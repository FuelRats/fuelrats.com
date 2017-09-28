// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'
import RescuesByRatTable from '../components/RescuesByRatTable'





// Component imports
const title = 'Leaderboard'





class Leaderboard extends React.Component {

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
          <RescuesByRatTable />
        </div>
      </div>
    )
  }
}





export default Page(Leaderboard, title)
