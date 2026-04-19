import { useEffect, useState } from 'react'
import { useStore } from 'react-redux'

import frApi from '~/services/frApi'
import { selectSessionToken } from '~/store/selectors'


const cache = new Map()
const pending = new Map()

function resolveNickname (nick, token) {
  if (cache.has(nick)) {
    return cache.get(nick)
  }

  if (pending.has(nick)) {
    return pending.get(nick)
  }

  const promise = frApi.request({
    url: '/nicknames',
    params: { nick },
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => {
    const nickData = response.data?.data?.[0]
    const userId = nickData?.relationships?.user?.data?.id ?? null
    cache.set(nick, userId)
    pending.delete(nick)
    return userId
  }).catch(() => {
    cache.set(nick, null)
    pending.delete(nick)
    return null
  })

  pending.set(nick, promise)
  return promise
}


export default function useNicknameUserId (nick) {
  const store = useStore()
  const [userId, setUserId] = useState(() => {
    return cache.get(nick) ?? null
  })

  useEffect(() => {
    if (!nick) {
      return
    }

    if (cache.has(nick)) {
      setUserId(cache.get(nick))
      return
    }

    const token = selectSessionToken(store.getState())
    if (!token) {
      return
    }

    resolveNickname(nick, token).then((id) => {
      setUserId(id)
    })
  }, [nick, store])

  return userId
}
