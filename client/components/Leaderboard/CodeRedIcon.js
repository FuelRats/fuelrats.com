/* eslint-disable no-magic-numbers */// Defining named constants in this case actually hurts readability





import React from 'react'





import CodeRedSvg from '../svg/CodeRedSvg'





const CodeRedIcon = ({ codeRedCount, ...iconProps }) => Boolean(codeRedCount) && (
  <span title="This rat has completed at least one code red!">
    <CodeRedSvg {...iconProps} />
  </span>
)





export default CodeRedIcon
