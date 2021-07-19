import PropTypes from 'prop-types'
import { createSelector } from 'reselect'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectCurrentUserScopes } from '~/store/selectors'

import NamespaceDetails from './NamespaceDetails'
import styles from './ScopeView.module.scss'





const selectScopesProp = (_, props = {}) => {
  return props.scopes
}

const selectGroupedScopes = createSelector(
  [selectScopesProp, selectCurrentUserScopes],
  (scopes = [], accessibleScopes = []) => {
    return scopes.reduce((acc, scopeStr) => {
      const [namespace, action, isSelf] = scopeStr.split('.')

      if (!acc[namespace]) {
        acc[namespace] = { [action]: {} }
      } else if (!acc[namespace][action]) {
        acc[namespace][action] = {}
      }

      acc[namespace][action][isSelf ? 'self' : 'all'] = Boolean(
        accessibleScopes.includes(scopeStr)
          || (isSelf && accessibleScopes.includes(`${namespace}.${action}`))
          || accessibleScopes.includes('*')
          || accessibleScopes.includes(`${namespace}.*`),
      )

      return acc
    }, {})
  },
)





function ScopeView ({ className }) {
  const groupedScopes = useSelectorWithProps(className, selectGroupedScopes)
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
