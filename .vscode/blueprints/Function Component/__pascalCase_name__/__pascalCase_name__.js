import PropTypes from 'prop-types'
import React from 'react'

import { connect } from '~/store'

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


{{pascalCase name}}.mapDispatchToProps = []

{{pascalCase name}}.mapStateToProps = () => {
  return {}
}


{{pascalCase name}}.propTypes = {
  className: PropTypes.string,
}





export default connect({{pascalCase name}})
