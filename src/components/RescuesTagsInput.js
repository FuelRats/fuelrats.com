import Cookies from 'js-cookie'
import { useCallback } from 'react'

import { renderRatLoader } from './RatTagsInput'
import TagsInput from './TagsInput'





function renderRescueValue (rescue) {
  const operationName = rescue.attributes.title ? `Operation ${rescue.attributes.title}` : null
  const clientDetails = `Rescue of ${rescue.attributes.client || 'unknown'} [${rescue.attributes.platform || 'N/A'}] in ${rescue.attributes.system || 'unknown'}`

  return (
    <span>{rescue.id}{operationName ? ` (${operationName})` : ` (${clientDetails})`}</span>
  )
}


async function searchRescues (query) {
  if (!query) {
    return []
  }
  try {
    const token = Cookies.get('access_token')
    const response = await fetch(`/api/fr/rescues/${encodeURIComponent(query)}`, {
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    })
    const json = await response.json()
    if (json.errors) {
      return []
    }
    return json.data ?? []
  } catch {
    return []
  }
}


function RescuesTagsInput (props) {
  const onSearch = useCallback((query) => {
    return searchRescues(query)
  }, [])

  return (
    <TagsInput
      {...props}
      renderLoader={renderRatLoader}
      renderValue={renderRescueValue}
      onSearch={onSearch} />
  )
}




export default RescuesTagsInput
