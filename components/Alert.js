// Module imports
import React from 'react'
import ReactDOM from 'react-dom'





// Component imports
import Component from './Component'





// Component constants
const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement)





export default class extends Component {
  constructor (props) {
    super(props)

    this.canUseDOM = canUseDOM

    if (this.canUseDOM) {
      this.el = document.querySelector('#alert-container')
    }
  }

  render () {
    let {
      children,
      open,
    } = this.props

    if (this.canUseDOM && open) {
      return ReactDOM.createPortal(children, this.el)
    }

    return null
  }
}
