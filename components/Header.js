// Module imports
import Link from 'next/link'
import React from 'react'





// Component imports
import Nav from './Nav'





export default class extends React.Component {
  render () {
    return (
      <header role="banner">
        <input defaultChecked="true" data-hidden id="nav-control" type="checkbox" />

        <Link href="/">
          <a className="spin-3d">
            <img className="brand" src="/static/images/logo2.png" />
          </a>
        </Link>

        <Nav />
      </header>
    )
  }
}
