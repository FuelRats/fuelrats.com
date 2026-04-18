import { useCallback } from 'react'

import RatTagsInput, { renderRatValue } from './RatTagsInput'




function FirstLimpetInput (props) {
  const { options = [], valueProp = 'value' } = props

  const resolveItemValue = useCallback((item) => {
    if (typeof valueProp === 'function') {
      return valueProp(item)
    }
    let value = item
    for (const key of valueProp.split('.')) {
      if (value === null || value === undefined) {
        return undefined
      }
      value = value[key]
    }
    return value
  }, [valueProp])

  const onSearch = useCallback((query) => {
    if (!query) {
      return options
    }
    const regex = new RegExp(`.*${query}.*`, 'giu')
    return options.filter((option) => {
      const text = resolveItemValue(option) ?? renderRatValue(option)
      return regex.test(typeof text === 'string' ? text : '')
    })
  }, [options, resolveItemValue])

  return <RatTagsInput {...props} onSearch={onSearch} />
}




export default FirstLimpetInput
