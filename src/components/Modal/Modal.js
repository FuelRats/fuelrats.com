import { AnimatePresence, motion } from 'framer-motion'
import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { useCallback, useMemo, useContext } from 'react'

import useEventListener from '~/hooks/useEventListener'
import useMergeReducer from '~/hooks/useMergeReducer'

import ModalHeader from './ModalHeader'
import ModalPortal from './ModalPortal'




// Component constants

/* eslint-disable id-length */
const modalTransitionConfig = {
  initial: { y: '-100vh' },
  animate: { y: 0 },
  exit: { y: '-100vh' },
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
    restDelta: 0.5,
    restSpeed: 10,
  },
}
/* eslint-enable id-length */

const ModalContext = React.createContext({})





function ModalComponent (props) {
  const {
    as = 'div',
    children,
    className,
    onClose,
    initialState = {},
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

  const RootElement = motion[as]

  return (
    <ModalContext.Provider value={sharedContext}>
      <RootElement
        {...modalTransitionConfig}
        className={['modal', className]}
        role="dialog">

        <ModalHeader
          hideClose={hideClose}
          title={title}
          onClose={onClose} />

        {children}
      </RootElement>
    </ModalContext.Provider>
  )
}

const asModal = (options) => {
  return (Component) => {
    function ModalWrapper ({ children, ...props }) {
      const modalProps = { ...props, ...options }
      return (
        <ModalPortal isOpen={props.isOpen}>
          <AnimatePresence>
            {
              props.isOpen && (
                <ModalComponent {...modalProps}>
                  <Component {...props}>{children}</Component>
                </ModalComponent>
              )
            }
          </AnimatePresence>
        </ModalPortal>
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
