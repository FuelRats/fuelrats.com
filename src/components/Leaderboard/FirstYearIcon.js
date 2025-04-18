import isBefore from 'date-fns/isBefore'

import FirstYearSvg from '../../../public/static/svg/firstYear.svg'
import styles from './Leaderboard.module.scss'





function FirstYearIcon ({ createdAt, ...iconProps }) {
  return isBefore(
    new Date(createdAt),
    new Date('2016-01-01T00:00:00Z'),
  ) && (
    <div
      className={`${styles.achievement} ${styles.firstYear}`}
      title="This rat joined in our first year of operation!">
      <FirstYearSvg className="size-32 fixed" {...iconProps} />
    </div>
  )
}





export default FirstYearIcon
