import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import clsx from 'clsx'
import getConfig from 'next/config'
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import SwitchFieldset from '~/components/Fieldsets/SwitchFieldset'
import StripeBadge from '~/components/StripeBadge'
import useForm from '~/hooks/useForm'
import { createDonationSession } from '~/store/actions/stripe'
import { selectUserById, withCurrentUserId } from '~/store/selectors'
import getFingerprint from '~/util/getFingerprint'
import getResponseError from '~/util/getResponseError'
import getMoney from '~/util/string/getMoney'

import AmountPresetRadioFieldset from './AmountPresetRadioFieldset'
import CurrencyFieldset from './CurrencyFieldset'
import CurrencyRadioFieldset from './CurrencyRadioFieldset'
import DonationErrorBox from './DonationErrorBox'



const { publicRuntimeConfig } = getConfig() ?? {}
const stripePromise = loadStripe(publicRuntimeConfig?.stripeApiPk)


// Component Constants
const formData = {
  currency: '',
  amountPreset: 0,
  amount: undefined,
  recurring: false,
}

const presetAmounts = {
  one: 100,
  five: 500,
  ten: 1000,
  twenty: 2000,
}




const getAmount = (amountPreset, amount) => {
  return presetAmounts[amountPreset] ?? (amount * 100)
}

const preparePayload = async (data, user) => {
  const fingerprint = await getFingerprint()

  const {
    currency,
    amount,
    amountPreset,
    recurring,
  } = data

  const sessionData = {
    currency,
    amount: getAmount(amountPreset, amount),
    recurring: Boolean(recurring),
    fingerprint,
  }

  if (user) {
    const { email, stripeId } = user.attributes

    if (stripeId) {
      sessionData.customer = stripeId
    } else {
      sessionData.email = email
    }
  }

  return sessionData
}




function DonationForm (props) {
  const {
    className,
  } = props

  const [errorState, setErrorState] = useState()
  const [clientSecret, setClientSecret] = useState(null)
  const currentUser = useSelector(withCurrentUserId(selectUserById))

  const dispatch = useDispatch()

  const onSubmit = useCallback(async (data) => {
    setErrorState(undefined)
    setClientSecret(null)
    const sessionData = await preparePayload(data, currentUser)

    const response = await dispatch(createDonationSession(sessionData))
    const resError = getResponseError(response)
    if (resError) {
      setErrorState(resError)
      return
    }

    const secret = response.payload?.data?.attributes?.clientSecret
    if (secret) {
      setClientSecret(secret)
    } else {
      setErrorState({ detail: 'Failed to create checkout session.' })
    }
  }, [currentUser, dispatch])

  const { Form, canSubmit, state } = useForm({ data: formData, onSubmit })



  const finalAmount = canSubmit && getMoney(getAmount(state.amountPreset, state.amount), state.currency)

  if (clientSecret) {
    return (
      <EmbeddedCheckoutProvider
        options={{ clientSecret }}
        stripe={stripePromise}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    )
  }

  return (
    <>
      <DonationErrorBox error={errorState} />
      <Form className={clsx('donate-form compact', className)}>
        <CurrencyRadioFieldset
          required
          id="DonationCurrency"
          label="Select your currency"
          name="currency" />

        {
          state.currency !== '' && (
            <AmountPresetRadioFieldset
              required
              currency={state.currency}
              id="DonationAmountPreset"
              label="Select your amount"
              name="amountPreset" />
          )
        }
        {
          state.amountPreset === 'custom' && (
            <CurrencyFieldset
              required
              id="DonationAmount"
              label="Input your custom amount"
              name="amount" />
          )
        }

        <SwitchFieldset
          id="DonationRecurring"
          label="Make this a monthly donation"
          name="recurring" />

        <div className="fieldset">
          <button
            className="green"
            disabled={!canSubmit}
            type="submit">
            {state.recurring ? 'Donate Monthly' : 'Donate'}
            {Boolean(canSubmit) && ` ${finalAmount}`}
            {Boolean(canSubmit) && state.recurring && '/mo'}
          </button>
        </div>

        <StripeBadge className="donation-info-badge" />
      </Form>
    </>
  )
}

DonationForm.propTypes = {
  className: PropTypes.string,
}




export default DonationForm
