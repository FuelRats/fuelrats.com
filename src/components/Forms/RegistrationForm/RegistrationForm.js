import CMDRFieldset from '~/components/Fieldsets/CMDRFieldset'
import ExpansionFieldset from '~/components/Fieldsets/ExpansionFieldset'
import { useConfirmationValidation } from '~/components/Fieldsets/InputFieldset'
import IRCNickFieldset from '~/components/Fieldsets/IRCNickFieldset'
import NewPasswordFieldset from '~/components/Fieldsets/NewPasswordFieldset/NewPasswordFieldset'
import PlatformFieldset from '~/components/Fieldsets/PlatformFieldset'
import NewEmailFieldset from '~/components/Fieldsets/RegistrationEmailFieldset'
import TermsFieldset from '~/components/Fieldsets/TermsFieldset'
import useForm from '~/hooks/useForm'





const data = {
  type: 'registrations',
  attributes: {},
  meta: {
    termsApproved: false,
  },
}

const labels = {
  email: 'Email',
  confirmEmail: 'Confirm Email',
  password: (
    <>
      {'Password '}
      <small>{'This password will be used for both fuelrats.com and our IRC chat.'}</small>
    </>
  ),
  nickname: (
    <>
      {'What will your IRC Nickname be? '}
      <small>{'This should be your CMDR name without any spaces or platform tags. e.g. [PC]'}</small>
    </>
  ),
  name: (
    <>
      {'What is your CMDR name? '}
      <small>{'If you have more than one, you can add the rest later.'}</small>
    </>
  ),
  expansion: (
    <>
      {'What game version do you most regularly play on? '}
      <small>{'Not sure yet? You can change this later.'}</small>
    </>
  ),
  platform: 'What platform is your CMDR on?',
}

function RegistrationForm ({ onSubmit }) {
  const { Form, canSubmit, submitting, state } = useForm({ data, onSubmit })

  const confirmEmailProps = useConfirmationValidation('attributes.email', 'Email', state)

  return (
    <Form>
      <NewEmailFieldset
        autoFocus
        required
        autoComplete="email"
        id="Email"
        label={labels.email}
        name="attributes.email" />

      <NewEmailFieldset
        required
        autoComplete="email"
        id="ConfirmEmail"
        label={labels.confirmEmail}
        name="meta.confirmEmail"
        {...confirmEmailProps} />

      <NewPasswordFieldset
        required
        id="Password"
        label={labels.password}
        name="attributes.password" />

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

      {
        state.attributes.platform === 'pc' && (
          <ExpansionFieldset
            longNames
            required
            id="ExpansionAccount"
            label={labels.expansion}
            name="attributes.expansion" />
        )
      }

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
