import PropTypes from 'prop-types'

import InputFieldset from '~/components/Fieldsets/InputFieldset'
import useForm from '~/hooks/useForm'





// Component Constants
const data = {
  type: 'clients',
  attributes: {
    name: '',
    redirectUri: '',
  },
}



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
        required
        id="ClientRedirectUri"
        label="Redirect URI"
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
