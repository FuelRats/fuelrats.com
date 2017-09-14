// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'





// Component imports
const title = 'Get Help'





class GetHelp extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <div>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>

        <div className="page-content">
          <iframe
            className="page-content"
            src="https://clients.fuelrats.com:7778/" />
        </div>
      </div>
    )
  }
}





export default Page(GetHelp, title)
