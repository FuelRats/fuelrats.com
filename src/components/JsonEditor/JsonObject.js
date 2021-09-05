import _isPlainObject from 'lodash/isPlainObject'

import JsonField from '~/components/JsonEditor/JsonField'

import styles from './JsonEditor.module.scss'

function getComponent (value) {
  if (_isPlainObject(value)) {
    return JsonObject
  }

  return JsonField
}

export default function JsonObject (props) {
  const {
    node,
    name,
    depth = 0,
    path,
    hasNext,
  } = props
  const propDepth = depth + 1
  const nodeLength = Object.keys(node).length
  return (
    <div className={['jsonObject', styles.jsonObject, { [styles.hasDepth]: depth > 0 }]}>
      <span className={styles.fieldLabel}>{`${depth ? `"${name}": ` : ''}{`}</span>
      {
        Object.entries(node).map(([propName, propNode], idx) => {
          const Component = getComponent(propNode)
          const propPath = depth ? `${path}.${propName}` : propName

          return (
            <Component
              key={propPath}
              depth={propDepth}
              hasNext={idx < nodeLength}
              name={propName}
              node={propNode}
              path={propPath} />
          )
        })
      }
      <span className={styles.fieldLabel}>{`}${hasNext ? ',' : ''}`}</span>
    </div>
  )
}
