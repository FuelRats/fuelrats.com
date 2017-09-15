# Fuelrats.com
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors)

[![Fuelrats.com dependencies on David DM](https://img.shields.io/david/Fuelrats/fuelrats.com.svg?style=flat-square)](https://david-dm.org/Fuelrats/fuelrats.com)
[![Fuelrats.com climate on Code Climate](https://img.shields.io/codeclimate/github/FuelRats/fuelrats.com.svg?style=flat-square)](https://codeclimate.com/github/FuelRats/fuelrats.com)
[![Fuelrats.com coverage on Coveralls](https://img.shields.io/coveralls/FuelRats/fuelrats.com.svg?style=flat-square)](https://coveralls.io/github/FuelRats/fuelrats.com)

[![Fuelrats.com prod build status on Travis CI](https://img.shields.io/travis/FuelRats/fuelrats.com/master.svg?style=flat-square&label=prod)](https://travis-ci.org/FuelRats/fuelrats.com)
[![Fuelrats.com dev build status on Travis CI](https://img.shields.io/travis/FuelRats/fuelrats.com/master.svg?style=flat-square&label=dev)](https://travis-ci.org/FuelRats/fuelrats.com)

## Setting up

1. Grab the repo
```bash
git clone https://github.com/FuelRats/fuelrats.com.git
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the server
```bash
npm run dev
# or
yarn run dev
```

### Some things you'll need

By default, the website doesn't know much about connecting to the Fuel Rats API or to the Fuel Rats Wordpress. To remedy this, you'll need to set some environment variables:

| Name                      | Purpose |
|---------------------------|---------|
| `FRDC_API_KEY`            | This is your OAuth application's client key or ID |
| `FRDC_API_SECRET`         | This is your OAuth application's client secret |
| `FRDC_API_URL`            | This is the URL at which you can reach the Fuel Rats API |
| `FRDC_WORDPRESS_USERNAME` | This is your Wordpress username |
| `FRDC_WORDPRESS_PASSWORD` | This is your Wordpress application password (this **is** different from your normal Wordpress account password |
| `PORT`                    | This is the port to run the application at |

## Contributors

Check out our [list of contributors](CONTRIBUTORS.md)!
