/* globals $IS_DEVELOPMENT:false, $IS_STAGING:false, $BUILD_COMMIT:false, $BUILD_COMMIT_SHORT:false */

// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'





// Component imports
import { Link } from '~/routes'
import { connect } from '~/store'
import { selectSession } from '~/store/selectors'

import Brand from '../../public/static/svg/brand.svg'
import Nav from './Nav'





// Component constants
const IS_DEV_OR_STAGING = $IS_DEVELOPMENT || $IS_STAGING
const BUILD_COMMIT = $BUILD_COMMIT
const BUILD_COMMIT_SHORT = $BUILD_COMMIT_SHORT




function Header (props) {
  const {
    loggedIn,
    userId,
  } = props
  return (
    <div id="HeaderContainer">

      <input
        aria-label="Navigation toggle"
        id="NavControl"
        type="checkbox" />

      <label className="burger button tall secondary" htmlFor="NavControl" id="Burger" title="Expand/Collapse Menu">
        <FontAwesomeIcon icon="bars" />
      </label>

      <header role="banner">

        <Link route="home">
          <a className="brand" title="Home">
            <div className="brand-animation-wrapper">
              <Brand id="brandSvg" />
            </div>
          </a>
        </Link>

        <Nav />

        <ul className="about-actions fa-ul">

          <li>
            <Link params={{ slug: 'terms-of-service' }} route="wordpress">
              <a className="button link">
                <FontAwesomeIcon fixedWidth icon="book" />
                {'Terms of Service'}
              </a>
            </Link>
          </li>

          <li>
            <Link params={{ slug: 'privacy-policy' }} route="wordpress">
              <a className="button link">
                <FontAwesomeIcon fixedWidth icon="user-secret" />
                {'Privacy Policy'}
              </a>
            </Link>
          </li>

          <li>
            <Link route="about acknowledgements">
              <a className="button link">
                <FontAwesomeIcon fixedWidth icon="hands-helping" />
                {'Acknowledgements'}
              </a>
            </Link>
          </li>

          {
            IS_DEV_OR_STAGING && (
              <li>
                <a
                  className="button link"
                  href={`https://www.github.com/fuelrats/fuelrats.com${BUILD_COMMIT ? `/commit/${BUILD_COMMIT}` : ''}`}
                  rel="noopener noreferrer"
                  target="_blank">
                  <FontAwesomeIcon fixedWidth icon="code-branch" />
                  {BUILD_COMMIT_SHORT}
                </a>
              </li>
            )
          }

        </ul>

        <div className="social-actions">

          <a
            className="button link"
            href="https://www.twitter.com/FuelRats/"
            rel="noopener noreferrer"
            target="_blank"
            title="Fuel Rats on Twitter">
            <FontAwesomeIcon
              fixedWidth
              icon={['fab', 'twitter']} />
          </a>

          <a
            className="button link"
            href="https://www.reddit.com/r/FuelRats/"
            rel="noopener noreferrer"
            target="_blank"
            title="Fuel Rats on Reddit">
            <FontAwesomeIcon
              fixedWidth
              icon={['fab', 'reddit-alien']} />
          </a>

          <a
            className="button link"
            href="https://www.twitch.tv/fuelrats/"
            rel="noopener noreferrer"
            target="_blank"
            title="Fuel Rats on Twitch">
            <FontAwesomeIcon
              fixedWidth
              icon={['fab', 'twitch']} />
          </a>

          <a
            className="button link"
            href="https://www.github.com/FuelRats/"
            rel="noopener noreferrer"
            target="_blank"
            title="Tech Rats on GitHub">
            <FontAwesomeIcon
              fixedWidth
              icon={['fab', 'github']} />
          </a>

          <a
            className="button link"
            href="https://forums.frontier.co.uk/showthread.php/150703-Out-of-Fuel-Explorer-Rescue-Service-The-Fuel-Rats"
            rel="noopener noreferrer"
            target="_blank"
            title="Fuel Rats on Frontier Forums">
            <FontAwesomeIcon
              fixedWidth
              icon="space-shuttle"
              transform={{ rotate: -45 }} />
          </a>

        </div>

        <div className="join-actions">

          <Link route="rescue-landing">
            <a className="button get-fuel">
              {'Get Fuel'}
            </a>
          </Link>

          {
            !loggedIn && !userId && (
              <Link route="register">
                <a className="button secondary">
                  {'Become a Rat'}
                </a>
              </Link>
            )
          }

        </div>
      </header>
    </div>
  )
}





Header.mapStateToProps = (state) => {
  return selectSession(state)
}





export default connect(Header)
