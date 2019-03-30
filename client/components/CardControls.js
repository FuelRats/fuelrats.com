// Module imports
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const getFirstButtonTitle = (controlType, editMode, canSubmit) => {
  if (editMode) {
    return canSubmit ? 'Save changes' : "There's nothing to save!"
  }

  return `Edit ${controlType}`
}


const getSecondbuttonTitle = (controlType, editMode, canDelete) => {
  if (editMode) {
    return 'Cancel changes'
  }

  if (!canDelete) {
    return `You cannot delete this ${controlType}.`
  }

  return `Delete ${controlType}`
}




const CardControls = (props) => {
  const {
    canDelete,
    canSubmit,
    editMode,
    deleteMode,
    controlType,
    onCancelClick,
    onDeleteClick,
    onEditClick,
    onSubmitClick,
  } = props

  return (
    <>
      <button
        className={`icon ${editMode ? 'green' : ''}`}
        disabled={editMode ? !canSubmit : false}
        name={editMode || deleteMode ? 'confirm' : 'edit'}
        onClick={editMode ? onSubmitClick : onEditClick}
        title={getFirstButtonTitle(controlType, editMode, canSubmit)}
        type="button">
        <FontAwesomeIcon icon={editMode ? 'check' : 'pen'} fixedWidth />
      </button>
      <button
        className="icon"
        disabled={editMode ? false : !canDelete}
        name={editMode || deleteMode ? 'cancel' : 'delete'}
        onClick={editMode ? onCancelClick : onDeleteClick}
        title={getSecondbuttonTitle(controlType, editMode, canDelete)}
        type="button">
        <FontAwesomeIcon icon={editMode ? 'times' : 'trash'} fixedWidth />
      </button>
    </>
  )
}





export default CardControls
