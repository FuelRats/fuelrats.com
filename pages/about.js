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
      <header className="page-header">
        <h2>{title}</h2>
      </header>
    )
  }
}

export default Page(About, title)
