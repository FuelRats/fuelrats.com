// Module imports
import React from 'react'





// Component imports
import PageWrapper from '../../components/PageWrapper'
import RescuesTablePanel from '../../components/RescuesTablePanel'





const Rescues = () => (
  <PageWrapper title="Rescues">
    <div className="page-content">
      <RescuesTablePanel />
    </div>
  </PageWrapper>
)

Rescues.authenticationRequired = true

export default Rescues
