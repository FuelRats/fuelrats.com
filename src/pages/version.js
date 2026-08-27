import Link from 'next/link'

import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'

import pkgFile from '../../package.json'


const { version: appVersion } = pkgFile


function Version () {
  return (
    <div className="page-content">
      <div>
        <Link className="button compact" href="/api/version">
          {'Raw'}
        </Link>
      </div>
      <div className="page-content text-mono">
        <span>
          {'App Version: '}
          <a href={`https://github.com/FuelRats/fuelrats.com/releases/tag/v${appVersion}`} rel="noopener noreferrer" target="_blank">
            {`v${appVersion}`}
          </a>
        </span>
        <span>
          {'Node Version: '}
          {
            $$BUILD.nodeVersion
              ? (
                <a href={`https://github.com/nodejs/node/releases/tag/${$$BUILD.nodeVersion}`} rel="noopener noreferrer" target="_blank">
                  {$$BUILD.nodeVersion}
                </a>
              )
              : 'N/A'
          }
        </span>
        <span>
          {'Built On: '}
          {
            $$BUILD.date
              ? (
                <a href={$$BUILD.url} rel="noopener noreferrer" target="_blank">
                  <time dateTime={$$BUILD.date}>{formatAsEliteDateTime($$BUILD.date)}</time>
                </a>
              )
              : 'N/A'
          }
        </span>
        <span>
          {'Branch: '}
          {
            $$BUILD.branch
              ? (
                <a href={`https://github.com/FuelRats/fuelrats.com/tree/${$$BUILD.branch}`} rel="noopener noreferrer" target="_blank">
                  {$$BUILD.branch}
                </a>
              )
              : 'N/A'
          }
        </span>
        <span>
          {'Commit: '}
          {
            $$BUILD.commit
              ? (
                <a href={`https://github.com/FuelRats/fuelrats.com/commit/${$$BUILD.commit}`} rel="noopener noreferrer" target="_blank">
                  {$$BUILD.commit}
                </a>
              )
              : 'N/A'
          }
        </span>
      </div>
    </div>
  )
}

Version.getPageMeta = () => {
  return {
    noHeader: true,
    title: 'Version Information',
  }
}


export default Version
