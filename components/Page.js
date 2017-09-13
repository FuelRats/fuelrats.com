// Module imports
import React from 'react'
import {
  connect,
  Provider,
} from 'react-redux'





// Component imports
import {
  initStore,
} from '../store'
import Dialog from './Dialog'
import Head from './Head'
import Header from './Header'
import Reminders from './Reminders'
import UserMenu from './UserMenu'





const store = initStore()





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let {
      children,
      className,
      isServer,
      path,
      title,
    } = this.props
    let mainClasses = ['fade-in', 'page'].concat(title.toLowerCase().replace(' ', '-')).join(' ')

    return (
      <Provider store={store}>
        <div role="application">
          <Head title={title || this.title} />

          <Header
            isServer={isServer}
            path={path} />

          <UserMenu />

          <Reminders />

          <main>
            <div className={mainClasses}>
              {children}
            </div>
          </main>

          <Dialog />
        </div>
      </Provider>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Untitled'
  }
}
