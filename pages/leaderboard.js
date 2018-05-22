// Component imports
import Page from '../components/Page'
import RescuesByRatTable from '../components/RescuesByRatTable'





// Component imports
const title = 'Leaderboard'





const Leaderboard = () => (
  <div className="page-wrapper">
    <header className="page-header">
      <h1>{title}</h1>
    </header>

    <div className="page-content">
      <RescuesByRatTable />
    </div>
  </div>
)





export default Page(title, false)(Leaderboard)
