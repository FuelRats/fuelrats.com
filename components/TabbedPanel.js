// Module imports
import React from 'react'





// Component imports
import Component from './Component'





export default class extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _renderPane (activeTab) {
    let {
      tabs,
    } = this.props

    return (
      <div className="tab-pane">
        {tabs.find(tab => tab.title === activeTab).component}
      </div>
    )
  }

  _renderTab (tab, index) {
    let {
      activeTab,
    } = this.state
    let classes = ['tab']

    if (tab.title === activeTab) {
      classes.push('active')
    }

    return (
      <li
        className={classes.join(' ')}
        key={index}
        onClick={() => { this.setState({
          activeTab: tab.title
        })}}>
        {tab.title}
      </li>
    )
  }

  _renderTabs () {
    let {
      tabs,
    } = this.props

    return (
      <nav className="tabs">
        <ul>
          {tabs.map(this._renderTab)}
        </ul>
      </nav>
    )
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    this._bindMethods(['_renderTab'])

    this.state = {
      activeTab: props.tabs.find(tab => tab.default).title
    }
  }

  render () {
    let {
      name,
      tabs,
    } = this.props
    let {
      activeTab,
    } = this.state

    return (
      <div className="tabbed-panel">
        {this._renderTabs()}

        {this._renderPane(activeTab)}
      </div>
    )
  }
}
