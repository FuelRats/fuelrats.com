import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





function ModalHeader ({ hideClose, onClose, title }) {
  return (title || !hideClose) && (
    <header className="modal-header">
      {title && (<h3>{title}</h3>)}

      {
        !hideClose && (
          <button
            className="danger button-close"
            type="button"
            onClick={onClose}>
            <FontAwesomeIcon fixedWidth icon="times" />
          </button>
        )
      }
    </header>
  )
}





export default ModalHeader
