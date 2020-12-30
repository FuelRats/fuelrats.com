import React, { useEffect } from 'react'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectCurrentUserHasScope } from '~/store/selectors'



function TabHandle (props) {
  const {
    activeTab,
    name,
    tab,
    ...itemProps
  } = props

  const hasPermission = useSelectorWithProps({ scope: tab.permission }, selectCurrentUserHasScope)

  return hasPermission
    ? (
      <li
        {...itemProps}
        className={['tab', { active: name === activeTab }]}
        name={name}>
        <span className="tab-inner">
          {tab.title}
        </span>
      </li>
    )
    : null
}

function TabPanel (props) {
  const {
    onPermissionError,
    tab,
  } = props

  const hasPermission = useSelectorWithProps({ scope: tab.permission }, selectCurrentUserHasScope)

  useEffect(() => {
    if (!hasPermission) {
      onPermissionError(tab.permission)
    }
  }, [tab.permission, onPermissionError, hasPermission])


  return hasPermission
    ? (
      <div className="tab-pane">
        {tab.render()}
      </div>
    )
    : null
}

class TabbedPanel extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleTabClick = (event) => {
    this.props.onTabClick(event.target.getAttribute('name'))
  }

  _renderPane = () => {
    const {
      activeTab,
      onPermissionError,
      tabs,
    } = this.props

    return (
      <TabPanel tab={tabs[activeTab]} onPermissionError={onPermissionError} />
    )
  }

  _renderTab = ([key, tab]) => {
    const { activeTab } = this.props

    return (
      <TabHandle
        key={key}
        activeTab={activeTab}
        name={key}
        tab={tab}
        onClick={this._handleTabClick}
        onKeyPress={this._handleTabClick} />
    )
  }

  _renderTabs = () => {
    const { tabs } = this.props

    return (
      <nav className="tabs">
        <ul>
          {Object.entries(tabs).map(this._renderTab)}
        </ul>
      </nav>
    )
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <div className="tabbed-panel">
        {this._renderTabs()}

        {this._renderPane()}
      </div>
    )
  }
}



export default TabbedPanel
