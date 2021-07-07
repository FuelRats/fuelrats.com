import { HttpStatus } from '@fuelrats/web-util/http'
import axios from 'axios'
import getConfig from 'next/config'
import Link from 'next/link'

import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'

// Component constants
const { publicRuntimeConfig } = getConfig()
const { appUrl } = publicRuntimeConfig





function Version ({ version }) {
  const {
    branch,
    versions,
    builtAt,
    buildUrl,
    commit,
  } = version.attributes
  return (
    <div className="page-content">
      <div>
        <Link href="/api/version">
          <a className="button compact">
            {'Raw'}
          </a>
        </Link>
      </div>
      <div className="page-content text-mono">
        <span>
          {'App Version: '}
          <a href={`https://github.com/FuelRats/fuelrats.com/releases/tag/${versions.app}`} rel="noopener noreferrer" target="_blank">
            {versions.app}
          </a>
        </span>
        <span>
          {'Node Version: '}
          <a href={`https://github.com/nodejs/node/releases/tag/${versions.node}`} rel="noopener noreferrer" target="_blank">
            {versions.node}
          </a>
        </span>
        <span>
          {'Built On: '}
          <a href={buildUrl} rel="noopener noreferrer" target="_blank">
            <time dateTime={builtAt}>{formatAsEliteDateTime(builtAt)}</time>
          </a>
        </span>
        <span>
          {'Branch: '}
          <a href={`https://github.com/FuelRats/fuelrats.com/tree/${branch}`} rel="noopener noreferrer" target="_blank">
            {branch}
          </a>
        </span>
        <span>
          {'Commit: '}
          <a href={`https://github.com/FuelRats/fuelrats.com/commit/${commit}`} rel="noopener noreferrer" target="_blank">
            {commit || 'N/A'}
          </a>
        </span>
      </div>
    </div>
  )
}

Version.getInitialProps = async () => {
  const response = await axios.get(`${appUrl}/api/version`)

  return {
    version: response.status === HttpStatus.OK
      ? response.data.data
      : null,
  }
}

Version.getPageMeta = () => {
  return {
    noHeader: true,
    title: 'Version Information',
  }
}




export default Version
