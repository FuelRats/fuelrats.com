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

    let getHelpClasses = [
      'get-help',
    ]

    if (/(^\/get-help|\/$)/.test(path)) {
      getHelpClasses.push('hide')
    }

    return (
      <header role="banner">
        <input defaultChecked="true" data-hidden id="nav-control" type="checkbox" />

        <Link href="/">
          <a
            className="spin-3d"
            title="Home">
            <img
              alt="Fuel Rats logo"
              className="brand"
              src="/static/images/logo2.png" />
          </a>
        </Link>

        <Nav />

        <div className="join-actions">
          <Link href="/register">
            <a className="button secondary">
              Join Us
            </a>
          </Link>

          <div className={getHelpClasses.join(' ')}>
            <Link href="/get-help">
              <a className="button">
                Get Help
              </a>
            </Link>
          </div>
        </div>
      </header>
    )
  }
}
