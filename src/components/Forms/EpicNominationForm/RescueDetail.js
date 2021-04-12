import Link from 'next/link'

import { makePaperworkRoute } from '~/helpers/routeGen'
import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectRatsByRescueId } from '~/store/selectors'

import styles from './RescueDetail.module.scss'

export default function RescueDetail (props) {
  const { rescue } = props
  const {
    client,
    codeRed,
    system,
    status,
    platform,
    createdAt,
  } = rescue.attributes

  const rats = useSelectorWithProps({ rescueId: rescue.id }, selectRatsByRescueId)

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{'Rescue details'}</th>
          <th>{'Value'}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>{'Code red'}</b></td>
          <td>{codeRed ? 'Yes' : 'No'}</td>
        </tr>
        <tr>
          <td><b>{'CMDR'}</b></td>
          <td>{client}</td>
        </tr>
        <tr>
          <td><b>{'Platform'}</b></td>
          <td>{platform}</td>
        </tr>
        <tr>
          <td><b>{'CMDR'}</b></td>
          <td>{client}</td>
        </tr>
        <tr>
          <td><b>{'Status'}</b></td>
          <td>{status}</td>
        </tr>
        <tr>
          <td><b>{'System'}</b></td>
          <td>{system}</td>
        </tr>
        <tr>
          <td><b>{'Created'}</b></td>
          <td>{createdAt}</td>
        </tr>
        <tr>
          <td><b>{'Rats'}</b></td>
          <td>
            {
rats.map((rat) => {
  return rat.attributes.name
}).join(', ')
}
          </td>
        </tr>
        <tr>
          <td><b>{'Paperwork'}</b></td>
          <td>
            <Link href={makePaperworkRoute({ rescueId: rescue.id, edit: false })}>
              <a className="button">
                {'paperwork'}
              </a>
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
