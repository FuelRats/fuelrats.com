import PropTypes from 'prop-types'

import useForm from '~/hooks/useForm'

import InputFieldset from '../Fieldsets/InputFieldset'





// Component Constants
const data = Object.freeze({
  type: 'clients',
  attributes: {
    name: '',
    redirectUri: '',
  },
})



function OAuthClientForm (props) {
  const {
    className,
    onSubmit,
  } = props

  const { Form, canSubmit, submitting } = useForm({ data, onSubmit })

  return (
    <Form className={className}>
      <InputFieldset
        required
        id="ClientName"
        label="Client Name"
        name="attributes.name"
        placeholder="133t_h4x0r_man's client do not steal" />

      <InputFieldset
        id="ClientRedirectUri"
        label="Redirect URI (optional)"
        name="attributes.redirectUri"
        placeholder="https://1337.hax0r.dev/callback"
        type="url" />

      <menu type="toolbar">
        <div className="primary position-vertical">
          <button
            className="green"
            disabled={!canSubmit}
            type="submit">
            {
              submitting
                ? 'Submitting...'
                : 'Create Client'
            }
          </button>
        </div>
        <div className="secondary" />
      </menu>
    </Form>
  )
}

OAuthClientForm.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
}





export default OAuthClientForm
