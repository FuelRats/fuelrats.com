import RatLeaderboardTable from '~/components/RatLeaderboardTable'





function Leaderboard () {
  return (
    <div className="page-content">
      <RatLeaderboardTable />
    </div>
  )
}

Leaderboard.getPageMeta = () => {
  return {
    title: 'Leaderboard',
    description: 'Our leaderboard tracks in-game spaceship rescues, showcasing individual accomplishments and contributions of our top rescuers.',
  }
}





export default Leaderboard
