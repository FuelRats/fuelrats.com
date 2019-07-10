import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





const ModalHeader = ({ hideClose, onClose, title }) => (title || !hideClose) && (
  <header>
    {title && (<h3>{title}</h3>)}

    {!hideClose && (
      <button
        className="danger"
        name="close"
        type="button"
        onClick={onClose}>
        <FontAwesomeIcon icon="times" fixedWidth />
      </button>
    )}
  </header>
)





export default ModalHeader
