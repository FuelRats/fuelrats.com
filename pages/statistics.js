// Component imports
import Page from '../components/Page'
import RescuesBySystemChart from '../components/RescuesBySystemChart'
import RescuesOverTimeChart from '../components/RescuesOverTimeChart'





// Component imports
const title = 'Statistics'





const Statistics = () => (
  <div className="page-wrapper">
    <header className="page-header">
      <h1>{title}</h1>
    </header>

    <div className="page-content">
      <RescuesOverTimeChart />
      <RescuesBySystemChart />
    </div>
  </div>
)





export default Page(Statistics, title)
