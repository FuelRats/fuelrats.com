import { useCallback } from 'react'

import { ircNickRegExp } from '~/data/RegExpr'

import InputFieldset, { useValidationCallback } from './InputFieldset'





export default function IRCNickFieldset (props) {
  const {
    onValidate: parentValidate,
    ...inputProps
  } = props

  const handleChange = useCallback(
    ({ target }) => {
      target.value = target.value.replace(/\s/gu, '_')
    },
    [],
  )

  const handleValidate = useValidationCallback(
    (messages, value) => {
      if (value.startsWith('CMDR')) {
        messages.errors.push('CMDR is redundant here, CMDR')
      }

      if (!value.match(ircNickRegExp)) {
        messages.errors.push(
          'IRC Nicks must begin with a letter, and may only contain letters, numbers, and certain formatting characters. Underscores ("_") are usually used in place of spaces',
        )
      }

      if (value.match(/(\[.*\]|\|)/u)) {
        messages.errors.push('Your primary nickname cannot contain a platform/status tag. It should be as close as possible to your CMDR name')
      }
    },
    [],
    parentValidate,
  )

  return (
    <InputFieldset
      displayName="IRC Nick"
      maxLength={29}
      minLength={2}
      placeholder="Surly_Badger"
      {...inputProps}
      type="text"
      onChange={handleChange}
      onValidate={handleValidate} />
  )
}
