import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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





// Component Constants
const formData = {
  currency: '',
  amountPreset: 0,
  amount: undefined,
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
  } = data

  const sessionData = {
    currency,
    amount: getAmount(amountPreset, amount),
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
    stripe,
  } = props

  const [errorState, setErrorState] = useState()
  const currentUser = useSelector(withCurrentUserId(selectUserById))

  const dispatch = useDispatch()

  const onSubmit = useCallback(async (data) => {
    const sessionData = await preparePayload(data, currentUser)

    const response = await dispatch(createDonationSession(sessionData))
    const resError = getResponseError(response)
    if (resError) {
      setErrorState(resError)
      return
    }

    try {
      await stripe.redirectToCheckout({ sessionId: response.payload.data.id })
    } catch (redirectError) {
      setErrorState({
        detail: redirectError.message,
      })
    }
  }, [currentUser, dispatch, stripe])

  const { Form, canSubmit, state } = useForm({ data: formData, onSubmit })



  const finalAmount = canSubmit && getMoney(getAmount(state.amountPreset, state.amount), state.currency)

  return (
    <>
      <DonationErrorBox error={errorState} />
      <Form className={['donate-form compact', className]}>
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

        <div className="fieldset">
          <button
            className="green"
            disabled={!canSubmit}
            type="submit">
            {'Donate'}
            {Boolean(canSubmit) && ` ${finalAmount}`}
          </button>
        </div>

        <StripeBadge className="donation-info-badge" />
      </Form>
    </>
  )
}

DonationForm.propTypes = {
  className: PropTypes.string,
  stripe: PropTypes.object,
}





export default DonationForm
