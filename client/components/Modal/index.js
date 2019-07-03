// Module Imports
import React from 'react'
import { animated } from 'react-spring'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'




// Component Imports
import ModalPortal from './ModalPortal'
import ModalTransition from './ModalTransition'




/**
 * Component for presenting Modals to the user.
 */
class Modal extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  renderHeader () {
    const {
      hideClose,
      onClose,
      title,
    } = this.props

    return (title || !hideClose) && (
      <header>
        {title && (<h3>{title}</h3>)}

        {!hideClose && (
          <button
            className="danger"
            name="close"
            type="button"
            onClick={onClose}>
            <FontAwesomeIcon icon="times" fixedWidth />
          </button>
        )}
      </header>
    )
  }

  render () {
    const {
      children,
      className,
      isOpen,
      transitionProps,
    } = this.props

    return (
      <ModalPortal>
        <ModalTransition
          {...transitionProps}
          isOpen={isOpen}>
          {({ item, key, props }) => item && (
            <animated.div
              className={className}
              key={key}
              role="dialog"
              style={props}>

              {this.renderHeader()}

              {children}
            </animated.div>
          )}
        </ModalTransition>
      </ModalPortal>
    )
  }





  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static defaultProps = {
    hideClose: false,
    isOpen: false,
    onClose: () => undefined,
    title: null,
    transitionProps: undefined,
  }

  static propTypes = {
    hideClose: PropTypes.any,
    isOpen: PropTypes.any,
    onClose: PropTypes.func,
    title: PropTypes.string,
    transitionProps: PropTypes.object,
  }
}





const asModal = (opts) => (Component) => (props) => (
  <Modal {...props} {...opts}>
    <Component {...props} />
  </Modal>
)





export default Modal
export {
  asModal,
}
