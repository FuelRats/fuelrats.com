/* eslint-disable react/jsx-no-bind */
import { useState } from 'react'

import RadioFieldset from '~/components/Fieldsets/RadioFieldset'
import NominateRatForm from '~/components/Forms/EpicNominationForm/NominateRatForm'
import NominateRescueForm from '~/components/Forms/EpicNominationForm/NominateRescueForm'
import useForm from '~/hooks/useForm'

import styles from './EpicNominationForm.module.scss'

const radioChildren = [
  {
    label: 'A rat, or group of rats, who performed an epic rescue.',
    title: 'Rescue',
    value: 'RESCUE',
  }, {
    label: 'A rat who has done something awesome!',
    title: 'Rat',
    value: 'RAT',
  },
]

export default function EpicNominationForm () {
  const [type, setType] = useState('RESCUE')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const onSubmit = () => {}
  const onSuccess = () => {
    setSuccess(true)
  }
  const onError = () => {
    setError(true)
  }

  const onTypeChange = (ev) => {
    setType(ev.target.value)
  }

  const {
    Form,
  } = useForm({
    data: {
      attributes: {
        epicType: type,
      },
    },
    onSubmit,
  })


  if (error) {
    return (
      <div className={styles.wrapper}>
        <p>{'There was an error while processing your epic nomination.'}</p>
        <p>{'Please contact a techrat if this issue persists!'}</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className={styles.wrapper}>
        <h3>{'Thanks!'}</h3>
        <p>{'Your epic nomination has been submitted. If approved, the rat(s) nominated will be notified that they are now epic rats!'}</p>
        <p>{'Note that while we track who nominates who, the nominees will never be notified of who made the original nomination for their epic deed.'}</p>
      </div>
    )
  }

  return (
    <>
      {/* This form is not used but is neccesary for the RadioFieldset to function */}
      <Form>
        <RadioFieldset
          id="type"
          label="Who are you nominating for an epic today?"
          name="attributes.epicType"
          options={radioChildren}
          onChange={onTypeChange} />
      </Form>

      {
        type === 'RESCUE' && (
          <NominateRescueForm
            onError={onError}
            onSuccess={onSuccess} />
        )
      }
      {
        type === 'RAT' && (
          <NominateRatForm
            onError={onError}
            onSuccess={onSuccess} />
        )
      }
    </>

  )
}
