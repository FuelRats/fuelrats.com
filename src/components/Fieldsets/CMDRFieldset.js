import InputFieldset, { useValidationCallback } from './InputFieldset'





export default function CMDRFieldset (props) {
  const {
    onValidate: parentValidate,
    ...inputProps
  } = props

  const handleValidate = useValidationCallback(
    ({ errors, warnings }, value) => {
      const compareValue = value.toLowerCase().trim()
      if (compareValue.startsWith('cmdr')) {
        warnings.push('CMDR is redundant here, CMDR. Be sure to input your name exactly as you first entered it in game.')
      }

      if (compareValue.includes('surly badger')) {
        errors.push('You know... we\'re pretty sure you\'re not Surly!')
      }
    },
    [],
    parentValidate,
  )

  return (
    <InputFieldset
      displayName="CMDR Name"
      maxLength={42}
      placeholder="Surly Badger"
      {...inputProps}
      type="text"
      onValidate={handleValidate} />
  )
}
