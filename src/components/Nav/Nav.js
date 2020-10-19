// Module imports
import { useReducer } from 'react'
import { useSelector } from 'react-redux'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectCurrentUserHasScope, selectSession } from '~/store/selectors'

import ExternalNavItem from './ExternalNavItem'
import NavItem from './NavItem'
import SubNav from './SubNav'





const reduceSubNavClick = (state, { target: { id } }) => {
  return state.openSubNav === id ? '' : id
}

function Nav () {
  const [openSubNav, handleSubNavClick] = useReducer(reduceSubNavClick, '')

  const { loggedIn } = useSelector(selectSession)
  const userCanDispatch = useSelectorWithProps({ scope: 'dispatch.read' }, selectCurrentUserHasScope)

  return (
    <nav>
      <ul>
        <SubNav id="blog" openNav={openSubNav} title="Blog" onClick={handleSubNavClick}>
          <NavItem route="blog list">
            {'All'}
          </NavItem>

          <NavItem params={{ category: 138 }} route="blog list">
            {'Stories, Art, & Toons'}
          </NavItem>
        </SubNav>
        <SubNav id="stats" openNav={openSubNav} title="Rat Stats" onClick={handleSubNavClick}>
          <ExternalNavItem href="https://grafana.fuelrats.com/d/H-iTUTPmz/public-statistics?refresh=1h&orgId=2">
            {'General'}
          </ExternalNavItem>

          <NavItem route="stats leaderboard">
            {'Leaderboard'}
          </NavItem>
        </SubNav>
        <SubNav id="support" openNav={openSubNav} title="Support Us" onClick={handleSubNavClick}>
          <NavItem route="donate">
            {'Donations'}
          </NavItem>

          <ExternalNavItem className="disabled">
            {'Merch (Coming soon!)'}
          </ExternalNavItem>
        </SubNav>

        {
          loggedIn && (
            <SubNav id="ratlinks" openNav={openSubNav} title="Rat Links" onClick={handleSubNavClick}>
              {
                userCanDispatch && (
                  <NavItem route="dispatch">
                    {'Dispatch Board'}
                  </NavItem>
                )
              }
              <ExternalNavItem href="https://confluence.fuelrats.com/display/FRKB/Fuel+Rats+Knowledge+Base">
                {'Knowledge Base'}
              </ExternalNavItem>
              <ExternalNavItem href="https://t.fuelr.at/help">
                {'Support Desk'}
              </ExternalNavItem>
            </SubNav>
          )
        }

      </ul>
    </nav>
  )
}





export default Nav
