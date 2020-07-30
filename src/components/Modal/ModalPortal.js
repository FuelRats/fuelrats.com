// Module imports
import React from 'react'
import { createPortal } from 'react-dom'





// Component constants
class ModalPortal extends React.Component {
  modalRoot = null

  componentWillUnmount () {
    if (this.modalRoot) {
      this.container.removeChild(this.modalRoot)
    }
    this.modalRoot = null
  }

  componentDidUpdate () {
    if (this.modalRoot) {
      if (this.props.isOpen) {
        this.modalRoot.classList.add('open')
      } else {
        this.modalRoot.classList.remove('open')
      }
    }
  }

  render () {
    const { container } = this
    if (!container) {
      return null
    }

    if (!this.modalRoot) {
      this.modalRoot = document.createElement('div')
      container.appendChild(this.modalRoot)
    }

    return createPortal(this.props.children, this.modalRoot)
  }

  get container () {
    if (typeof document !== 'undefined') {
      return document.getElementById('ModalContainer')
    }

    return undefined
  }
}



export default ModalPortal
