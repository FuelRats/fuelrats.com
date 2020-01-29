/* globals $IS_DEVELOPMENT:false, $IS_STAGING:false, $BUILD_COMMIT:false, $BUILD_COMMIT_SHORT:false */

// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'





// Component imports
import { Link } from '../routes'
import { connect } from '../store'
import { selectSession } from '../store/selectors'
import Nav from './Nav'
import BrandSvg from './svg/BrandSvg'





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

      <label title="Expand/Collapse Menu" htmlFor="NavControl" className="burger button tall secondary" id="Burger">
        <FontAwesomeIcon icon="bars" />
      </label>

      <header role="banner">

        <Link route="home">
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

          {IS_DEV_OR_STAGING && (
            <li>
              <a
                className="button link"
                href={`https://www.github.com/fuelrats/fuelrats.com${BUILD_COMMIT ? `/commit/${BUILD_COMMIT}` : ''}`}
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon icon="code-branch" fixedWidth />
                {BUILD_COMMIT_SHORT}
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

          <Link route="rescue-landing">
            <a className="button">
              Get Help
            </a>
          </Link>

          {!loggedIn && !userId && (
            <Link route="register">
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





Header.mapStateToProps = (state) => selectSession(state)





export default connect(Header)
