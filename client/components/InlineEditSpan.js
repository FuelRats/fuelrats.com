import React from 'react'





const InlineEditor = ({
  canEdit,
  className,
  inputClassName,
  value,
  ...inputProps
}) => (
  canEdit
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
)





export default InlineEditor
