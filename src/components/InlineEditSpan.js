import clsx from 'clsx'

function InlineEditSpan ({
  canEdit,
  className,
  inputClassName,
  value,
  ...inputProps
}) {
  return canEdit
    ? (
      <input
        className={clsx('inline-editor inline', inputClassName)}
        type="text"
        value={value}
        {...inputProps} />
    )
    : (
      <span className={clsx('inline-editor', className)}>
        {value}
      </span>
    )
}





export default InlineEditSpan
