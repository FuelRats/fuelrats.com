import React from 'react'





import CodeRedSvg from '../svg/CodeRedSvg'





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
