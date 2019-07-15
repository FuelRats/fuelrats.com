// Module imports
import React from 'react'





// Component imports
import classNames from '../../helpers/classNames'





const ModalContent = (props) => {
  const {
    as: Element,
    className,
    children,
    ...restProps
  } = props

  const classes = classNames(
    'modal-content',
    [className, className]
  )

  return (
    <Element
      className={classes}
      {...restProps}>

      {children}

    </Element>
  )
}





ModalContent.defaultProps = {
  as: 'div',
}





export default ModalContent
