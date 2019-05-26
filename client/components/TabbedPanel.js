// Module imports
import React from 'react'





// Component imports
import classNames from '../helpers/classNames'




class TabbedPanel extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleTabClick = (event) => {
    this.props.onTabClick(event.target.getAttribute('name'))
  }

  _renderPane = () => {
    const { tabs, activeTab } = this.props

    return (
      <div className="tab-pane">
        {tabs[activeTab].component}
      </div>
    )
  }

  _renderTab = ([key, tab]) => {
    const { activeTab } = this.props
    const classes = classNames(
      'tab',
      ['active', key === activeTab]
    )

    return (
      <li
        className={classes}
        key={key}
        name={key}
        onClick={this._handleTabClick}
        onKeyPress={this._handleTabClick}>
        {tab.title}
      </li>
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
