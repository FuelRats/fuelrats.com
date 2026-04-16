import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import qs from 'qs'
import { useCallback } from 'react'

import TagsInput from './TagsInput'




const PLATFORM_COLORS = {
  pc: '#985DB5',
  ps: '#3068B3',
  xb: '#1E8C1E',
}

const PLATFORM_LABELS = {
  pc: 'PC',
  ps: 'PS',
  xb: 'XB',
}

const SEARCH_LIMIT = 10




export function renderRatValue (rat) {
  const platform = rat?.attributes?.platform
  if (!platform) {
    return rat?.attributes?.name ?? rat?.value ?? ''
  }
  return (
    <span>
      {rat.attributes.name}
      <span
        className="badge"
        style={{
          backgroundColor: PLATFORM_COLORS[platform] ?? '#555',
          color: 'white',
          marginLeft: '0.3em',
          marginRight: 0,
          fontSize: '0.75em',
        }}>
        {PLATFORM_LABELS[platform] ?? platform}
      </span>
    </span>
  )
}

export function renderRatLoader () {
  return (
    <span>
      <FontAwesomeIcon fixedWidth pulse icon="spinner" />
      {'Loading...'}
    </span>
  )
}


function RatTagsInput (props) {
  const { onSearch: onSearchProp, 'data-platform': platform } = props

  const defaultOnSearch = useCallback(async (query) => {
    if (!query) {
      return []
    }
    const queryParams = qs.stringify({
      page: { limit: SEARCH_LIMIT },
      filter: {
        and: [
          { name: { iLike: `${query}%` } },
          { platform },
        ],
      },
    })
    const response = await fetch(`/api/fr/rats?${queryParams}`)
    const { data } = await response.json()
    return data ?? []
  }, [platform])

  return (
    <TagsInput
      {...props}
      renderLoader={renderRatLoader}
      renderValue={renderRatValue}
      onSearch={onSearchProp ?? defaultOnSearch} />
  )
}




export default RatTagsInput
