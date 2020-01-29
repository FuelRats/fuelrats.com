/* globals
     $BUILD_BRANCH:false
     $BUILD_COMMIT:false
     $BUILD_DATE:false
     $BUILD_URL:false
     $NODE_VERSION:false
     $NEXT_BUILD_ID:false
*/

// Module imports
import moment from 'moment'
import React from 'react'




// Component imports
import { version } from '../../../package.json'
import { PageWrapper } from '../../components/AppLayout'




// Component Constants
const BUILD_BRANCH = $BUILD_BRANCH
const BUILD_COMMIT = $BUILD_COMMIT
const BUILD_DATE = $BUILD_DATE
const BUILD_URL = $BUILD_URL
const NODE_VERSION = $NODE_VERSION
const NEXT_BUILD_ID = $NEXT_BUILD_ID




function Version () {
  return (
    <PageWrapper title="Version Information" noHeader>
      <div className="page-content">
        <span>
          <a className="button compact" href="/version/raw">{'Raw'}</a>
        </span>
        <div className="page-content text-mono">
          <span>
            {'App Version: '}
            <a target="_blank" rel="noopener noreferrer" href={`https://github.com/FuelRats/fuelrats.com/releases/tag/v${version}`}>
              {`v${version}`}
            </a>
          </span>
          <span>
            {'Node Version: '}
            <a target="_blank" rel="noopener noreferrer" href={`https://github.com/nodejs/node/releases/tag/${NODE_VERSION}`}>
              {NODE_VERSION}
            </a>
          </span>
          <span>
            {'Built On: '}
            <a target="_blank" rel="noopener noreferrer" href={BUILD_URL}>
              <time dateTime={BUILD_DATE}>{moment.utc(BUILD_DATE).format('MMMM Do YYYY, hh:mm z')}</time>
            </a>
          </span>
          <span>
            {'Branch: '}
            <a target="_blank" rel="noopener noreferrer" href={`https://github.com/FuelRats/fuelrats.com/tree/${BUILD_BRANCH}`}>
              {BUILD_BRANCH}
            </a>
          </span>
          <span>
            {'Commit: '}
            <a target="_blank" rel="noopener noreferrer" href={`https://github.com/FuelRats/fuelrats.com/commit/${BUILD_COMMIT}`}>
              {BUILD_COMMIT || 'null'}
            </a>
          </span>
        </div>
      </div>
    </PageWrapper>
  )
}

Version.getInitialProps = ({ asPath, res }) => {
  if (asPath.includes('/raw')) {
    res.setHeader('Content-Type', 'application/vnd.api+json')
    res.end(JSON.stringify({
      data: {
        id: NEXT_BUILD_ID,
        type: 'frWebBuilds',
        attributes: {
          branch: BUILD_BRANCH || 'develop',
          builtOn: BUILD_DATE,
          commit: BUILD_COMMIT || null,
          version: `v${version}`,
        },
      },

    }))
  }

  return {}
}





export default Version
