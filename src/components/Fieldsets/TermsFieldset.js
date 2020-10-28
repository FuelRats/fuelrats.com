import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'
import { useStore } from 'react-redux'

import { useField } from '~/hooks/useForm'
import { getWordpressPage } from '~/store/actions/wordpress'
import { selectWordpressPageBySlug } from '~/store/selectors'

import WordpressTermsModal from '../TermsModal/TermsModal'





export default function TermsFieldset (props) {
  const store = useStore()
  const [openModal, setOpenModal] = useState(false)

  const {
    className,
    prefetch,
    ...inputProps
  } = props

  const onValidate = useCallback((value) => {
    return Boolean(value) || !props.required
  }, [props.required])

  const { value, ctx, submitting } = useField(props.name, { onValidate })
  const { dispatchField } = ctx

  const handleCheckboxClick = useCallback((event) => {
    // Are we trying to set the checkbox to checked? if we are show ToS and Privacy. Otherwise set field and validity to false.
    if (event.target.checked) {
      setOpenModal('terms')
    } else {
      dispatchField({ name: props.name, value: false, valid: false })
    }
  }, [dispatchField, props.name])

  const handleModalCancel = useCallback(() => {
    setOpenModal(false)
  }, [setOpenModal])

  const handleTermsAccept = useCallback(() => {
    setOpenModal('privacy')
  }, [setOpenModal])

  const handlePrivacyAccept = useCallback(() => {
    setOpenModal(false)
    dispatchField({ name: props.name, value: true, valid: true })
  }, [dispatchField, props.name])

  useEffect(() => {
    if (prefetch) {
      [
        'terms-of-service',
        'privacy-policy',
      ].forEach((slug) => {
        if (!selectWordpressPageBySlug(store.getState(), { slug })) {
          store.dispatch(getWordpressPage(slug))
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only update if prefetch updates. we don't care about store updating.
  }, [prefetch])

  return (
    <fieldset>
      <span>
        <input
          aria-label="Terms of Service Agreement Button"
          disabled={submitting}
          {...inputProps}
          checked={Boolean(value)}
          className={['large', className]}
          type="checkbox"
          onChange={handleCheckboxClick} />

        <label htmlFor={props.id}>
          {'I agree that I have read and agree to the  '}
          <Link href="/terms-of-service">
            <a>{'Terms of Service'}</a>
          </Link>
          {' and '}
          <Link href="/privacy-policy">
            <a>{'Privacy Policy'}</a>
          </Link>
          {', and that I am 13 years of age or older.'}
        </label>
      </span>

      <WordpressTermsModal
        checkboxLabel="I have read and agree to these Terms of Service"
        isOpen={openModal === 'terms'}
        slug="terms-of-service"
        title="Terms of Service"
        onAccept={handleTermsAccept}
        onClose={handleModalCancel} />

      <WordpressTermsModal
        checkboxLabel="I have read and agree to this Privacy Policy"
        isOpen={openModal === 'privacy'}
        slug="privacy-policy"
        title="Privacy Policy"
        onAccept={handlePrivacyAccept}
        onClose={handleModalCancel} />
    </fieldset>
  )
}
