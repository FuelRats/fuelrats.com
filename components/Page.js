// Module imports
import React from 'react'





// Component imports
import Head from './Head'
import Header from './Header'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <div role="application">
        <Head title={this.props.title || this.props.title} />

        <Header />

        <main>
          <div className="fade-in">
            {this.props.children}
          </div>
        </main>
      </div>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Untitled'
  }
}
