// Module imports
import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'





// Component imports
import Nav from './Nav'
import SqueakmasAlert from './SqueakmasAlert'





let showSqueakmas = false
const now = new Date
const hours = now.getUTCHours()
const date = now.getUTCDate()
const dateIsInRange = date >= 1 && date <= 12
const monthIsCorrect = now.getUTCMonth() === 11
const yearIsCorrect = now.getUTCFullYear() === 2017

if (dateIsInRange && monthIsCorrect && yearIsCorrect) {
  if ((date === 1 && hours > 12) || date > 1) {
    showSqueakmas = true
  }
}





const Header = (props) => {
  const {
    loggedIn,
    isServer,
    path,
  } = props

  const getHelpClasses = ['get-help']

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
        <i className="fa fa-bars fa-3x" aria-hidden="true" />
      </label>

      <header role="banner">
        <Link href="/">
          <a className="brand" title="Home">
            <img alt="Fuel Rats logo" src="/static/images/logo2.png" />
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

      {showSqueakmas && <SqueakmasAlert />}
    </div>
  )
}





const mapStateToProps = state => {
  const { loggedIn } = state.authentication

  return {
    loggedIn,
  }
}





export default connect(mapStateToProps, null)(Header)
