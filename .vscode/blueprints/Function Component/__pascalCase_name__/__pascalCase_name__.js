// Module imports
import PropTypes from 'prop-types'
import React from 'react'




// Component imports
import styles from './{{pascalCase name}}.module.scss'
import { connect } from '~/store'




// Component Constants





function {{pascalCase name}} (props) {
  const {
    className,
  } = props

  return (
    <div className={[styles.{{camelCase name}}, className]} />
  )
}


{{pascalCase name}}.mapDispatchToProps = []

{{pascalCase name}}.mapStateToProps = () => {
  return {}
}


{{pascalCase name}}.propTypes = {
  className: PropTypes.string,
}





export default connect({{pascalCase name}})
