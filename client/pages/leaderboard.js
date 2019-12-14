// Module imports
import React from 'react'





// Component imports
import { PageWrapper } from '../components/AppLayout'
import RatLeaderboardTable from '../components/RatLeaderboardTable'





const Leaderboard = () => (
  <PageWrapper title="Leaderboard">
    <div className="page-content">
      <RatLeaderboardTable />
    </div>
  </PageWrapper>
)





export default Leaderboard
