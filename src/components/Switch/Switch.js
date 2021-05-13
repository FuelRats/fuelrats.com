import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'

import styles from './Switch.module.scss'





function Switch (props) {
  const {
    async: isAsync,
    containerProps,
    className,
    disabled,
    id,
    label,
    onClick,
    ...inputProps
  } = props

  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async (event) => {
    if (!isAsync) {
      onClick?.(event)
      return
    }

    setLoading(true)
    await onClick?.(event)
    setLoading(false)
  }, [isAsync, onClick])

  let icon = 'times'
  if (loading) {
    icon = 'circle'
  }
  if (props.checked) {
    icon = 'check'
  }

  return (
    <div>
      <label {...containerProps} className={[styles.switch, { [styles.checked]: props.checked, [styles.disabled]: props.disabled }, className]} htmlFor={id}>
        <input
          {...inputProps}
          className={styles.input}
          disabled={loading || disabled}
          id={id}
          type="checkbox"
          onClick={handleClick} />

        <span className={styles.slider} />
        <FontAwesomeIcon
          fixedWidth
          className={[styles.handle, { [styles.loading]: loading }]}
          icon={icon} />

        {
          label && (
            <span className={styles.label}>{label}</span>
          )
        }
      </label>
    </div>
  )
}

Switch.propTypes = {
  async: PropTypes.bool,
  checked: PropTypes.bool,
  className: PropTypes.string,
  containerProps: PropTypes.object,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  onClick: PropTypes.func,
}





export default Switch
