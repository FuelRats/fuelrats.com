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
    description: 'Explore the Fuel Rats Leaderboard and witness the daring rescues by elite players in the galaxy! Our leaderboard tracks in-game spaceship rescues, showcasing individual accomplishments and contributions of our top rescuers.',
  }
}





export default Leaderboard
