import Image from 'next/image'
import PropTypes from 'prop-types'

import makePaperworkRoute from '~/util/router/makePaperworkRoute'


import AuthDependantLink from '../AuthDependantLink'
import styles from './FrontPageNotice.module.scss'




// Component Constants
const RESCUE_LINK = makePaperworkRoute({ rescueId: 'c6401fe8-dbc4-471f-8fb7-1240c83dc031' })
const TWEET_LINK = 'https://twitter.com/FuelRats/status/1352723827067904000'





function FrontPageNotice (props) {
  const {
    className,
  } = props

  return (
    <AuthDependantLink
      elseExternal
      elseHref={TWEET_LINK}
      href={RESCUE_LINK}>
      <div className={[styles.frontPageNotice, className]}>
        <Image height={368} src="/static/images/100k.jpg" width={256} />
        <div className={styles.cardText}>
          <div className={styles.title}>
            {'Celebrating 100,000 rescues!'}
          </div>
          <small className={styles.sub}>{'Art by Òssa Major'}</small>
        </div>
      </div>
    </AuthDependantLink>
  )
}

FrontPageNotice.propTypes = {
  className: PropTypes.string,
}





export default FrontPageNotice
