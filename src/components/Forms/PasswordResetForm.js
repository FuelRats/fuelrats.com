import React from 'react'

import PasswordFieldset from '~/components/Fieldsets/PasswordFieldset'
import useForm from '~/hooks/useForm'





const data = Object.freeze({
  type: 'resets',
  attributes: {
    password: '',
  },
})

const passwordLabel = (<>{'New Password '}<small>{'This password will be used for both fuelrats.com and our IRC chat.'}</small></>)

function PasswordResetForm ({ onSubmit }) {
  const { Form, canSubmit, submitting } = useForm({ data, onSubmit })

  return (
    <Form>
      <PasswordFieldset
        required
        showStrength
        showWarnings
        autoComplete="new-password"
        id="Password"
        label={passwordLabel}
        name="attributes.password" />

      <menu type="toolbar">
        <div className="primary position-vertical">
          <button
            className="green"
            disabled={!canSubmit}
            type="submit">
            {
              submitting
                ? 'Submitting...'
                : 'Submit'
            }
          </button>
        </div>
        <div className="secondary" />
      </menu>
    </Form>
  )
}





export default PasswordResetForm
