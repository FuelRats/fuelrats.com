// Module imports
import React, { useEffect, useCallback } from 'react'
import { animated, useTransition } from 'react-spring'
import hoistNonReactStatics from 'hoist-non-react-statics'





// Component imports
import classNames from '../helpers/classNames'
import ModalHeader from './Modal/ModalHeader'
import ModalPortal from './Modal/ModalPortal'





const renderModal = ({ item, key, props: style }) => {
  const {
    as,
    className,
    hideClose,
    isOpen,
    onClose,
    title,
  } = item

  const {
    Component: InnerModal,
    children: innerModalChildren,
    props: innerModalProps,
  } = item.children

  const RootElement = animated[as]

  const rootClasses = classNames(
    'modal',
    [className, className],
  )

  return isOpen && (
    <RootElement
      className={rootClasses}
      key={key}
      role="dialog"
      style={{ transform: style.pos.to((value) => (value ? `translate3d(0,${value}vh,0)` : undefined)) }}>

      <ModalHeader
        hideClose={hideClose}
        onClose={onClose}
        title={title} />

      <InnerModal {...innerModalProps}>
        {innerModalChildren}
      </InnerModal>
    </RootElement>
  )
}





const OuterModal = (props) => {
  const {
    hideClose,
    isOpen,
    onClose,
    onSafeUnmount,
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

  const modalTransition = useTransition(props, JSON.stringify(props), {
    from: { pos: -100 },
    enter: { pos: 0 },
    leave: { pos: -100 },
    onDestroyed: onSafeUnmount,
    unique: true,
    config: {
      tension: 350,
    },
  })

  return (
    <ModalPortal isOpen={isOpen}>
      {modalTransition.map(renderModal)}
    </ModalPortal>
  )
}

OuterModal.defaultProps = {
  as: 'div',
}





const asModal = (options) => (Component) => hoistNonReactStatics(({ children, ...props }) => (
  <OuterModal
    {...props}
    {...options}>
    {{ Component, children, props }}
  </OuterModal>
), Component)





export default asModal
export { default as ModalContent } from './Modal/ModalContent'
export { default as ModalFooter } from './Modal/ModalFooter'
