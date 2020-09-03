import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { CopyToClipboard as CopyComponent } from 'react-copy-to-clipboard'

import styles from './CopyToClipboard.module.scss'




// Component Constants
const CLICKED_STATE_RESET_TIME = 1500 // 1.5 seconds




function CopyToClipboard (props) {
  const {
    as: Component = 'span',
    doHint,
    className,
    children,
    text,
  } = props
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef()


  const handleCopy = useCallback(() => {
    if (copied) {
      clearTimeout(timeoutRef.current)
    } else {
      setCopied(true)
    }
    timeoutRef.current = setTimeout(() => {
      setCopied(false)
      timeoutRef.current = undefined
    }, CLICKED_STATE_RESET_TIME)
  }, [copied])

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])


  return (
    <CopyComponent text={text} onCopy={handleCopy}>
      <Component aria-label={`Click to copy: ${text}`} className={[styles.copyToClipboard, className, { [styles.copied]: copied }]} role="button">
        {children}
        {
          doHint && (
            <span className={styles.icon}>
              <FontAwesomeIcon icon={copied ? 'clipboard-check' : 'clipboard-list'} size="lg" />
            </span>
          )
        }
      </Component>
    </CopyComponent>
  )
}

CopyToClipboard.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node,
  className: PropTypes.string,
  doHint: PropTypes.bool,
  text: PropTypes.string,
}





export default CopyToClipboard
