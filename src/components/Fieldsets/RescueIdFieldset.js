import InputFieldset, { useValidationCallback } from './InputFieldset'

export default function RescueIdFieldset (props) {
  const {
    onValidate: parentValidate,
    onChange,
    ...inputProps
  } = props

  const handleValidate = useValidationCallback(
    (messages, value) => {
      if (!value.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/u)) {
        messages.errors.push('The syntax of the rescue ID is invalid, it should be in the form: 00000000-0000-0000-0000-000000000000!')
      }
    },
    [],
    parentValidate,
  )

  return (
    <InputFieldset
      displayName="RescueId"
      maxLength={36}
      minLength={36}
      name="attributes.rescueId"
      placeholder="00000000-0000-0000-0000-000000000000"
      {...inputProps}
      type="text"
      onChange={onChange}
      onValidate={handleValidate} />
  )
}
