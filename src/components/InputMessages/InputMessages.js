import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

import styles from './InputMessages.module.scss'
import clsx from 'clsx'




// Component Constants





function MessageSet (props) {
  return props.messages.map((message) => {
    return (
      <li
        key={message}
        className={clsx(styles.message, styles[props.type] ?? '')}>
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
    <ul className={clsx(styles.inputMessages, className)}>
      <MessageSet icon="triangle-exclamation" messages={messages.errors} type="error" />
      <MessageSet icon="circle-exclamation" messages={messages.warnings} type="warning" />
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
