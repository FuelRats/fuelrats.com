// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <Page title={this.title}>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>

        <div className="page-content">
          <iframe
            className="page-content"
            src="https://clients.fuelrats.com:7778/#testmode" />
        </div>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Get Help'
  }
}
