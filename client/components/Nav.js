// Module imports
import React from 'react'





// Component imports
import { Link } from '../routes'
import { connect } from '../store'
import { selectSession } from '../store/selectors'





// Constants
const allowedLinkKeys = ['href', 'params', 'route']
const navItems = [
  {
    key: 'blog',
    title: 'Blog',
    subnav: [
      {
        key: 'blog-all',
        title: 'All',
        route: 'blog list',
      },
      {
        key: 'blog-art',
        title: 'Stories, Art, & Toons',
        route: 'blog list',
        params: {
          category: '138',
        },
      },
    ],
  },
  {
    key: 'stats',
    title: 'Rat Stats',
    subnav: [
      {
        external: true,
        key: 'stats-statistics',
        title: 'General',
        href: 'https://grafana.fuelrats.com/d/H-iTUTPmz/public-statistics?refresh=1h&orgId=2',
      },
      {
        key: 'stats-leaderboard',
        title: 'Leaderboard',
        route: 'stats leaderboard',
      },
    ],
  },
  {
    key: 'support-us',
    title: 'Support Us',
    subnav: [
      // {
      //   key: 'merch',
      //   title: 'Merch Store',
      //   route: 'store list',
      // },
      {
        external: true,
        key: 'donate',
        title: 'Donations',
        href: 'https://donate.fuelrats.com/donate.php',
      },
    ],
  },
  {
    key: 'rat-links',
    title: 'Rat Links',
    condition: (props) => props.loggedIn,
    subnav: [
      {
        external: true,
        key: 'confluence',
        title: 'Knowledge Base',
        href: 'https://confluence.fuelrats.com/display/FRKB/Fuel+Rats+Knowledge+Base',
      },
      {
        external: true,
        key: 'support-desk',
        title: 'Support Desk',
        href: 'https://t.fuelr.at/help',
      },
    ],
  },
]

@connect
class Nav extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    openSubNav: '',
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleSubnavChange = ({ target: { id } }) => this.setState((prevState) => ({ openSubNav: prevState.openSubNav === id ? '' : id }))





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <nav>
        <ul>{navItems.map(this.renderNavItem)}</ul>
      </nav>
    )
  }

  renderNavItem = (item) => {
    const {
      openSubNav,
    } = this.state

    const {
      condition,
      subnav,
      title,
    } = item

    if (condition && !condition(this.props)) {
      return null
    }

    const itemWithOnlyLinkProps = {}
    let renderedItemTitle = typeof title === 'string' ? title : title(this.props)
    let renderedSubnav = null
    let renderedSubnavToggle = null

    const key = item.key || renderedItemTitle.toLowerCase().replace(/\s/gu, '-')

    Object.entries(item).forEach(([itemKey, itemValue]) => {
      if (allowedLinkKeys.includes(itemKey)) {
        itemWithOnlyLinkProps[itemKey] = itemValue
      }
    })

    if (subnav) {
      renderedItemTitle = (
        <label htmlFor={key}>
          <span>
            {renderedItemTitle}
          </span>
        </label>
      )

      renderedSubnav = (
        <ul className="subnav">
          {subnav.map(this.renderNavItem)}
        </ul>
      )

      renderedSubnavToggle = (
        <input
          aria-hidden
          className="subnav-toggle"
          hidden
          id={key}
          checked={openSubNav === key}
          onChange={this._handleSubnavChange}
          name="subnav"
          type="checkbox" />
      )
    } else if (item.external) {
      renderedItemTitle = (
        <a href={item.href} className={item.disabled ? 'disabled' : ''}><span>{renderedItemTitle}</span></a>
      )
    } else {
      renderedItemTitle = (
        <Link
          {...itemWithOnlyLinkProps}>
          <a className={item.disabled ? 'disabled' : ''}><span>{renderedItemTitle}</span></a>
        </Link>
      )
    }

    return (
      <li key={title}>
        {renderedSubnavToggle}

        {renderedItemTitle}

        {renderedSubnav}
      </li>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['setFlag']

  static mapStateToProps = (state) => selectSession(state)
}





export default Nav
