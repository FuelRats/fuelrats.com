// Module imports
import Link from 'next/link'
import React from 'react'





// Component imports
import Nav from './Nav'





export default class extends React.Component {
  render () {
    let {
      path,
    } = this.props

    console.log('path', path)

    let joinActionsClasses = [
      'join-actions',
    ]

    if (path === '/') {
      joinActionsClasses.push('hide')
    }

    return (
      <header role="banner">
        <input defaultChecked="true" data-hidden id="nav-control" type="checkbox" />

        <Link href="/">
          <a className="spin-3d">
            <img className="brand" src="/static/images/logo2.png" />
          </a>
        </Link>

        <Nav />

        <div className={joinActionsClasses.join(' ')}>
          <Link href="/register">
            <a className="button secondary">
              Join Us
            </a>
          </Link>

          <Link href="/get-help">
            <a className="button">
              Get Help
            </a>
          </Link>
        </div>
      </header>
    )
  }
}
