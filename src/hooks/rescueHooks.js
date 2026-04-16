import { HttpStatus } from '@fuelrats/web-util/http'
import axios from 'axios'
import { useMemo, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { getLanguage } from '~/data/languageList'
import { getPlatform } from '~/data/platformList'
import { getLandmarkList, getSystem } from '~/store/actions/systems'
import { getCardinalDirection } from '~/util/system/cardinalDirection'
import { getStarDescription, isScoopableStar } from '~/util/system/starDescription'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import getResponseError from '~/util/getResponseError'


const pollTimeoutTime = 10000


const specialSystems = {
  FUELUM: 'FUELUM ⛽️🐀',
  RODENTIA: 'RODENTIA ⛽️🐀',
  'NLTT 48288': 'NLTT 48288 🥃',
}

export const useRescueSystem = (rescue) => {
  const { system } = rescue?.attributes ?? {}

  return useMemo(() => {
    return specialSystems[system] ?? system
  }, [system])
}

export const useRescuePermit = (rescue) => {
  const permit = rescue?.attributes?.data?.permit ?? ''

  return (permit) ? `Permit Required: ${permit.name}` : false
}

// Module-level cache so the landmark list is fetched at most once per session.
let cachedLandmarksPromise = null

const ensureLandmarks = (dispatch) => {
  if (!cachedLandmarksPromise) {
    cachedLandmarksPromise = dispatch(getLandmarkList()).then((response) => {
      if (getResponseError(response)) {
        cachedLandmarksPromise = null
        return []
      }
      return response.payload?.landmarks ?? response.payload?.data?.landmarks ?? []
    }).catch(() => {
      cachedLandmarksPromise = null
      return []
    })
  }
  return cachedLandmarksPromise
}

const systemInfoCache = new Map()

export const useRescueSystemInfo = (rescue) => {
  const systemId = rescue?.attributes?.data?.systemId ?? 0
  const [info, setInfo] = useState(() => {
    return systemId ? systemInfoCache.get(systemId) ?? null : null
  })
  const dispatch = useDispatch()

  useEffect(() => {
    if (!systemId) {
      setInfo(null)
      return
    }

    const cached = systemInfoCache.get(systemId)
    if (cached) {
      setInfo(cached)
      return
    }

    let cancelled = false

    const fetchData = async () => {
      const response = await dispatch(getSystem(systemId))
      if (getResponseError(response)) {
        return
      }

      const payload = response.payload
      const data = payload?.data
      if (!data) {
        return
      }

      const stars = (payload?.included ?? [])
        .filter((item) => {
          return item.type === 'stars'
        })
        .map((item) => {
          return { id: item.id, ...item.attributes }
        })

      const result = {
        id: data.id,
        name: data.attributes?.name,
        coords: data.attributes?.coords,
        stars,
      }

      systemInfoCache.set(systemId, result)
      if (!cancelled) {
        setInfo(result)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [dispatch, systemId])

  return info
}

export const useRescueMainStar = (rescue) => {
  const info = useRescueSystemInfo(rescue)
  return useMemo(() => {
    if (!info?.stars?.length) {
      return null
    }
    return info.stars.find((star) => {
      return star.isMainStar === true
    }) ?? info.stars[0]
  }, [info])
}

export const useRescueMainStarDescription = (rescue) => {
  const mainStar = useRescueMainStar(rescue)
  return useMemo(() => {
    return getStarDescription(mainStar)
  }, [mainStar])
}

export const useRescueHasScoopableStar = (rescue) => {
  const info = useRescueSystemInfo(rescue)
  return useMemo(() => {
    if (!info?.stars?.length) {
      return ''
    }
    const mainStar = info.stars.find((star) => {
      return star.isMainStar === true
    })
    if (mainStar && isScoopableStar(mainStar)) {
      return 'Main Star Scoopable'
    }
    if (info.stars.some(isScoopableStar)) {
      return 'Secondary Star Scoopable'
    }
    return ''
  }, [info])
}

const useLandmarkCoords = (landmarkName) => {
  const [coords, setCoords] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!landmarkName) {
      setCoords(null)
      return
    }

    let cancelled = false
    ensureLandmarks(dispatch).then((landmarks) => {
      if (cancelled) {
        return
      }
      const landmark = landmarks.find((item) => {
        return item.name === landmarkName
      })
      setCoords(landmark ? { x: landmark.x, y: landmark.y, z: landmark.z } : null)
    })

    return () => {
      cancelled = true
    }
  }, [dispatch, landmarkName])

  return coords
}

export const useRescueLandmark = (rescue) => {
  const { distance, name } = rescue?.attributes?.data?.landmark ?? {}
  const systemInfo = useRescueSystemInfo(rescue)
  const landmarkCoords = useLandmarkCoords(name)

  return useMemo(() => {
    if (!distance || !name) {
      return false
    }
    const direction = getCardinalDirection(systemInfo?.coords, landmarkCoords, distance)
    const directionText = direction ? ` ${direction} of` : ' from'
    return `${distance.toFixed(1)}ly${directionText} ${name}`
  }, [distance, name, systemInfo?.coords, landmarkCoords])
}

export const useQuoteString = (rescue) => {
  return useMemo(() => {
    if (!rescue?.attributes?.quotes?.length) {
      return undefined
    }

    return rescue.attributes.quotes.reduce((acc, quote) => {
      return `${acc}[${formatAsEliteDateTime(quote.createdAt)}] "${quote.message}" - ${quote.author}\n`
    }, [])
  }, [rescue?.attributes?.quotes])
}

export const useRescueLanguage = (rescue) => {
  return useMemo(() => {
    return getLanguage(rescue.attributes.clientLanguage)
  }, [rescue.attributes.clientLanguage])
}

export const useRescuePlatform = (rescue) => {
  return useMemo(() => {
    return getPlatform(rescue.attributes.platform)
  }, [rescue.attributes.platform])
}


export const useRescueQueueCount = () => {
  const [queueLength, setCount] = useState(0)
  const [maxClients, setMax] = useState(0)

  useEffect(
    () => {
      let timeout = null

      const fetchData = async () => {
        try {
          const { data, status } = await axios.get('/api/qms/queue')

          if (status === HttpStatus.OK) {
            setCount(data.data.attributes.queueLength)
            setMax(data.data.attributes.maxClients)
          }
        } catch {
          // QMS unavailable, ignore and retry
        }

        timeout = setTimeout(fetchData, pollTimeoutTime)
      }

      fetchData()

      return () => {
        if (timeout) {
          clearTimeout(timeout)
        }
      }
    },
    [],
  )


  return [queueLength, maxClients]
}
