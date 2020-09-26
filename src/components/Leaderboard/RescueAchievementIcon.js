/* eslint-disable no-magic-numbers -- Defining named constants in this case actually hurts readability */





import React from 'react'





import Rescue100 from '../../../public/static/svg/rescue100.svg'
import Rescue1000 from '../../../public/static/svg/rescue1000.svg'
import Rescue200 from '../../../public/static/svg/rescue200.svg'
import Rescue300 from '../../../public/static/svg/rescue300.svg'
import Rescue400 from '../../../public/static/svg/rescue400.svg'
import Rescue500 from '../../../public/static/svg/rescue500.svg'





function RescueAchievementIcon ({ rescueCount, ...iconProps }) {
  let Icon = null
  let count = 0

  if (rescueCount >= 1000) {
    Icon = Rescue1000
    count = 1000
  } else if (rescueCount >= 500) {
    Icon = Rescue500
    count = 500
  } else if (rescueCount >= 400) {
    Icon = Rescue400
    count = 400
  } else if (rescueCount >= 300) {
    Icon = Rescue300
    count = 300
  } else if (rescueCount >= 200) {
    Icon = Rescue200
    count = 200
  } else if (rescueCount >= 100) {
    Icon = Rescue100
    count = 100
  }


  return Icon && (
    <div
      className={['achievement rescue-count', { crown: count >= 500 }]}
      title={`This rat has completed at least ${count} rescues!`}>
      <Icon {...iconProps} />
    </div>
  )
}





export default RescueAchievementIcon
