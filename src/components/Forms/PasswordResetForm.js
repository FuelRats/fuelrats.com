import NewPasswordFieldset from '~/components/Fieldsets/NewPasswordFieldset'
import useForm from '~/hooks/useForm'



const passwordLabel = (
  <>
    {'New Password '}
    <small>
      {'This password will be used for both fuelrats.com and our IRC chat.'}
    </small>
  </>
)





const data = {
  type: 'resets',
  attributes: {
    password: '',
  },
}

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
