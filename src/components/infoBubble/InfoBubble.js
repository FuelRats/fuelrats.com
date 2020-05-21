import React from 'react'
import styles from './InfoBubble.module.scss'




function InfoBubble (props) {
  const {
    className,
    header = 'information',
    children,
    ...divProps
  } = props

  return (
    <div {...divProps} className={[styles.infoBubble, styles.nicknamesInfo, className]}>
      <span className={styles.infoBubbleHeader}>{header}</span>
      <span className={styles.infoBubbleBody}>{children}</span>
    </div>
  )
}





export default InfoBubble
