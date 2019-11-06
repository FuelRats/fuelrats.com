// Module imports
import React from 'react'





// Component imports
import classNames from '../../helpers/classNames'





const ModalFooter = (props) => {
  const {
    className,
    children,
  } = props

  const classes = classNames(
    'modal-footer',
    [className, className],
  )

  return (
    <footer className={classes}>
      <menu type="toolbar">
        {children}
      </menu>
    </footer>
  )
}





export default ModalFooter
