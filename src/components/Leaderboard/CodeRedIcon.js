import styles from './Leaderboard.module.scss'
import CodeRedSvg from '../../../public/static/svg/codeRed.svg'





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
