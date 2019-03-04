// Module Imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'





// Component Imports
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
      onClose,
      showClose,
      title,
    } = this.props

    return ReactDOM.createPortal(
      (
        <div
          className={className || ''}
          role="dialog">
          <header>
            <h3>{title}</h3>

            {showClose && (
              <button
                className="danger"
                name="close"
                type="button"
                onClick={onClose}>
                <FontAwesomeIcon icon="times" fixedWidth />
              </button>
            )}
          </header>

          <div
            className="content">
            {children}
          </div>

          {Boolean(controls) && (
            <footer>
              <menu
                className="compact"
                type="toolbar">
                {Boolean(controls.primary) && (
                  <div
                    className="primary">
                    {Dialog._renderControls(controls.primary)}
                  </div>
                )}

                {Boolean(controls.secondary) && (
                  <div
                    className="secondary">
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
  controls: null,
  onClose: () => undefined,
  showClose: true,
  title: 'Dialog',
}

Dialog.propTypes = {
  controls: PropTypes.shape({
    primary: PropTypes.arrayOf(PropTypes.element),
    secondary: PropTypes.arrayOf(PropTypes.element),
  }),
  onClose: PropTypes.func,
  showClose: PropTypes.bool,
  title: PropTypes.string,
}





export default Dialog
