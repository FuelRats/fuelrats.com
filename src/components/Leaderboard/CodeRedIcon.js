import CodeRedSvg from '../../../public/static/svg/codeRed.svg'
import styles from './Leaderboard.module.scss'





function CodeRedIcon ({ codeRedCount, ...iconProps }) {
  return Boolean(codeRedCount) && (
    <div
      className={`${styles.achievement} ${styles.codeRed}`}
      title="This rat has completed at least one code red!">
      <CodeRedSvg {...iconProps} />
    </div>
  )
}





export default CodeRedIcon
