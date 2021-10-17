import { useCallback, useEffect, useState } from 'react'

import InputFieldset from '~/components/Fieldsets/InputFieldset'
import RatTagsInput from '~/components/RatTagsInput'
import useCreateEpicApi from '~/hooks/frapi/useCreateEpicApi'
import useForm from '~/hooks/useForm'
import getRatTag from '~/util/getRatTag'
import { isValidUuidV4 } from '~/util/string/uuidValidator'

import styles from './NominateRatForm.module.scss'


export default function NominateRatForm ({ onSuccess, onError }) {
  const [userId, setUserId] = useState(null)

  const [{
    isLoading: isCreateLoading,
    isError: isCreateError,
    epicId: createdEpicId,
  }, createEpic] = useCreateEpicApi()

  const onSubmit = (props) => {
    createEpic({
      notes: props.attributes.notes,
      nomineeIds: [userId],
    })
  }

  const onChangeRat = useCallback((rats) => {
    if (rats.length !== 1 || !isValidUuidV4(rats[0].relationships.user.data.id)) {
      setUserId(null)
      return
    }

    setUserId(rats[0].relationships.user.data.id)
  }, [setUserId])
  const {
    Form,
    submitting,
    canSubmit,
  } = useForm({
    data: {
      attributes:
        {
          rat: '',
          notes: undefined,
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

      <fieldset>
        <label htmlFor="rat">{"What is the rat's CMDR name?"}</label>

        <RatTagsInput
          data-single
          required
          aria-label="Commander name"
          disabled={submitting}
          id="rat"
          name="attributes.rat"
          valueProp={getRatTag}
          onChange={onChangeRat} />
      </fieldset>

      <InputFieldset required id="notes" label="What did the rat do that makes them so epic?" name="attributes.notes" />

      <fieldset className={styles.submitBtn}>
        <button
          className="red"
          disabled={submitting || isCreateLoading || !canSubmit || !userId}
          type="submit">
          {(submitting || isCreateLoading) ? 'Submitting...' : 'Submit'}
        </button>
      </fieldset>
    </Form>
  )
}
