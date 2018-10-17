// Module imports
import React from 'react'





// Component imports
import PageWrapper from '../components/PageWrapper'
import RescuesBySystemChart from '../components/RescuesBySystemChart'
import RescuesOverTimeChart from '../components/RescuesOverTimeChart'





const Statistics = () => (
  <PageWrapper title="Statistics">

    <div className="page-content">
      <RescuesOverTimeChart />
      <RescuesBySystemChart />
    </div>
  </PageWrapper>
)





export default Statistics
