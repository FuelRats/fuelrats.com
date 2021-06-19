import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { redeemDecal } from '~/store/actions/decals'
import {
  selectCurrentUserId,
  selectDecalsByUserId,
  selectUserRedeemableDecals,
  withCurrentUserId,
} from '~/store/selectors'

import DecalRow from './DecalRow'
import styles from './UserDecalPanel.module.scss'


function UserDecalPanel () {
  const [redeeming, setRedeeming] = useState(false)

  const decals = useSelector(withCurrentUserId(selectDecalsByUserId))
  const userId = useSelector(selectCurrentUserId)
  const redeemable = useSelector(selectUserRedeemableDecals)

  const dispatch = useDispatch()

  const handleRedeemDecal = useCallback(async () => {
    setRedeeming(true)

    await dispatch(redeemDecal(userId))

    setRedeeming(false)
  }, [dispatch, userId])

  return (
    <div className="panel">
      <header>
        {'Decal'}
        <div className="controls">
          {'Redeemed'}
        </div>
      </header>
      <div className={styles.panelContent}>
        {
          Boolean(decals.length) && decals.map((decal) => {
            return (<DecalRow key={decal.id} decal={decal} />)
          })
          }
        {
          Boolean(!decals.length && !redeemable) && (
            <div className={styles.noDecal}>{"Sorry, you're not eligible for a decal."}</div>
          )
        }
        {
          Boolean(redeemable) && (
            <div className={styles.redeem}>
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





export default UserDecalPanel
