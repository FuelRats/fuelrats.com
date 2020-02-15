// Module imports
import { animated, useTransition } from '@react-spring/web'
import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { useEffect, useCallback } from 'react'





// Component imports
import classNames from '../../helpers/classNames'
import ModalHeader from './ModalHeader'
import ModalPortal from './ModalPortal'





const translate3dHeight = (value) => {
  return (value ? `translate3d(0,${value}vh,0)` : undefined)
}





function renderModal ({ item, key, props: style }) {
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
      key={key}
      className={rootClasses}
      role="dialog"
      style={{ transform: style.pos.to(translate3dHeight) }}>

      <ModalHeader
        hideClose={hideClose}
        title={title}
        onClose={onClose} />

      <InnerModal {...innerModalProps}>
        {innerModalChildren}
      </InnerModal>
    </RootElement>
  )
}





function OuterModal (props) {
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





const asModal = (options) => {
  return (Component) => {
    return hoistNonReactStatics(({ children, ...props }) => {
      return (
        <OuterModal
          {...props}
          {...options}>
          {{ Component, children, props }}
        </OuterModal>
      )
    }, Component)
  }
}





export default asModal
