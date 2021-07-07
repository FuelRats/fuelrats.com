import PropTypes from 'prop-types'

import getResponseError from '~/util/getResponseError'

import MessageBox from '../MessageBox'
import ApiErrorBox from '../MessageBox/ApiErrorBox'





// Component Constants
function getErrorText (error) {
  switch (error.status) {
    case 'unauthorized':
      return 'how did this happened? (unauthorized for this action)'

    case 'unprocessable_entity':
      return 'This form is scuffed. Let Clappy know.'

    default:
      return undefined
  }
}




function ClientSubmitMessageBox (props) {
  const {
    response,
  } = props

  if (!response) {
    return null
  }

  const error = getResponseError(response)

  if (error) {
    return (
      <ApiErrorBox error={error} renderError={getErrorText} title="Wuh Woh!" />
    )
  }

  return (
    <MessageBox title="Success!" type="success">
      <p>{'Hey you have a new Client!'}</p>
      <p>
        {'Your client ID is: '}
        <code>{response.payload?.data?.id ?? 'NULL'}</code>
        <br />
        {'And your client secret is: '}
        <code>{response.payload?.meta?.secret ?? 'NULL'}</code>
      </p>
      <p>{"Don't lose your client secret! This is the only time you'll get it. If you lose your secret, you will need to generate a new client."}</p>
    </MessageBox>
  )
}

ClientSubmitMessageBox.propTypes = {
  response: PropTypes.object,
}





export default ClientSubmitMessageBox
