import { AnimatePresence, m } from 'motion/react'
import React, { useCallback, useContext, useId, useMemo, useRef } from 'react'

import useEventListener from '~/hooks/useEventListener'
import useFocusTrap from '~/hooks/useFocusTrap'
import useMergeReducer from '~/hooks/useMergeReducer'

import ModalHeader from './ModalHeader'
import ModalPortal from './ModalPortal'
import clsx from 'clsx'





// Component constants

/* eslint-disable id-length */
const modalMotionConfig = {
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
  const titleId = useId()
  const containerRef = useRef(null)

  useFocusTrap(containerRef, true)

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

  const RootElement = m[as]

  return (
    <ModalContext.Provider value={sharedContext}>
      <RootElement
        key="modal"
        ref={containerRef}
        {...modalMotionConfig}
        aria-labelledby={title ? titleId : undefined}
        aria-modal="true"
        className={clsx('modal', className)}
        role="dialog">

        <ModalHeader
          hideClose={hideClose}
          title={title}
          titleId={titleId}
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

    return ModalWrapper
  }
}

function useModalContext () {
  return useContext(ModalContext)
}

export default asModal
export {
  useModalContext,
}
