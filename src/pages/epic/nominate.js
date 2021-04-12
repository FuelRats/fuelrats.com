import React from 'react'

import EpicNominationForm from '~/components/Forms/EpicNominationForm/EpicNominationForm'


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
