import React from 'react'

import CMDRFieldset from '~/components/Fieldsets/CMDRFieldset'
import EmailFieldset from '~/components/Fieldsets/EmailFieldset'
import IRCNickFieldset from '~/components/Fieldsets/IRCNickFieldset'
import PasswordFieldset from '~/components/Fieldsets/PasswordFieldset'
import PlatformFieldset from '~/components/Fieldsets/PlatformFieldset'
import TermsFieldset from '~/components/Fieldsets/TermsFieldset'
import useForm from '~/hooks/useForm'





const initialData = Object.freeze({
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


function RegistrationForm (props) {
  const { Form, canSubmit, submitting } = useForm({
    data: initialData,
    onSubmit: props.onSubmit,
  })

  return (
    <Form>
      <EmailFieldset
        required
        autoComplete="email"
        disabled={submitting}
        id="Email"
        label={labels.email}
        name="attributes.email" />

      <PasswordFieldset
        required
        showStrength
        showWarnings
        autoComplete="new-password"
        disabled={submitting}
        id="Password"
        label={labels.password}
        name="attributes.password" />

      <IRCNickFieldset
        required
        disabled={submitting}
        id="IRCNickname"
        label={labels.nickname}
        name="attributes.nickname" />

      <CMDRFieldset
        required
        autoComplete="username"
        disabled={submitting}
        id="CMDRName"
        label={labels.name}
        name="attributes.name" />

      <PlatformFieldset
        required
        disabled={submitting}
        id="CMDRPlatform"
        label={labels.platform}
        name="attributes.platform" />

      <TermsFieldset
        prefetch
        required
        disabled={submitting}
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
