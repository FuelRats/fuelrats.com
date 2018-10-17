// Module imports
import React from 'react'





const UserStatsOverview = () => {
  const assistCount = 2
  const firstLimpetCount = 5
  const failureCount = 3
  const successRate = 50

  return (
    <div className="user-stats-overview">
      <div className="rescues-count stat">
        <data value={firstLimpetCount}>{firstLimpetCount}</data>
        <small>rescues</small>
      </div>

      <div className="assists-count stat">
        <data value={assistCount}>{assistCount}</data>
        <small>assists</small>
      </div>

      <div className="failures-count stat">
        <data value={failureCount}>{failureCount}</data>
        <small>failures</small>
      </div>

      <div className="stat success-rate">
        <data value={successRate}>{successRate}%</data>
        <small>success</small>
      </div>
    </div>
  )
}





export default UserStatsOverview
