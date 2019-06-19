/* eslint-disable no-magic-numbers */// Defining named constants in this case actually hurts readability





import React from 'react'





import Rescue100Svg from '../svg/Rescue100Svg'
import Rescue200Svg from '../svg/Rescue200Svg'
import Rescue300Svg from '../svg/Rescue300Svg'
import Rescue400Svg from '../svg/Rescue400Svg'
import Rescue500Svg from '../svg/Rescue500Svg'
import Rescue1000Svg from '../svg/Rescue1000Svg'





const RescueAchievementIcon = ({ rescueCount, ...iconProps }) => {
  let Icon = null
  let count = 0

  if (rescueCount >= 1000) {
    Icon = Rescue1000Svg
    count = 1000
  } else if (rescueCount >= 500) {
    Icon = Rescue500Svg
    count = 500
  } else if (rescueCount >= 400) {
    Icon = Rescue400Svg
    count = 400
  } else if (rescueCount >= 300) {
    Icon = Rescue300Svg
    count = 300
  } else if (rescueCount >= 200) {
    Icon = Rescue200Svg
    count = 200
  } else if (rescueCount >= 100) {
    Icon = Rescue100Svg
    count = 100
  }


  return Icon && (
    <div
      className={`achievement rescue-count${count >= 500 ? ' crown' : ''}`}
      title={`This rat has completed at least ${count} rescues!`}>
      <Icon {...iconProps} />
    </div>
  )
}





export default RescueAchievementIcon
