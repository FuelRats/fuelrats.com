import FirstLimpetInput from '~/components/FirstLimpetInput'
import RadioInput from '~/components/RadioInput'
import RatName from '~/components/RatName'
import RatTagsInput from '~/components/RatTagsInput'
import SystemTagsInput from '~/components/SystemTagsInput'
import platformRadioOptions from '~/data/platformRadioOptions'
import { expansionLongRadioOptions } from '~/util/expansion'
import getRatTag from '~/util/getRatTag'




const carrierRadioOptions = [
  { value: 'true', label: 'Yes', title: 'The client is on a fleet carrier.' },
  { value: 'false', label: 'No', title: 'The client is not on a fleet carrier.' },
]

const codeRedRadioOptions = [
  { value: 'true', label: 'Yes', title: '$#!7 was on fire, yo.' },
  { value: 'false', label: 'No', title: 'The client did not experience any undue stress.' },
]

const outcomeRadioOptions = [
  { value: 'success', label: 'Yes', title: 'Fuel was successfully delivered to the client.' },
  { value: 'failure', label: 'No', title: 'Fuel wasn\'t successfully delivered to the client. (Explain why)' },
  { value: 'invalid', label: 'Invalid', title: 'Fuel wasn\'t delivered because the request was illegitimate. (Cats / Trolling)' },
  { value: 'other', label: 'Other', title: 'Fuel wasn\'t delivered because the client was able to get out of trouble without it. (Explain)' },
]


const FIELD_ERROR_STYLE = {
  display: 'block',
  color: '#d65050',
  marginTop: '0.3rem',
}


function FieldError ({ message }) {
  if (!message) {
    return null
  }
  return <small className="field-error" style={FIELD_ERROR_STYLE}>{message}</small>
}




function PaperworkFormFields (props) {
  const {
    submitting, fieldValues, errors, handlers, lastEditRat,
  } = props
  const {
    carrier,
    client,
    codeRed,
    dispatchers,
    expansion,
    firstLimpetId,
    notes,
    outcome,
    platform,
    rats,
    system,
  } = fieldValues

  return (
    <>
      <fieldset>
        <label htmlFor="client">{'Client CMDR name'}</label>
        <input
          aria-label="Client CMDR name"
          disabled={submitting}
          id="client"
          name="client"
          type="text"
          value={client}
          onChange={handlers.handleChange} />
      </fieldset>

      <fieldset>
        <label htmlFor="platform">{'What platform was the rescue on?'}</label>
        <RadioInput
          className="platform"
          disabled={submitting}
          id="platform"
          name="platform"
          options={platformRadioOptions}
          value={platform}
          onChange={handlers.handleRadioInputChange} />
        <FieldError message={errors.platform} />
      </fieldset>

      {
        platform === 'pc' && (
          <fieldset>
            <label htmlFor="expansion">{'Which game version?'}</label>
            <RadioInput
              className="expansion"
              disabled={submitting}
              id="expansion"
              name="expansion"
              options={expansionLongRadioOptions}
              value={expansion}
              onChange={handlers.handleRadioInputChange} />
          </fieldset>
        )
      }

      <fieldset>
        <label htmlFor="outcome-success">
          {'Was the rescue successful?'}
          <a
            className="inline"
            href="https://t.fuelr.at/caseguide"
            rel="noopener noreferrer"
            target="_blank"
            title="How to file cases - Fuel Rats Confluence">
            <small>{' (How do I choose?)'}</small>
          </a>
        </label>
        <RadioInput
          className="outcome"
          disabled={submitting}
          id="outcome"
          name="outcome"
          options={outcomeRadioOptions}
          value={outcome}
          onChange={handlers.handleRadioInputChange} />
        <FieldError message={errors.outcome} />
      </fieldset>

      <fieldset>
        <label htmlFor="codeRed-yes">{'Was it a code red?'}</label>
        <RadioInput
          className="codeRed"
          disabled={submitting}
          id="codeRed"
          name="codeRed"
          options={codeRedRadioOptions}
          value={String(codeRed)}
          onChange={handlers.handleRadioInputChange} />
      </fieldset>

      <fieldset>
        <label htmlFor="carrier-yes">{'Was it a carrier rescue?'}</label>
        <RadioInput
          className="carrier"
          disabled={submitting}
          id="carrier"
          name="carrier"
          options={carrierRadioOptions}
          value={String(carrier)}
          onChange={handlers.handleRadioInputChange} />
      </fieldset>

      <fieldset>
        <label htmlFor="rats">{'Who was assigned to this rescue?'}</label>
        <RatTagsInput
          aria-label="Assigned rats"
          data-platform={platform}
          disabled={submitting}
          name="rats"
          value={rats}
          valueProp={getRatTag}
          onChange={handlers.handleRatsChange}
          onRemove={handlers.handleRatsRemove} />
        <FieldError message={errors.rats} />
      </fieldset>

      <fieldset>
        <label htmlFor="firstLimpetId">{'Who fired the first limpet?'}</label>
        <FirstLimpetInput
          data-single
          disabled={submitting || (outcome !== 'success')}
          name="firstLimpetId"
          options={rats}
          value={firstLimpetId}
          valueProp={getRatTag}
          onChange={handlers.handleFirstLimpetChange} />
        <FieldError message={errors.firstLimpetId} />
      </fieldset>

      <fieldset>
        <label htmlFor="system">
          {'Where did it happen? '}
          <small>{'In what star system did the rescue took place? (put "n/a" if not applicable)'}</small>
        </label>
        <SystemTagsInput
          data-allownew
          data-single
          aira-label="Rescue system"
          disabled={submitting}
          name="system"
          value={system}
          onChange={handlers.handleSystemChange} />
        <FieldError message={errors.system} />
      </fieldset>

      <fieldset>
        <label htmlFor="notes">{'Notes'}</label>
        <textarea
          aria-label="case notes"
          disabled={submitting}
          id="notes"
          name="notes"
          value={notes}
          onChange={handlers.handleNotesChange} />
        <FieldError message={errors.notes} />
      </fieldset>

      <fieldset>
        <label htmlFor="dispatchers">{'Dispatcher(s)'}</label>
        <RatTagsInput
          aria-label="Dispatchers"
          disabled={submitting}
          name="dispatchers"
          placeholder="Search by rat name..."
          value={dispatchers}
          valueProp={getRatTag}
          onChange={handlers.handleDispatchersChange} />
      </fieldset>

      {
        lastEditRat && (
          <fieldset>
            <label>{'Last Edited By'}</label>
            <RatName rat={lastEditRat} size={20} />
          </fieldset>
        )
      }
    </>
  )
}




export default PaperworkFormFields
