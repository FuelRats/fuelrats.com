import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector, useStore } from 'react-redux'

import { selectDispatchBoard } from '~/store/selectors/dispatch'
import makeRoute from '~/util/router/makeRoute'


const isTypingTarget = (target) => {
  if (!target) {
    return false
  }
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
    return true
  }
  return target.isContentEditable === true
}


const scrollSelectedIntoView = (rescueId) => {
  if (typeof document === 'undefined') {
    return
  }
  const node = document.querySelector(`[data-rescue-id="${rescueId}"]`)
  if (node?.scrollIntoView) {
    node.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }
}


export default function useDispatchKeyboardNav () {
  const router = useRouter()
  const store = useStore()
  const rescueIds = useSelector(selectDispatchBoard)
  const currentRId = router.query.rId

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return
      }
      if (isTypingTarget(event.target)) {
        return
      }

      const ids = rescueIds ?? []
      if (!ids.length && event.key !== 'Escape') {
        return
      }

      const getRescue = (rescueId) => {
        return store.getState().rescues?.[rescueId]
      }

      const goTo = (rescueId) => {
        if (!rescueId) {
          return
        }
        if (rescueId !== currentRId) {
          router.push(makeRoute('/dispatch', { rId: rescueId }))
        }
        scrollSelectedIntoView(rescueId)
      }

      const close = () => {
        if (currentRId) {
          router.push('/dispatch')
        }
      }

      const findIndexOfCurrent = () => {
        return ids.indexOf(currentRId)
      }

      switch (event.key) {
        case 'Escape':
          if (currentRId) {
            event.preventDefault()
            close()
          }
          return

        case 'ArrowDown':
        case 'j': {
          event.preventDefault()
          const idx = findIndexOfCurrent()
          const next = idx === -1 ? ids[0] : (ids[idx + 1] ?? ids[0])
          goTo(next)
          return
        }

        case 'ArrowUp':
        case 'k': {
          event.preventDefault()
          const idx = findIndexOfCurrent()
          const prev = idx === -1 ? ids[ids.length - 1] : (ids[idx - 1] ?? ids[ids.length - 1])
          goTo(prev)
          return
        }

        case 'Home': {
          event.preventDefault()
          goTo(ids[0])
          return
        }

        case 'End': {
          event.preventDefault()
          goTo(ids[ids.length - 1])
          return
        }

        case 'Enter': {
          if (currentRId) {
            return
          }
          event.preventDefault()
          goTo(ids[0])
          return
        }

        default:
          break
      }

      if (/^[0-9]$/u.test(event.key)) {
        const target = parseInt(event.key, 10)
        const matchId = ids.find((id) => {
          return getRescue(id)?.attributes?.commandIdentifier === target
        })
        if (matchId) {
          event.preventDefault()
          goTo(matchId)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [router, store, rescueIds, currentRId])
}
