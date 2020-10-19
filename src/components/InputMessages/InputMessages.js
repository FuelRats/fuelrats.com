import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

import styles from './InputMessages.module.scss'




// Component Constants





function MessageSet (props) {
  return props.messages.map((message) => {
    return (
      <li
        key={message}
        className={[styles.message, styles[props.type] ?? '']}>
        <FontAwesomeIcon fixedWidth icon={props.icon} />
        {message}
      </li>
    )
  })
}


function InputMessages (props) {
  const {
    className,
    messages,
  } = props

  return (
    <ul className={[styles.inputMessages, className]}>
      <MessageSet icon="exclamation-triangle" messages={messages.errors} type="error" />
      <MessageSet icon="exclamation-circle" messages={messages.warnings} type="warning" />
    </ul>
  )
}

InputMessages.propTypes = {
  className: PropTypes.string,
  messages: PropTypes.shape({
    errors: PropTypes.arrayOf(PropTypes.string).isRequired,
    warnings: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
}





export default InputMessages
