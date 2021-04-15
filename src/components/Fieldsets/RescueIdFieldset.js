import { isValidUuidV4 } from '~/helpers/uuidValidator'

import InputFieldset, { useValidationCallback } from './InputFieldset'

export default function RescueIdFieldset (props) {
  const {
    onValidate: parentValidate,
    onChange,
    ...inputProps
  } = props

  const handleValidate = useValidationCallback(
    (messages, value) => {
      if (!isValidUuidV4(value)) {
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
      onChange={onChange}
      onValidate={handleValidate} />
  )
}
