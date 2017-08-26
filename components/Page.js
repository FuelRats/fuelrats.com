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
    let {
      children,
      className,
      title,
    } = this.props
    let mainClasses = ['fade-in', 'page'].concat(title.toLowerCase().replace(' ', '-')).join(' ')

    return (
      <div role="application">
        <Head title={title} />

        <Header />

        <UserMenu />

        <Reminders />

        <main>
          <div className={mainClasses}>
            {children}
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
