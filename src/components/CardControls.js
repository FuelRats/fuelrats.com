import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'





function CardControls (props) {
  const {
    canDelete = true,
    canSubmit,
    deleteConfirmMessage,
    deleteMode = false,
    editMode = false,
    controlType,
    onCancelClick,
    onDeleteClick,
    onEditClick,
    onSubmitClick,
  } = props

  let editModeSubmitTitle = "There's nothing to save!"
  let editModeCancelTitle = 'Cancel changes'

  if (editMode && canSubmit) {
    editModeSubmitTitle = 'Save changes'
  }

  if (deleteMode) {
    editModeSubmitTitle = `Yes, delete ${controlType}`
    editModeCancelTitle = `No, don't delete ${controlType}`
  }

  return (
    <div
      className={clsx('card-controls', { 'has-message': deleteMode })}>

      {
        deleteMode && (
          deleteConfirmMessage?.() ?? (
            <small>{'Are you sure? '}</small>
          )
        )
      }

      {
        !(editMode || deleteMode) && (
          <>
            <button
              aria-label={`Edit ${controlType}`}
              className={clsx('icon', { green: editMode || deleteMode })}
              name="edit"
              title={`Edit ${controlType}`}
              type="button"
              onClick={onEditClick}>
              <FontAwesomeIcon fixedWidth icon="pen" />
            </button>
            <button
              aria-label={canDelete ? `Delete ${controlType}` : `You cannot delete this ${controlType}.`}
              className="icon"
              disabled={!canDelete}
              name="delete"
              title={canDelete ? `Delete ${controlType}` : `You cannot delete this ${controlType}.`}
              type="button"
              onClick={onDeleteClick}>
              <FontAwesomeIcon fixedWidth icon="trash" />
            </button>
          </>
        )
      }

      {
        (editMode || deleteMode) && (
          <>
            <button
              aria-label={editModeSubmitTitle}
              className="icon green"
              disabled={editMode ? !canSubmit : false}
              name="confirm"
              title={editModeSubmitTitle}
              type="button"
              onClick={onSubmitClick}>
              <FontAwesomeIcon fixedWidth icon="check" />
            </button>
            <button
              aria-label={editModeCancelTitle}
              className="icon"
              name="cancel"
              title={editModeCancelTitle}
              type="button"
              onClick={onCancelClick}>
              <FontAwesomeIcon fixedWidth icon="xmark" />
            </button>
          </>
        )
      }
    </div>
  )
}



export default CardControls
