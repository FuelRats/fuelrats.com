// Module Imports
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'





// Component Imports
import Button from './Button'
import Component from './Component'





/**
 * Component for presenting dialogs and modals to the user.
 */

class Dialog extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  static _renderControls (controls) {
    /* eslint-disable react/no-array-index-key */
    return controls.map((control, index) => React.cloneElement(control, { key: index }))
    /* eslint-enable */
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      children,
      className,
      controls,
      modal,
      onClose,
      title,
    } = this.props

    return ReactDOM.createPortal(
      (
        <div
          className={`${modal ? 'modal' : ''} ${className || ''}`}
          data-t="dialog:dialog"
          role="dialog">
          <header data-t="dialog:header">
            <h2>{title}</h2>

            <Button
              action="close"
              category="Dialog"
              className="danger"
              data-t="dialog:close"
              name="close"
              onClick={onClose}
              label="">
              <FontAwesomeIcon icon="times" fixedWidth />
            </Button>
          </header>

          <div
            className="content"
            data-t="dialog:content">
            {children}
          </div>

          {Boolean(controls) && (
            <footer data-t="dialog:footer">
              <menu
                className="compact"
                type="toolbar">
                {Boolean(controls.primary) && (
                  <div
                    className="primary"
                    data-t="dialog:primary-controls">
                    {Dialog._renderControls(controls.primary)}
                  </div>
                )}

                {Boolean(controls.secondary) && (
                  <div
                    className="secondary"
                    data-t="dialog:secondary-controls">
                    {Dialog._renderControls(controls.secondary)}
                  </div>
                )}
              </menu>
            </footer>
          )}
        </div>
      ),
      document.getElementById('dialog-container')
    )
  }
}





Dialog.defaultProps = {
  modal: true,
}

Dialog.propTypes = {
  modal: PropTypes.bool,
}





export default Dialog
