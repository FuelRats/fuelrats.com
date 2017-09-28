// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'





// Component constants
const title = 'About'





class About extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>
      </div>
    )
  }
}

export default Page(About, title)
