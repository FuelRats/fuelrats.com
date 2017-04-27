// Module imports
import Link from 'next/link'
import React from 'react'





// Component imports
import Nav from './Nav'





export default class extends React.Component {
  render () {
    return (
      <header role="banner">
        <Link href="/">
          <a className="brand" />
        </Link>

        <Nav />
      </header>
    )
  }
}
