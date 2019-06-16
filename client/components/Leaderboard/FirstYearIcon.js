/* eslint-disable no-magic-numbers */// Defining named constants in this case actually hurts readability





import React from 'react'
import moment from 'moment'





import FirstYearSvg from '../svg/FirstYearSvg'





const FirstYearIcon = ({ createdAt, ...iconProps }) => moment(createdAt).isBefore('2016-01-01', 'year') && (
  <span title="This rat joined in 3301!">
    <FirstYearSvg className="size-32 fixed" {...iconProps} />
  </span>
)





export default FirstYearIcon
