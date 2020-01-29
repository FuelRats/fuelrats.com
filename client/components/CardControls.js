// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'





// Component imports
import classNames from '../helpers/classNames'





function CardControls (props) {
  const {
    canDelete = true,
    canSubmit,
    deleteConfirmMessage = () => null,
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

  const classes = classNames(
    'card-controls',
    ['has-message', deleteMode],
  )

  return (
    <div className={classes}>
      {deleteMode && (deleteConfirmMessage() || (<small>Are you sure? </small>))}

      {!(editMode || deleteMode) && (
        <>
          <button
            className={`icon ${editMode || deleteMode ? 'green' : ''}`}
            name="edit"
            onClick={onEditClick}
            title={`Edit ${controlType}`}
            type="button">
            <FontAwesomeIcon icon="pen" fixedWidth />
          </button>
          <button
            className="icon"
            disabled={!canDelete}
            name="delete"
            onClick={onDeleteClick}
            title={canDelete ? `Delete ${controlType}` : `You cannot delete this ${controlType}.`}
            type="button">
            <FontAwesomeIcon icon="trash" fixedWidth />
          </button>
        </>
      )}

      {(editMode || deleteMode) && (
        <>
          <button
            className="icon green"
            disabled={editMode ? !canSubmit : false}
            name="confirm"
            onClick={onSubmitClick}
            title={editModeSubmitTitle}
            type="button">
            <FontAwesomeIcon icon="check" fixedWidth />
          </button>
          <button
            className="icon"
            name="cancel"
            onClick={onCancelClick}
            title={editModeCancelTitle}
            type="button">
            <FontAwesomeIcon icon="times" fixedWidth />
          </button>
        </>
      )}
    </div>
  )
}



export default CardControls
