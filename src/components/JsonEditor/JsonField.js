import { useCallback } from 'react'

import { useField } from '~/hooks/useForm'

import styles from './JsonEditor.module.scss'



export default function JsonField (props) {
  const {
    node,
    name,
    path,
    depth,
  } = props
  const labelId = `${path}-label`
  const inputId = `${path}-input`

  const {
    value = '',
    handleChange,
  } = useField(path)

  const onChange = useCallback((event) => {
    handleChange(event, event.target.value === '' ? node : undefined)
  }, [handleChange, node])

  return (
    <div className={['jsonField', styles.jsonField, { [styles.hasDepth]: depth > 0 }]}>
      <label className={styles.fieldLabel} htmlFor={inputId} id={labelId} title={node}>
        {`"${name}":`}
      </label>

      <input
        aria-labelledby={labelId}
        className={styles.fieldInput}
        id={inputId}
        type="text"
        value={value === node ? '' : value}
        onChange={onChange} />
    </div>
  )
}
