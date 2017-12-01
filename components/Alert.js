// Module imports
import React from 'react'
import ReactDOM from 'react-dom'





// Component constants
const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement)





export default class extends React.Component {
  constructor (props) {
    super(props)

    if (canUseDOM) {
      this.el = document.querySelector('#alert-container')
    }
  }

  render () {
    if (canUseDOM) {
      return ReactDOM.createPortal(this.props.children, this.el)
    }

    return null
  }
}
