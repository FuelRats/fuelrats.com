import dynamicNewPasswordFieldset from '~/components/Fieldsets/NewPasswordFieldset'
import useForm from '~/hooks/useForm'



const passwordFieldProps = {
  required: true,
  id: 'Password',
  label: (<>{'New Password '}<small>{'This password will be used for both fuelrats.com and our IRC chat.'}</small></>),
  name: 'attributes.password',
}


const NewPasswordFieldset = dynamicNewPasswordFieldset(passwordFieldProps)





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
      <NewPasswordFieldset {...passwordFieldProps} />

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
