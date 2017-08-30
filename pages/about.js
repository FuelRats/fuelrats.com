// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let {
      path,
    } = this.props

    return (
      <Page path={path} title={this.title}>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'About'
  }
}
