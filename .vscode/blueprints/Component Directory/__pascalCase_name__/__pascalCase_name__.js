import PropTypes from 'prop-types'

import styles from './{{pascalCase name}}.module.scss'




// Component Constants





function {{pascalCase name}} (props) {
  const {
    className,
  } = props

  return (
    <div className={[styles.{{camelCase name}}, className]} />
  )
}

{{pascalCase name}}.propTypes = {
  className: PropTypes.string,
}





export default {{pascalCase name}}
