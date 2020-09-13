import { useMemo } from 'react'

import { getLanguage } from '~/data/LanguageList'
import { getPlatform } from '~/data/PlatformList'
import { formatAsEliteDateTime } from '~/helpers/formatTime'

export const useQuoteString = (rescue) => {
  return useMemo(() => {
    if (!rescue.attributes.quotes.length) {
      return undefined
    }

    return rescue.attributes.quotes.reduce((acc, quote) => {
      return `${acc}[${formatAsEliteDateTime(quote.createdAt)}] "${quote.message}" - ${quote.author}\n`
    }, [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rescue?.attributes?.quotes])
}

export const useLanguageData = (rescue) => {
  return useMemo(() => {
    return getLanguage(rescue.attributes.clientLanguage)
  }, [rescue.attributes.clientLanguage])
}

export const usePlatformData = (rescue) => {
  return useMemo(() => {
    return getPlatform(rescue.attributes.platform)
  }, [rescue.attributes.platform])
}
