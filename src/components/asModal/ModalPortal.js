import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'




function ModalPortal ({ isOpen, children }) {
  const modalRootRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const container = document.getElementById('ModalContainer')
    if (!container) {
      return undefined
    }

    const modalRoot = document.createElement('div')
    container.appendChild(modalRoot)
    modalRootRef.current = modalRoot
    setMounted(true)

    return () => {
      container.removeChild(modalRoot)
      modalRootRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!modalRootRef.current) {
      return
    }
    if (isOpen) {
      modalRootRef.current.classList.add('open')
    } else {
      modalRootRef.current.classList.remove('open')
    }
  }, [isOpen, mounted])

  if (!mounted || !modalRootRef.current) {
    return null
  }

  return createPortal(children, modalRootRef.current)
}




export default ModalPortal
