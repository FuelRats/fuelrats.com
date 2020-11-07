import dynamic from 'next/dynamic'

import useForm from '~/hooks/useForm'

// Dynamic for bundling optimization
const NewPasswordFieldset = dynamic(() => {
  return import('../Fieldsets/NewPasswordFieldset')
})





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
      <NewPasswordFieldset
        required
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
