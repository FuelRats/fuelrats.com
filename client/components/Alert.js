// Module imports
import React from 'react'
import ReactDOM from 'react-dom'





// Component constants
const canUseDOM = Boolean(typeof window !== 'undefined' && window.document && window.document.createElement)





class Alert extends React.Component {
  constructor (props) {
    super(props)

    this.canUseDOM = canUseDOM

    if (this.canUseDOM) {
      this.el = document.querySelector('#alert-container')
    }
  }

  render () {
    const {
      children,
      open,
    } = this.props

    if (this.canUseDOM && open) {
      return ReactDOM.createPortal(children, this.el)
    }

    return null
  }
}





export default Alert
