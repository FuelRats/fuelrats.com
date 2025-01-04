import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectCurrentUserHasScope, selectSession } from '~/store/selectors'
import makeBlogRoute from '~/util/router/makeBlogRoute'

import Brand from '../../../public/static/svg/brand.svg'
import { Nav, NavUl, NavLink, SubNav } from '../Nav'
import SocialIcon from './SocialIcon'





// Component constants





function Header () {
  const { loggedIn } = useSelector(selectSession)
  const userCanDispatch = useSelectorWithProps({ scope: 'dispatch.read' }, selectCurrentUserHasScope)
  /* Temporarily use 'epics.write' instead of 'epics.write.me' to disable epic nomination for normal users, we're not ready for this yet. */
  const userCanCreateEpic = useSelectorWithProps({ scope: 'epics.write' }, selectCurrentUserHasScope)

  const checkboxRef = useRef()

  const handleClick = useCallback(() => {
    checkboxRef.current.checked = false
  }, [])

  return (
    <div id="HeaderContainer">
      <input
        ref={checkboxRef}
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

        <Nav onClick={handleClick}>
          <SubNav id="about" title="About Us">
            <NavLink href="/vision">
              {'Surly\'s Vision'}
            </NavLink>
            <NavLink href="/history">
              {'History'}
            </NavLink>
          </SubNav>
          <SubNav id="blog" title="Blog">
            <NavLink href="/blog">
              {'All'}
            </NavLink>

            <NavLink href={makeBlogRoute({ category: 138 })}>
              {'Stories, Art, & Toons'}
            </NavLink>
          </SubNav>
          <SubNav id="states" title="Rat Stats">
            <NavLink external href="https://grafana.fuelrats.com/d/H-iTUTPmz/public-statistics?refresh=1h&orgname=2">
              {'General'}
            </NavLink>

            <NavLink href="/leaderboard">
              {'Leaderboard'}
            </NavLink>
          </SubNav>
          <SubNav id="support" title="Support Us">
            <NavLink external href="https://shop.fuelrats.com">
              {'Merch Store'}
            </NavLink>

            <NavLink href="/donate">
              {'Donations'}
            </NavLink>
          </SubNav>

          {
            loggedIn && (
              <SubNav id="ratlinks" title="Rat Links">
                {
                  userCanDispatch && (
                    <NavLink href="/dispatch">
                      {'Dispatch Board'}
                    </NavLink>
                  )
                }
                {
                  userCanCreateEpic && (
                    <NavLink href="/epic/nominate">
                      {'Epic Nomination'}
                    </NavLink>
                  )
                }
                <NavLink external href="https://confluence.fuelrats.com/display/FRKB/Fuel+Rats+Knowledge+Base">
                  {'Knowledge Base'}
                </NavLink>
                <NavLink external href="https://t.fuelr.at/help">
                  {'Support Desk'}
                </NavLink>
              </SubNav>
            )
          }
        </Nav>

        <NavUl className="about-actions fa-ul" onClick={handleClick}>
          <NavLink className="button link" href="/terms-of-service">
            <FontAwesomeIcon fixedWidth icon="book" />
            {'Terms of Service'}
          </NavLink>
          <NavLink className="button link" href="/privacy-policy">
            <FontAwesomeIcon fixedWidth icon="user-secret" />
            {'Privacy Policy'}
          </NavLink>

          <NavLink className="button link" href="/acknowledgements">
            <FontAwesomeIcon fixedWidth icon="hands-helping" />
            {'Acknowledgements'}
          </NavLink>

          {
            (!$$BUILD.isProduction) && (
              <NavLink className="button link" href="/version">
                <FontAwesomeIcon fixedWidth icon="code-branch" />
                {$$BUILD.commitShort}
              </NavLink>
            )
          }
        </NavUl>

        <div className="social-actions">
          <SocialIcon
            href="https://mastodon.localecho.net/@FuelRats"
            icon={['fab', 'mastodon']}
            title="Fuel Rats on Mastadon" />
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
            href="https://forums.frontier.co.uk/threads/out-of-fuel-explorer-rescue-service-the-fuel-rats.150703/"
            icon="space-shuttle"
            title="Fuel Rats on Frontier Forums"
            transform={{ rotate: -45 }} />
        </div>

        <NavUl className="join-actions" onClick={handleClick}>
          <NavLink className="button get-fuel" href="/i-need-fuel">
            {'Get Fuel'}
          </NavLink>
          {
            !loggedIn && (
              <NavLink className="button secondary" href="/register">
                {'Become a Rat'}
              </NavLink>
            )
          }
        </NavUl>
      </header>
    </div>
  )
}





export default Header
