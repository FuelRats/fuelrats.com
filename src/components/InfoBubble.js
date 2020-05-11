import React from 'react'





function InfoBubble (props) {
  const {
    className,
    header = 'information',
    children,
    ...divProps
  } = props

  return (
    <div {...divProps} className={['info-bubble', className]}>
      <span className="info-bubble-header">{header}</span>
      <span className="info-bubble-body">{children}</span>
    </div>
  )
}





export default InfoBubble
