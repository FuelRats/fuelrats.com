function AppleAppSiteAssociation () {
  return null
}

AppleAppSiteAssociation.getInitialProps = ({ res }) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({
    webcredentials: {
      apps: ['9X89US848J.com.fuelrats.Dispatch-Board'],
    },
  }))
}





export default AppleAppSiteAssociation
