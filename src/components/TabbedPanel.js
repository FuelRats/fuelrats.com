import React from 'react'





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

    return (
      <li
        key={key}
        className={['tab', { active: key === activeTab }]}
        name={key}
        onClick={this._handleTabClick}
        onKeyPress={this._handleTabClick}>
        <span className="tab-inner">
          {tab.title}
        </span>
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
