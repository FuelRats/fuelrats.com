import { authenticated } from '~/components/AppLayout'
import EpicNominationForm from '~/components/Forms/EpicNominationForm/EpicNominationForm'


function EpicNominatePage () {
  return <EpicNominationForm />
}
EpicNominatePage.getPageMeta = () => {
  return {
    title: 'Epic Nomination',
  }
}


export default authenticated(
  'epics.write' /* 'epics.write.me' */,
  'Sorry, you must be a drilled rat to access the nomination page.',
)(EpicNominatePage)
