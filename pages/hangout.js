// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'





// Component imports
const title = 'Hangout'





class Hangout extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h2>{title}</h2>
        </header>

        <iframe
          className="page-content"
          src="https://kiwi.fuelrats.com:7778/" />
      </div>
    )
  }
}





export default Page(Hangout, title)
