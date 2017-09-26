// Module imports
import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'





// Component imports
import Component from './Component'
import Nav from './Nav'





class Header extends React.Component {
  render () {
    let {
      loggedIn,
      isServer,
      path,
    } = this.props

    let getHelpClasses = [
      'get-help',
    ]

    if (isServer) {
      getHelpClasses.push('hide')
    }

    if (!/(^\/i-need-fuel|\/$)/.test(path)) {
      getHelpClasses.push('show')
    }

    return (
      <div id="header-container">
        <input id="nav-control" type="checkbox" />

        <label title="Expand/Collapse Menu" htmlFor="nav-control" className="burger" id="burger">
          <i className="fa fa-bars fa-3x" aria-hidden="true"></i>
        </label>

        <header role="banner">

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
            {!loggedIn && (
              <Link href="/register">
                <a className="button secondary">
                  Join Us
                </a>
              </Link>
            )}

            <div className={getHelpClasses.join(' ')}>
              <Link href="/i-need-fuel">
                <a className="button">
                  Get Help
                </a>
              </Link>
            </div>
          </div>
        </header>
      </div>
    )
  }
}





const mapStateToProps = state => {
  let {
    loggedIn,
  } = state.authentication

  return {
    loggedIn,
  }
}





export default connect(mapStateToProps, null)(Header)
