import { animated, useTransition } from '@react-spring/web'
import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { useCallback, useMemo, useContext } from 'react'

import useEventListener from '~/hooks/useEventListener'
import useMergeReducer from '~/hooks/useMergeReducer'

import ModalHeader from './ModalHeader'
import ModalPortal from './ModalPortal'




// Component constants
const translate3dHeight = (value) => {
  return (value ? `translate3d(0,${value}vh,0)` : undefined)
}

const ModalContext = React.createContext({})





function ModalComponent (props) {
  const {
    as = 'div',
    className,
    onClose,
    initialState = {},
    style,
  } = props

  const [state, setState] = useMergeReducer(initialState)

  const hideClose = state.hideClose ?? props.hideClose
  const title = state.title ?? props.title

  const sharedContext = useMemo(() => {
    return [{
      ...state,
      onClose,
    }, setState]
  }, [state, onClose, setState])

  const handleGlobalKeyDown = useCallback((event) => {
    if (event.code === 'Escape') {
      onClose()
    }
  }, [onClose])
  useEventListener('keydown', handleGlobalKeyDown, { listen: !hideClose })

  const {
    Component,
    children: innerChildren,
    props: innerProps,
  } = props.children

  const RootElement = animated[as]

  return (
    <ModalContext.Provider value={sharedContext}>
      <RootElement
        className={['modal', className]}
        role="dialog"
        style={{ transform: style.pos.to(translate3dHeight) }}>

        <ModalHeader
          hideClose={hideClose}
          title={title}
          onClose={onClose} />

        <Component {...innerProps}>
          {innerChildren}
        </Component>
      </RootElement>
    </ModalContext.Provider>
  )
}

function renderModal (style, item) {
  const { children, ...props } = item
  return item.isOpen && (
    <ModalComponent {...props} style={style}>
      {children}
    </ModalComponent>
  )
}

function ModalTransitionContainer (props) {
  const { isOpen } = props

  const modalTransition = useTransition(props, {
    key: JSON.stringify(props),
    from: { pos: -100 },
    enter: { pos: 0 },
    leave: { pos: -100 },
    unique: true,
    config: {
      tension: 350,
    },
  })

  return (
    <ModalPortal isOpen={isOpen}>
      {modalTransition(renderModal)}
    </ModalPortal>
  )
}

const asModal = (options) => {
  return (Component) => {
    function ModalWrapper ({ children, ...props }) {
      return (
        <ModalTransitionContainer
          {...props}
          {...options}>
          {{ Component, children, props }}
        </ModalTransitionContainer>
      )
    }
    ModalWrapper.displayName = `asModal(${Component.displayName ?? Component.name ?? 'Component'})`

    return hoistNonReactStatics(ModalWrapper, Component)
  }
}

function useModalContext () {
  return useContext(ModalContext)
}

export default asModal
export {
  useModalContext,
}
