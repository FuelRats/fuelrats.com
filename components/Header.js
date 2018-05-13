// Module imports
import React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'




// Component imports
import Nav from './Nav'
import { Link } from '../routes'
import Component from './Component'


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
    } = this.props

    return (
      <div id="header-container">
        <input id="nav-control" type="checkbox" />

        <label title="Expand/Collapse Menu" htmlFor="nav-control" className="burger button secondary" id="burger">
          <FontAwesomeIcon icon="bars" />
        </label>

        <header role="banner">
          <Link href="/">
            <a className="brand" title="Home">
              <img alt="Fuel Rats logo" src="/static/images/logo2.png" />
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
          </ul>

          <div className="social-actions" />

          <div className="join-actions">
            {!loggedIn && (
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
  const { loggedIn } = state.authentication

  return {
    loggedIn,
  }
}





export default connect(mapStateToProps, null)(Header)
