import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'

import isPromise from '~/util/isPromise'

import styles from './RadioInput.module.scss'
import RadioInputOption from './RadioInputOption'





function RadioInput (props) {
  const {
    as: Element = 'div',
    className,
    disabled: disableProp,
    name,
    options,
    onChange,
    OptionElement = RadioInputOption,
    value,
  } = props

  const [loading, setLoading] = useState(false)
  const disabled = loading || disableProp

  const handleOptionClick = useCallback(async (event) => {
    if (value !== event?.target?.value) {
      const changePromise = onChange(event)

      if (isPromise(changePromise)) {
        setLoading(true)
        await changePromise
        setLoading(false)
      }
    }
  }, [onChange, value])

  return (
    <Element className={[styles.radioInput, { disabled }, className]}>
      {
        options.map((option) => {
          return (
            <OptionElement
              key={option.value}
              {...option}
              checked={option.value === (value ?? option.checked)}
              disabled={disabled ?? option.disabled}
              name={name}
              onChange={handleOptionClick} />
          )
        })
      }
    </Element>
  )
}


RadioInput.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  disabled: PropTypes.any,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  OptionElement: PropTypes.elementType,
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
}




export default RadioInput
