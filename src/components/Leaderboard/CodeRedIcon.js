import CodeRedSvg from '../../../public/static/svg/codeRed.svg'





function CodeRedIcon ({ codeRedCount, ...iconProps }) {
  return Boolean(codeRedCount) && (
    <div
      className="achievement code-red"
      title="This rat has completed at least one code red!">
      <CodeRedSvg {...iconProps} />
    </div>
  )
}





export default CodeRedIcon
