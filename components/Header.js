// Module imports
import { bindActionCreators } from 'redux'
import Link from 'next/link'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Component imports
import {
  actions,
  initStore,
} from '../store'
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

    if (!/(^\/get-help|\/$)/.test(path)) {
      getHelpClasses.push('show')
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
          {!loggedIn && (
            <Link href="/register">
              <a className="button secondary">
                Join Us
              </a>
            </Link>
          )}

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





const mapStateToProps = state => {
  let {
    loggedIn,
  } = state.authentication

  return {
    loggedIn,
  }
}





export default withRedux(initStore, mapStateToProps, null)(Header)
