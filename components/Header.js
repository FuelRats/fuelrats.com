// Module imports
import React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'




// Component imports
import Nav from './Nav'
import { Link } from '../routes'
import BrandSvg from './svg/BrandSvg'
import Component from './Component'



// Component constants
const isDevOrStaging = preval`module.exports = process.env.NODE_ENV !== 'production' || ['develop', 'beta'].includes(process.env.TRAVIS_BRANCH)`
const buildCommit = preval`module.exports = (process.env.TRAVIS_COMMIT && process.env.TRAVIS_COMMIT.slice(0, 10)) || process.env.TRAVIS_BRANCH || 'Development'`
const buildCommitRange = preval`module.exports = process.env.TRAVIS_COMMIT_RANGE`
const hideIconStyle = {
  maxHeight: '0',
  maxWidth: '0',
  opacity: '0',
}
const showIconStyle = {
  opacity: '1',
}


class Header extends Component {
  componentDidMount() {
    this.setState({
      renderIcons: true,
    })
  }

  constructor(props) {
    super(props)

    this.state = {
      renderIcons: false,
    }
  }

  render () {
    const {
      renderIcons,
    } = this.state

    const {
      loggedIn,
      loggingIn,
    } = this.props

    return (
      <div id="header-container">
        <input id="nav-control" type="checkbox" />

        <label title="Expand/Collapse Menu" htmlFor="nav-control" className="burger button secondary" id="burger">
          <FontAwesomeIcon style={renderIcons ? showIconStyle : hideIconStyle} icon="bars" />
        </label>

        <header role="banner">
          <Link href="/">
            <a className="brand" title="Home">
              <BrandSvg />
            </a>
          </Link>

          <Nav />

          <ul className="about-actions fa-ul">
            <li>
              <Link route="legal terms">
                <a className="button link">
                  <FontAwesomeIcon style={renderIcons ? showIconStyle : hideIconStyle} icon="book" listItem />
                  <span className="link-text">Terms of Serivce</span>
                </a>
              </Link>
            </li>
            <li>
              <Link route="legal privacy">
                <a className="button link">
                  <FontAwesomeIcon style={renderIcons ? showIconStyle : hideIconStyle} icon="user-secret" listItem />
                  <span className="link-text">Privacy Policy</span>
                </a>
              </Link>
            </li>
            <li>
              <Link route="about acknowledgements">
                <a className="button link" >
                  <FontAwesomeIcon style={renderIcons ? showIconStyle : hideIconStyle} icon="hands-helping" listItem />
                  <span className="link-text">Acknowledgements</span>
                </a>
              </Link>
            </li>

            {isDevOrStaging && (
              <li>
                <a
                  className="button link"
                  href={`https://www.github.com/fuelrats/fuelrats.com/${buildCommitRange ? `compare/${buildCommitRange}` : ''}`}
                  target="_blank"
                  rel="noopener noreferrer" >
                  <FontAwesomeIcon style={renderIcons ? showIconStyle : hideIconStyle} icon="code-branch" listItem />
                  <span className="link-text">{buildCommit}</span>
                </a>
              </li>
            )}

          </ul>

          <div className="social-actions">
            <a
              className="button link icon"
              href="https://www.twitter.com/FuelRats/"
              target="_blank"
              rel="noopener noreferrer"
              title="Fuel Rats on Twitter" >
              <FontAwesomeIcon
                style={renderIcons ? showIconStyle : hideIconStyle}
                icon={['fab', 'twitter']}
                fixedWidth />
            </a>

            <a
              className="button link icon"
              href="https://www.reddit.com/r/FuelRats/"
              target="_blank"
              rel="noopener noreferrer"
              title="Fuel Rats on Reddit" >
              <FontAwesomeIcon
                style={renderIcons ? showIconStyle : hideIconStyle}
                icon={['fab', 'reddit-alien']}
                fixedWidth />
            </a>

            <a
              className="button link icon"
              href="https://www.twitch.tv/fuelrats/"
              target="_blank"
              rel="noopener noreferrer"
              title="Fuel Rats on Twitch" >
              <FontAwesomeIcon
                style={renderIcons ? showIconStyle : hideIconStyle}
                icon={['fab', 'twitch']}
                fixedWidth />
            </a>

            <a
              className="button link icon"
              href="https://www.github.com/FuelRats/"
              target="_blank"
              rel="noopener noreferrer"
              title="Tech Rats on GitHub" >
              <FontAwesomeIcon
                style={renderIcons ? showIconStyle : hideIconStyle}
                icon={['fab', 'github']}
                fixedWidth />
            </a>

            <a
              className="button link icon"
              href="https://forums.frontier.co.uk/showthread.php/150703-Out-of-Fuel-Explorer-Rescue-Service-The-Fuel-Rats"
              target="_blank"
              rel="noopener noreferrer"
              title="Fuel Rats on Frontier Forums" >
              <FontAwesomeIcon
                style={renderIcons ? showIconStyle : hideIconStyle}
                icon="space-shuttle"
                transform={{ rotate: -45 }}
                fixedWidth />
            </a>
          </div>

          <div className="join-actions">
            {!loggedIn && !loggingIn && (
              <Link href="/register">
                <a className="button secondary">
                  Become a Rat
                </a>
              </Link>
            )}

            <Link href="/i-need-fuel">
              <a className="button">
                Get Help
              </a>
            </Link>
          </div>
        </header>
      </div>
    )
  }
}





const mapStateToProps = state => {
  const { loggedIn, loggingIn } = state.authentication

  return {
    loggedIn,
    loggingIn,
  }
}





export default connect(mapStateToProps, null)(Header)
