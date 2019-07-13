// Module imports
import { useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'





// Component constants
const modalRoot = typeof document === 'undefined'
  ? null
  : document.getElementById('ModalContainer')





const ModalPortal = ({ children, isOpen }) => {
  const portalRoot = useMemo(() => modalRoot && document.createElement('div'), [])

  useEffect(() => {
    if (portalRoot) {
      modalRoot.appendChild(portalRoot)
    }

    return () => {
      if (portalRoot) {
        modalRoot.removeChild(portalRoot)
      }
    }
  }, [portalRoot])

  useEffect(() => {
    if (portalRoot) {
      if (isOpen) {
        portalRoot.classList.add('open')
      } else {
        portalRoot.classList.remove('open')
      }
    }
  }, [isOpen, portalRoot])

  return portalRoot && createPortal(children, portalRoot)
}





export default ModalPortal
