/* globals $IS_DEVELOPMENT:false, $IS_STAGING:false, $BUILD_COMMIT_SHORT:false */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useSelector } from 'react-redux'

import { makeBlogRoute } from '~/helpers/routeGen'
import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectCurrentUserHasScope, selectSession } from '~/store/selectors'

import Brand from '../../public/static/svg/brand.svg'
import Nav from './Nav/Nav'
import NavItem from './Nav/NavItem'
import SubNav from './Nav/SubNav'





// Component constants
const IS_DEV_OR_STAGING = $IS_DEVELOPMENT || $IS_STAGING
const BUILD_COMMIT_SHORT = $BUILD_COMMIT_SHORT


function SocialIcon (props) {
  const {
    href,
    title,
    ...restProps
  } = props

  return (
    <a
      className="button link"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title={title}>
      <FontAwesomeIcon
        fixedWidth
        {...restProps} />
    </a>
  )
}


function Header () {
  const { loggedIn } = useSelector(selectSession)
  const userCanDispatch = useSelectorWithProps({ scope: 'dispatch.read' }, selectCurrentUserHasScope)

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
        <Link href="/">
          <a className="brand" title="Home">
            <div className="brand-animation-wrapper">
              <Brand id="brandSvg" />
            </div>
          </a>
        </Link>

        <Nav>
          <SubNav id="blog" title="Blog">
            <NavItem href="/blog">
              {'All'}
            </NavItem>

            <NavItem href={makeBlogRoute({ category: 138 })}>
              {'Stories, Art, & Toons'}
            </NavItem>
          </SubNav>
          <SubNav id="states" title="Rat Stats">
            <NavItem external href="https://grafana.fuelrats.com/d/H-iTUTPmz/public-statistics?refresh=1h&orgname=2">
              {'General'}
            </NavItem>

            <NavItem href="/leaderboard">
              {'Leaderboard'}
            </NavItem>
          </SubNav>
          <SubNav id="support" title="Support Us">
            <NavItem href="/donate">
              {'Donations'}
            </NavItem>

            <NavItem disabled external>
              {'Merch (Coming soon!)'}
            </NavItem>
          </SubNav>

          {
            loggedIn && (
              <SubNav id="ratlinks" title="Rat Links">
                {
                  userCanDispatch && (
                    <NavItem href="/dispatch">
                      {'Dispatch Board'}
                    </NavItem>
                  )
                }
                <NavItem external href="https://confluence.fuelrats.com/display/FRKB/Fuel+Rats+Knowledge+Base">
                  {'Knowledge Base'}
                </NavItem>
                <NavItem external href="https://t.fuelr.at/help">
                  {'Support Desk'}
                </NavItem>
              </SubNav>
            )
          }
        </Nav>

        <ul className="about-actions fa-ul">
          <NavItem className="button link" href="/terms-of-service">
            <FontAwesomeIcon fixedWidth icon="book" />
            {'Terms of Service'}
          </NavItem>
          <NavItem className="button link" href="/privacy-policy">
            <FontAwesomeIcon fixedWidth icon="user-secret" />
            {'Privacy Policy'}
          </NavItem>

          <NavItem className="button link" href="/acknowledgements">
            <FontAwesomeIcon fixedWidth icon="hands-helping" />
            {'Acknowledgements'}
          </NavItem>

          {
            IS_DEV_OR_STAGING && (
              <NavItem className="button link" href="/version">
                <FontAwesomeIcon fixedWidth icon="code-branch" />
                {BUILD_COMMIT_SHORT}
              </NavItem>
            )
          }
        </ul>

        <div className="social-actions">
          <SocialIcon
            href="https://www.twitter.com/FuelRats/"
            icon={['fab', 'twitter']}
            title="Fuel Rats on Twitter" />
          <SocialIcon
            href="https://www.reddit.com/r/FuelRats/"
            icon={['fab', 'reddit-alien']}
            title="Fuel Rats on Reddit" />
          <SocialIcon
            href="https://www.twitch.tv/fuelrats/"
            icon={['fab', 'twitch']}
            title="Fuel Rats on Twitch" />
          <SocialIcon
            href="https://www.github.com/FuelRats/"
            icon={['fab', 'github']}
            title="Fuel Rats on GitHub" />
          <SocialIcon
            href="https://forums.frontier.co.uk/showthread.php/150703-Out-of-Fuel-Explorer-Rescue-Service-The-Fuel-Rats"
            icon="space-shuttle"
            title="Fuel Rats on Frontier Forums"
            transform={{ rotate: -45 }} />
        </div>

        <ul className="join-actions">
          <NavItem className="button get-fuel" href="/i-need-fuel">
            {'Get Fuel'}
          </NavItem>
          {
            !loggedIn && (
              <NavItem className="button secondary" href="/register">
                {'Become a Rat'}
              </NavItem>
            )
          }
        </ul>
      </header>
    </div>
  )
}





export default Header
