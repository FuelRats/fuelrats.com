import { HttpStatus } from '@fuelrats/web-util/http'

/*
 * Almost always rewritten from '/.well-known/apple-app-site-Association'
 */
export default function appleAppSiteAssociation (req, res) {
  res.status(HttpStatus.OK).json({
    appLinks: {
      details: [{
        appIDs: ['9X89US848J.io.sorlie.Fuel-Rats'],
        components: [{
          '/': '/verify*',
          comment: 'used for handling password reset links in emails',
        }],
      }],
    },
    webcredentials: {
      apps: ['9X89US848J.io.sorlie.Fuel-Rats'],
    },
  })
}
