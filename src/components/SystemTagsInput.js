import { useCallback } from 'react'

import TagsInput from './TagsInput'




async function searchSystems (query) {
  if (!query) {
    return []
  }
  try {
    const response = await fetch(`/api/sapi/mecha?name=${encodeURIComponent(query)}`)
    if (!response.ok) {
      return []
    }
    const json = await response.json()
    return json?.data?.map((system) => {
      return system.name
    }) ?? []
  } catch {
    return []
  }
}


function SystemTagsInput (props) {
  const onSearch = useCallback((query) => {
    return searchSystems(query)
  }, [])

  return <TagsInput {...props} onSearch={onSearch} />
}




export default SystemTagsInput
