// Module Imports
import { useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'





// Component Constants
const modalRoot = typeof document === 'undefined'
  ? null
  : document.getElementById('ModalContainer')





const ModalPortal = ({ children }) => {
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

  return portalRoot && createPortal(children, portalRoot)
}





export default ModalPortal
