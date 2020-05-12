// Module imports
import React from 'react'





function ModalFooter (props) {
  const {
    className,
    children,
  } = props

  return (
    <footer className={['modal-footer', className]}>
      <menu type="toolbar">
        {children}
      </menu>
    </footer>
  )
}





export default ModalFooter
