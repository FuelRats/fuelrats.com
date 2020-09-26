import PropTypes from 'prop-types'
import React from 'react'

import { connect } from '~/store'





// Component Constants





@connect
class {{pascalCase name}} extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {}





  /***************************************************************************\
    Private Methods
  \***************************************************************************/





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      className,
    } = this.props

    return (
      <div className={className} />
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = []

  static mapStateToProps = () => {
    return {}
  }





  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static defaultProps = {
    className: undefined,
  }

  static propTypes = {
    className: PropTypes.string,
  }
}





export default {{pascalCase name}}
