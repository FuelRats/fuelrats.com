import CMDRFieldset from '~/components/Fieldsets/CMDRFieldset'
import IRCNickFieldset from '~/components/Fieldsets/IRCNickFieldset'
import dynamicNewPasswordFieldset from '~/components/Fieldsets/NewPasswordFieldset'
import PlatformFieldset from '~/components/Fieldsets/PlatformFieldset'
import NewEmailFieldset from '~/components/Fieldsets/RegistrationEmailFieldset'
import TermsFieldset from '~/components/Fieldsets/TermsFieldset'
import useForm from '~/hooks/useForm'





const data = Object.freeze({
  type: 'registrations',
  attributes: {},
  meta: {
    termsApproved: false,
  },
})

const labels = Object.freeze({
  email: 'Email',
  password: (<>{'Password '}<small>{'This password will be used for both fuelrats.com and our IRC chat.'}</small></>),
  nickname: (
    <>
      {'What will your IRC Nickname be? '}
      <small>{'This should be your CMDR name without any spaces or platform tags. e.g. [PC]'}</small>
    </>
  ),
  name: (<>{'What is your CMDR name? '}<small>{'If you have more than one, you can add the rest later.'}</small></>),
  platform: 'What platform is your CMDR on?',
})

const passwordFieldProps = {
  required: true,
  id: 'Password',
  label: labels.password,
  name: 'attributes.password',
}

const NewPasswordFieldset = dynamicNewPasswordFieldset(passwordFieldProps)


function RegistrationForm ({ onSubmit }) {
  const { Form, canSubmit, submitting } = useForm({ data, onSubmit })

  return (
    <Form>
      <NewEmailFieldset
        autoFocus
        required
        autoComplete="email"
        id="Email"
        label={labels.email}
        name="attributes.email" />

      <NewPasswordFieldset {...passwordFieldProps} />

      <IRCNickFieldset
        required
        id="IRCNickname"
        label={labels.nickname}
        name="attributes.nickname" />

      <CMDRFieldset
        required
        autoComplete="username"
        id="CMDRName"
        label={labels.name}
        name="attributes.name" />

      <PlatformFieldset
        required
        id="CMDRPlatform"
        label={labels.platform}
        name="attributes.platform" />

      <TermsFieldset
        prefetch
        required
        id="TermsApproved"
        name="meta.termsApproved" />


      <menu type="toolbar">
        <div className="primary position-vertical">
          <button
            className="green"
            disabled={!canSubmit}
            title="Don't want to rescue people? You're in the wrong place."
            type="submit">
            {
              submitting
                ? 'Submitting...'
                : 'I want to become a Fuel Rat!'
            }
          </button>
        </div>
        <div className="secondary" />
      </menu>
    </Form>
  )
}





export default RegistrationForm
