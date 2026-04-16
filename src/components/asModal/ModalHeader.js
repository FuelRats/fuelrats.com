import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





function ModalHeader ({ hideClose, onClose, title, titleId }) {
  return (title || !hideClose) && (
    <header className="modal-header">
      {title && (<h3 id={titleId}>{title}</h3>)}

      {
        !hideClose && (
          <button
            aria-label="Close dialog"
            className="danger button-close"
            title="Close"
            type="button"
            onClick={onClose}>
            <FontAwesomeIcon fixedWidth icon="xmark" />
          </button>
        )
      }
    </header>
  )
}





export default ModalHeader
