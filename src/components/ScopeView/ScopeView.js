import PropTypes from 'prop-types'
import { createSelector } from 'reselect'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectCurrentUserScopes } from '~/store/selectors'

import NamespaceDetails from './NamespaceDetails'
import styles from './ScopeView.module.scss'





// Component Constants

const selectAccessibleScopeData = createSelector(
  [
    (_, props) => {
      return props.scopes
    },
    selectCurrentUserScopes,
  ],
  (requestedScopes, userScopes = []) => {
    return requestedScopes.reduce((acc, scopeStr) => {
      const [namespace, action, isSelf] = scopeStr.split('.')

      if (!acc[namespace]) {
        acc[namespace] = { [action]: {} }
      } else if (!acc[namespace][action]) {
        acc[namespace][action] = {}
      }

      acc[namespace][action][isSelf ? 'self' : 'all'] = {
        accessible: userScopes.includes(scopeStr)
        || (isSelf && userScopes.includes(`${namespace}.${action}`))
        || userScopes.includes('*'),
      }

      return acc
    }, {})
  },
)





function ScopeView (props) {
  const { className, scopes } = props

  const groupedScopes = useSelectorWithProps({ scopes }, selectAccessibleScopeData)

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

ScopeView.propTypes = {
  className: PropTypes.string,
  scopes: PropTypes.arrayOf(PropTypes.string).isRequired,
}





export default ScopeView
