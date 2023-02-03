import { HttpStatus } from '@fuelrats/web-util/http'

/*
 * Almost always redirected from '/apple-app-site-Association'
 */
export default function appleAppSiteAssociation (req, res) {
  res.status(HttpStatus.OK).json({
    webcredentials: {
      apps: ['9X89US848J.io.sorlie.Fuel-Rats'],
    },
  })
}
