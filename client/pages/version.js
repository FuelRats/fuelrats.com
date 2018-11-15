/* globals
     $BUILD_BRANCH:false
     $BUILD_COMMIT:false
     $BUILD_COMMIT_HASH:false
     $BUILD_COMMIT_RANGE:false
     $NODE_VERSION:false
*/

// Module imports
import React from 'react'





// Component imports
import { version, dependencies } from '../../package.json'
import PageWrapper from '../components/PageWrapper'




// Component Constants
const BUILD_BRANCH = $BUILD_BRANCH
const BUILD_COMMIT = $BUILD_COMMIT
const BUILD_COMMIT_HASH = $BUILD_COMMIT_HASH
const BUILD_COMMIT_RANGE = $BUILD_COMMIT_RANGE
const NODE_VERSION = $NODE_VERSION




const Version = () => (
  <PageWrapper title="Version Information" renderHeader={false}>
    <div className="page-content text-mono">
      <span>
        <a className="button compact" href="/version/raw">Raw</a>
      </span>
      <span>
        {'App Version: '}
        <a target="_blank" rel="noopener noreferrer" href={`https://www.github.com/fuelrats/fuelrats.com/${BUILD_COMMIT_RANGE ? `compare/${BUILD_COMMIT_RANGE}` : ''}`}>
          {version}-{BUILD_COMMIT.toLowerCase()}
        </a>
      </span>
      <span>
        {'Node Version: '}
        <a target="_blank" rel="noopener noreferrer" href={`https://github.com/nodejs/node/releases/tag/${NODE_VERSION}`}>
          {NODE_VERSION}
        </a>
      </span>

      Dependencies:
      <br />
      <div className="dependency-list">
        <ul>
          {Object.entries(dependencies).map(([depName, depVer]) => (
            <li key={depName}>
              {depName}{': '}
              <a target="_blank" rel="noopener noreferrer" href={`https://www.npmjs.com/package/${depName}`}>
                {depVer}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </PageWrapper>
)

Version.getInitialProps = ({ query, res }) => {
  if (query.raw === 'raw') {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      version,
      branch: BUILD_BRANCH,
      commit: BUILD_COMMIT_HASH,
      nodeVersion: NODE_VERSION,
      dependencies,
    }))
  }

  return {}
}





export default Version
