// Module imports
import React from 'react'





// Component imports
import Dialog from './Dialog'
import Head from './Head'
import Header from './Header'
import Reminders from './Reminders'
import UserMenu from './UserMenu'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <div role="application">
        <Head title={this.props.title || this.props.title} />

        <Header />

        <UserMenu />

        <Reminders />

        <main>
          <div className="fade-in">
            {this.props.children}
          </div>
        </main>

        <Dialog />
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
