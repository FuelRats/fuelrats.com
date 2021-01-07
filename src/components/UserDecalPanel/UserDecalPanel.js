import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  selectCurrentUserId,
  selectDecalsByUserId,
  selectUserRedeemableDecals,
  withCurrentUserId,
} from '~/store/selectors'

import DecalRow from './DecalRow'

function UserDetailsPanel () {
  const [redeeming, setRedeeming] = useState(false)

  const decals = useSelector(withCurrentUserId(selectDecalsByUserId))
  const userId = useSelector(selectCurrentUserId)
  const redeemable = useSelector(selectUserRedeemableDecals)

  const dispatch = useDispatch()

  const handleRedeemDecal = useCallback(async () => {
    setRedeeming(true)

    // eslint-disable-next-line no-undef
    await dispatch(redeemDecal(userId))

    setRedeeming(false)
  }, [dispatch, userId])

  return (
    <div className="panel user-decals">
      <header>
        {'Decal'}
        <div className="controls">
          {'Redeemed'}
        </div>
      </header>
      <div className="panel-content">
        {
          Boolean(decals.length) && decals.map((decal) => {
            return (<DecalRow key={decal.id} decal={decal} />)
          })
          }
        {
          Boolean(!decals.length && !redeemable) && (
            <div className="no-decal">{"Sorry, you're not eligible for a decal."}</div>
          )
        }
        {
          Boolean(redeemable) && (
            <div className="redeem">
              <span>{"You're eligible for a decal but you haven't redeemed it yet!"}</span>
              <button
                disabled={redeeming}
                type="button"
                onClick={handleRedeemDecal}>
                {
                  redeeming
                    ? 'Submitting...'
                    : 'Redeem Decal'
                }
              </button>
            </div>
          )
        }
      </div>
    </div>
  )
}





export default UserDetailsPanel
