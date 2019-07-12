// Module Imports
import React, { useEffect, useCallback } from 'react'
import { animated } from 'react-spring'
import PropTypes from 'prop-types'





// Component Imports
import classNames from '../helpers/classNames'
import ModalHeader from './Modal/ModalHeader'
import ModalPortal from './Modal/ModalPortal'
import useModalTransition from './Modal/ModalTransition'





const Modal = (props) => {
  const {
    as,
    children,
    className,
    hideClose,
    isOpen,
    onClose,
    onSafeUnmount,
    title,
    transitionProps,
  } = props


  const handleGlobalKeyDown = useCallback((event) => {
    if (event.code === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen && !hideClose && typeof window !== undefined) {
      window.addEventListener('keydown', handleGlobalKeyDown)
    }

    return () => {
      if (typeof window !== undefined) {
        window.removeEventListener('keydown', handleGlobalKeyDown)
      }
    }
  }, [handleGlobalKeyDown, hideClose, isOpen])

  const modalTransition = useModalTransition(isOpen, isOpen, {
    onDestroyed: onSafeUnmount,
    ...transitionProps,
  })

  const RootElement = animated[as]

  const rootClasses = classNames(
    'modal',
    [className, className]
  )

  return (
    <ModalPortal isOpen={isOpen}>
      {modalTransition.map(({ item, key, props: style }) => item && (
        <RootElement
          className={rootClasses}
          key={key}
          role="dialog"
          style={{
            transform: style.pos.to((value) => (value ? `translate3d(0,${value}vh,0)` : undefined)),
          }}>

          <ModalHeader
            hideClose={hideClose}
            onClose={onClose}
            title={title} />

          {children}
        </RootElement>
      ))}
    </ModalPortal>
  )
}





Modal.defaultProps = {
  as: 'div',
  hideClose: false,
  isOpen: false,
  onClose: () => undefined,
  onSafeUnmount: () => undefined,
  title: null,
  transitionProps: undefined,
}

Modal.propTypes = {
  as: PropTypes.oneOf(Object.keys(animated)),
  hideClose: PropTypes.any,
  isOpen: PropTypes.any,
  onClose: PropTypes.func,
  onSafeUnmount: PropTypes.func,
  title: PropTypes.string,
  transitionProps: PropTypes.object,
}





const asModal = (opts) => (Component) => (props) => (
  <Modal {...props} {...opts}>
    <Component {...props} />
  </Modal>
)





export default asModal
export { default as ModalContent } from './Modal/ModalContent'
export { default as ModalFooter } from './Modal/ModalFooter'
export {
  Modal,
}
