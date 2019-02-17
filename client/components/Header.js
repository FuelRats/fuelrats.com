/* globals $IS_DEVELOPMENT:false, $IS_STAGING:false, $BUILD_COMMIT:false, $BUILD_COMMIT_RANGE:false */

// Module imports
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





// Component imports
import { connect } from '../store'
import Nav from './Nav'
import { Link } from '../routes'
import BrandSvg from './svg/BrandSvg'





// Component constants
const isDevOrStaging = $IS_DEVELOPMENT || $IS_STAGING
const buildCommit = $BUILD_COMMIT
const buildCommitRange = $BUILD_COMMIT_RANGE





const Header = (props) => {
  const {
    loggedIn,
    loggingIn,
  } = props
  return (
    <div id="header-container">

      <input
        aria-label="Navigation toggle"
        id="nav-control"
        type="checkbox" />

      <label title="Expand/Collapse Menu" htmlFor="nav-control" className="burger button tall secondary" id="burger">
        <FontAwesomeIcon icon="bars" />
      </label>

      <header role="banner">

        <Link href="/">
          <a className="brand" title="Home">
            <div className="brand-animation-wrapper">
              <BrandSvg />
            </div>
          </a>
        </Link>

        <Nav />

        <ul className="about-actions fa-ul">

          <li>
            <Link route="wordpress" params={{ slug: 'terms-of-service' }}>
              <a className="button link">
                <FontAwesomeIcon icon="book" fixedWidth />
                Terms of Service
              </a>
            </Link>
          </li>

          <li>
            <Link route="wordpress" params={{ slug: 'privacy-policy' }}>
              <a className="button link">
                <FontAwesomeIcon icon="user-secret" fixedWidth />
                Privacy Policy
              </a>
            </Link>
          </li>

          <li>
            <Link route="about acknowledgements">
              <a className="button link">
                <FontAwesomeIcon icon="hands-helping" fixedWidth />
                Acknowledgements
              </a>
            </Link>
          </li>

          {isDevOrStaging && (
            <li>
              <a
                className="button link"
                href={`https://www.github.com/fuelrats/fuelrats.com/${buildCommitRange ? `compare/${buildCommitRange}` : ''}`}
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon icon="code-branch" fixedWidth />
                {buildCommit}
              </a>
            </li>
          )}

        </ul>

        <div className="social-actions">

          <a
            className="button link"
            href="https://www.twitter.com/FuelRats/"
            target="_blank"
            rel="noopener noreferrer"
            title="Fuel Rats on Twitter">
            <FontAwesomeIcon
              icon={['fab', 'twitter']}
              fixedWidth />
          </a>

          <a
            className="button link"
            href="https://www.reddit.com/r/FuelRats/"
            target="_blank"
            rel="noopener noreferrer"
            title="Fuel Rats on Reddit">
            <FontAwesomeIcon
              icon={['fab', 'reddit-alien']}
              fixedWidth />
          </a>

          <a
            className="button link"
            href="https://www.twitch.tv/fuelrats/"
            target="_blank"
            rel="noopener noreferrer"
            title="Fuel Rats on Twitch">
            <FontAwesomeIcon
              icon={['fab', 'twitch']}
              fixedWidth />
          </a>

          <a
            className="button link"
            href="https://www.github.com/FuelRats/"
            target="_blank"
            rel="noopener noreferrer"
            title="Tech Rats on GitHub">
            <FontAwesomeIcon
              icon={['fab', 'github']}
              fixedWidth />
          </a>

          <a
            className="button link"
            href="https://forums.frontier.co.uk/showthread.php/150703-Out-of-Fuel-Explorer-Rescue-Service-The-Fuel-Rats"
            target="_blank"
            rel="noopener noreferrer"
            title="Fuel Rats on Frontier Forums">
            <FontAwesomeIcon
              icon="space-shuttle"
              transform={{ rotate: -45 }}
              fixedWidth />
          </a>

        </div>

        <div className="join-actions">

          <Link href="/i-need-fuel">
            <a className="button">
              Get Help
            </a>
          </Link>

          {!loggedIn && !loggingIn && (
            <Link href="/register">
              <a className="button secondary">
                Become a Rat
              </a>
            </Link>
          )}

        </div>
      </header>
    </div>
  )
}





Header.mapStateToProps = (state) => {
  const { loggedIn, loggingIn } = state.authentication

  return {
    loggedIn,
    loggingIn,
  }
}





export default connect(Header)
