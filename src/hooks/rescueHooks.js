import { HttpStatus } from '@fuelrats/web-util/http'
import axios from 'axios'
import { useMemo, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { getLanguage } from '~/data/languageList'
import { getPlatform } from '~/data/platformList'
import { getSystemStars } from '~/store/actions/systems'
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

export const useRescueLandmark = (rescue) => {
  const { distance, name } = rescue?.attributes?.data?.landmark ?? {}

  return (distance && name) ? `${distance.toFixed(1)}ly from ${name}` : false
}

export const useRescueHasScoopableStar = (rescue) => {
  const systemId = rescue?.attributes?.data?.systemId ?? 0
  const [hasScoopable, setHasScoopable] = useState('')
  const dispatch = useDispatch()

  useEffect(
    () => {
      let timeout = null

      const fetchData = async () => {
        if (systemId) {
          const response = await dispatch(getSystemStars(systemId))

          const error = getResponseError(response)

          if (!error) {
            const areScoopable = response.payload?.data?.filter((item) => {
              return item.attributes.isScoopable === true
            })

            if (areScoopable.length > 0) {
              setHasScoopable('Secondary Star Scoopable')

              const mainStarScoopable = response.payload?.data?.filter((item) => {
                return item.attributes.isMainStar === true
              })

              if (mainStarScoopable.length > 0) {
                setHasScoopable('Main Star Scoopable')
              }
            }
          }
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
    [dispatch, systemId],
  )


  return hasScoopable
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
        const { data, status } = await axios.get('/api/qms/queue')

        if (status === HttpStatus.OK) {
          setCount(data.data.attributes.queueLength)
          setMax(data.data.attributes.maxClients)
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
