/* eslint-disable react/jsx-no-bind */
import { useEffect } from 'react'

import InputFieldset from '~/components/Fieldsets/InputFieldset'
import RescueIdFieldset from '~/components/Fieldsets/RescueIdFieldset'
import RescueDetail from '~/components/Forms/EpicNominationForm/RescueDetail'
import getValidityErrors from '~/helpers/getValidityErrors'
import useCreateEpicApi from '~/hooks/frapi/useCreateEpicApi'
import useSearchRescueApi from '~/hooks/frapi/useSearchRescueApi'
import useForm from '~/hooks/useForm'
import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectRatsByRescueId, selectRescueById } from '~/store/selectors'

import styles from './NominateRescueForm.module.scss'

export default function NominateRescueForm ({ onSuccess, onError }) {
  const [{
    isLoading: isRescueLoading,
    isError: isRescueError,
    rescueId,
  }, searchRescue] = useSearchRescueApi()
  const [{
    isLoading: isCreateLoading,
    isError: isCreateError,
    epicId: createdEpicId,
  }, createEpic] = useCreateEpicApi()

  const rescue = useSelectorWithProps({ rescueId }, selectRescueById)
  const rats = useSelectorWithProps({ rescueId }, selectRatsByRescueId)

  const onChangeRescueUuid = (props) => {
    if (!rescue && getValidityErrors(props.target).length) {
      return
    }
    searchRescue(props.target.value)
  }

  const onSubmit = (props) => {
    createEpic({
      notes: props.attributes.notes,
      rescueId: props.attributes.rescueId,
      nomineeIds: rats.map((rat) => {
        return rat.relationships.user.data.id
      }),
    })
  }

  const {
    Form,
    submitting,
    canSubmit,
  } = useForm({
    data: {
      attributes:
        {
          rescueId: '',
          notes: '',
          epicType: 'RESCUE',
        },
    },
    onSubmit,
  })

  useEffect(() => {
    if (typeof createdEpicId === 'string') {
      onSuccess()
    }
  }, [createdEpicId, onSuccess])

  useEffect(() => {
    if (isCreateError) {
      onError()
    }
  }, [isCreateError, onError])

  return (
    <Form>
      <RescueIdFieldset required id="rescueId" label="ID of the Rescue" name="attributes.rescueId" onChange={onChangeRescueUuid} />

      {rescue && <RescueDetail rescue={rescue} />}
      <div className={styles.fetchingText}>
        {isRescueLoading && 'Fetching rescue, please wait...'}
        {isRescueError && 'Couldn\'t find rescue'}
      </div>
      <InputFieldset required id="notes" label="What did the rat(s) do that makes them so epic?" name="attributes.notes" />

      <fieldset className={styles.submitBtn}>
        <button
          className="red"
          disabled={submitting || isCreateLoading || !canSubmit || !rescue}
          type="submit">
          {(submitting || isCreateLoading) ? 'Submitting...' : 'Submit'}
        </button>
      </fieldset>
    </Form>
  )
}
