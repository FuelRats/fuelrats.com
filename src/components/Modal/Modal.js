// Module imports
import { animated, useTransition } from '@react-spring/web'
import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { useCallback, useMemo, useContext } from 'react'





// Component imports
import useEventListener from '~/hooks/useEventListener'
import useMergeReducer from '~/hooks/useMergeReducer'

import ModalHeader from './ModalHeader'
import ModalPortal from './ModalPortal'





const translate3dHeight = (value) => {
  return (value ? `translate3d(0,${value}vh,0)` : undefined)
}





function renderModal (style, item) {
  const {
    as = 'div',
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

  return isOpen && (
    <RootElement
      className={['modal', className]}
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
    onClose,
    isOpen,
    initialState = {},
  } = props

  const [state, setState] = useMergeReducer(initialState)
  const innerProps = {
    ...props,
    hideClose: state.hideClose ?? props.hideClose,
  }

  const handleGlobalKeyDown = useCallback((event) => {
    if (event.code === 'Escape') {
      onClose()
    }
  }, [onClose])
  useEventListener('keydown', handleGlobalKeyDown, { listen: isOpen && !innerProps.hideClose })


  const modalTransition = useTransition(innerProps, {
    key: JSON.stringify(props),
    from: { pos: -100 },
    enter: { pos: 0 },
    leave: { pos: -100 },
    unique: true,
    config: {
      tension: 350,
    },
  })

  const sharedContext = useMemo(() => {
    return [{
      hideClose: innerProps.hideClose,
      ...state,
      onClose,
    }, setState]
  }, [innerProps.hideClose, state, onClose, setState])

  return (
    <ModalPortal isOpen={isOpen}>
      <ModalContext.Provider value={sharedContext}>
        {modalTransition(renderModal)}
      </ModalContext.Provider>
    </ModalPortal>
  )
}





const ModalContext = React.createContext({})
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

function useModalContext () {
  return useContext(ModalContext)
}

function withModalContext (Component) {
  return hoistNonReactStatics(({ children, ...props }) => {
    const context = useContext(ModalContext)
    return (
      <Component {...props} modalContext={context}>
        {children}
      </Component>
    )
  }, Component)
}





export default asModal
export {
  useModalContext,
  withModalContext,
}
