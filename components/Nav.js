// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

// Component imports
import { actions } from '../store'
import { Link } from '../routes'
import Component from './Component'

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
        route: 'blog list category',
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
        key: 'stats-statistics',
        title: 'General',
        route: '/statistics',
      },
      {
        key: 'stats-leaderboard',
        title: 'Leaderboard',
        route: '/leaderboard',
      },
    ],
  },
  {
    key: 'support-us',
    title: 'Support Us',
    subnav: [
      {
        key: 'donate',
        title: 'Donations',
        href: 'https://donate.fuelrats.com/donate.php',
      },
      {
        key: 'merch',
        title: 'Merch (Coming Soon)',
        href: '#',
        /* href: 'https://donate.fuelrats.com/' */
        disabled: true,
      },
    ],
  },
]


class Nav extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleSubnavChange ({ target }) {
    const { id } = target
    const {
      setFlag,
      openSubNav,
    } = this.props

    const newChecked = openSubNav === id ? '' : id

    setFlag('openSubNav', newChecked)
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor(props) {
    super(props)

    this._bindMethods(['renderNavItem', '_handleSubnavChange'])
  }

  render () {
    return (
      <nav>
        <ul>{navItems.map(this.renderNavItem)}</ul>
      </nav>
    )
  }

  renderNavItem (item) {
    const {
      openSubNav,
    } = this.props

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
    let renderedSubnav
    let renderedSubnavToggle

    const key = item.key || renderedItemTitle.toLowerCase().replace(/\s/g, '-')

    for (const [itemKey, itemValue] of Object.entries(item)) {
      if (allowedLinkKeys.includes(itemKey)) {
        itemWithOnlyLinkProps[itemKey] = itemValue
      }
    }

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
          className="subnav-toggle"
          hidden
          id={key}
          checked={openSubNav === key}
          onChange={this._handleSubnavChange}
          name="subnav"
          type="checkbox" />
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
}





const mapStateToProps = state => ({
  openSubNav: state.flags.openSubNav,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setFlag: actions.setFlag,
}, dispatch)





export default connect(mapStateToProps, mapDispatchToProps)(Nav)
