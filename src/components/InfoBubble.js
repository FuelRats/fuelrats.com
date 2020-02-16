import React from 'react'


import classNames from '../helpers/classNames'


function InfoBubble (props) {
  const {
    className,
    header = 'information',
    children,
    ...divProps
  } = props

  const classes = classNames(
    'info-bubble',
    className,
  )

  return (
    <div {...divProps} className={classes}>
      <span className="info-bubble-header">{header}</span>
      <span className="info-bubble-body">{children}</span>
    </div>
  )
}




export default InfoBubble
