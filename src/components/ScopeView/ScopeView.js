// Module imports
import PropTypes from 'prop-types'
import React from 'react'
import { createStructuredSelector } from 'reselect'



// Component imports
import NamespaceDetails from './NamespaceDetails'
import styles from './ScopeView.module.scss'
import { connect } from '~/store'
import { selectCurrentUserScopes } from '~/store/selectors'




// Component Constants


const groupScopes = (scopes, accessibleScopes = []) => {
  return scopes.reduce((acc, scopeStr) => {
    const [namespace, action, isSelf] = scopeStr.split('.')

    if (!acc[namespace]) {
      acc[namespace] = { [action]: {} }
    } else if (!acc[namespace][action]) {
      acc[namespace][action] = {}
    }

    acc[namespace][action][isSelf ? 'self' : 'all'] = {
      accessible: accessibleScopes.includes(scopeStr)
        || (isSelf && accessibleScopes.includes(`${namespace}.${action}`))
        || accessibleScopes.includes('*'),
    }

    return acc
  }, {})
}



@connect
class ScopeView extends React.PureComponent {
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
      accessibleScopes,
      className,
      scopes,
    } = this.props

    const groupedScopes = groupScopes(scopes, accessibleScopes)

    return (
      <div className={[styles.scopeView, className]}>
        {
          Object.entries(groupedScopes).map(
            ([namespace, actions]) => {
              return (
                <NamespaceDetails
                  key={namespace}
                  actions={actions}
                  namespace={namespace} />
              )
            },
          )
        }
      </div>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapStateToProps = createStructuredSelector({
    accessibleScopes: selectCurrentUserScopes,
  })





  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static defaultProps = {
    className: undefined,
  }

  static propTypes = {
    accessibleScopes: PropTypes.arrayOf(PropTypes.string).isRequired,
    className: PropTypes.string,
    scopes: PropTypes.arrayOf(PropTypes.string).isRequired,
  }
}





export default ScopeView
