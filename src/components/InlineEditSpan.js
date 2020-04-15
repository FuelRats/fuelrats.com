import React from 'react'





function InlineEditor ({
  canEdit,
  className,
  inputClassName,
  value,
  ...inputProps
}) {
  return canEdit
    ? (
      <input
        className={`inline-editor inline ${inputClassName || ''}`}
        type="text"
        value={value}
        {...inputProps} />
    )
    : (
      <span className={`inline-editor ${className}`}>
        {value}
      </span>
    )
}





export default InlineEditor
