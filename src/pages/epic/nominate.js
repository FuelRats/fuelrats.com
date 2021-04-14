import React from 'react'

import { authenticated } from '~/components/AppLayout'
import EpicNominationForm from '~/components/Forms/EpicNominationForm/EpicNominationForm'


@authenticated('epics.write.me', 'Sorry, you must be a rat to access the nomination page.')
export default class EpicNominatePage extends React.Component {
  static getPageMeta () {
    return {
      title: 'Epic Nomination',
    }
  }

  render () {
    return <EpicNominationForm />
  }
}
