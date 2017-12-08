// Module imports
import React from 'react'
import ReactDOM from 'react-dom'





// Component imports
import Component from './Component'





// Component constants
const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement)

// The dialog polyfill is imported from CDNJS via a `<script />` tage in `<Head />`
const dialogPolyfill = !(typeof window === 'undefined') ? window.dialogPolyfill : null





export default class extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _onVisibilityChange (isOpen) {
    const { onVisibilityChange } = this.props

    if (onVisibilityChange) {
      onVisibilityChange(isOpen)
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  close () {
    this._el.close()

    this._onVisibilityChange(false)
  }

  componentDidMount () {
    if (this._el) {
      dialogPolyfill.registerDialog(this._el)

      if (this.props.open) {
        this.show()
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    const {
      open,
    } = nextProps

    if (open !== this.props.open) {
      if (open) {
        this.show()
      } else {
        this.close()
      }
    }
  }

  constructor (props) {
    super(props)

    this.canUseDOM = canUseDOM

    this._bindMethods(['show'])

    if (this.canUseDOM) {
      this.el = document.querySelector('#dialog-container')
    }
  }

  render () {
    const { children } = this.props

    if (this.canUseDOM) {
      return ReactDOM.createPortal(
        (
          <dialog
            className="loading fade-in"
            ref={_el => this._el = _el}>
            {children}
          </dialog>
        ), this.el
      )
    }

    return null
  }

  show () {
    if (this.props.modal) {
      this._el.showModal()
    } else {
      this._el.show()
    }

    this._onVisibilityChange(true)
  }
}
