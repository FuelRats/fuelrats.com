import { useCallback, useMemo, useState } from 'react'




function ifDefined (value, fallback) {
  return typeof value === 'undefined' ? fallback : value
}


function getFieldValues (rescue, rats, changes, dispatcherRats) {
  const getValue = (key) => {
    return ifDefined(changes[key], rescue.attributes[key])
  }

  return {
    carrier: getValue('carrier'),
    client: getValue('client'),
    codeRed: getValue('codeRed'),
    dispatchers: ifDefined(changes.dispatcherRats, dispatcherRats),
    expansion: getValue('expansion'),
    // Get FirstLimpetId object first, then try to get the firstLimpet from
    // the assigned rat array, then from the new rat array.
    firstLimpetId: ifDefined(
      changes.firstLimpetId,
      rats[rescue.relationships.firstLimpet.data?.id] ?? changes.rats?.find((rat) => {
        return rat.id === rescue?.relationships?.firstLimpet.data?.id
      }),
    ) ?? null,
    notes: getValue('notes'),
    outcome: getValue('outcome'),
    platform: getValue('platform'),
    rats: Object.values(ifDefined(changes.rats, rats) ?? {}),
    system: ifDefined(changes.system, rescue.attributes.system ? { value: rescue.attributes.system.toUpperCase() } : null),
  }
}


export function validate (rescue, userCanEdit, changes, values) {
  const errors = {}

  if (!rescue) {
    return { valid: false, errors: { form: 'Rescue Not Found' }, noChange: false }
  }
  if (!userCanEdit) {
    return { valid: false, errors: { form: 'You cannot edit this rescue.' }, noChange: false }
  }

  switch (values.outcome) {
    case 'other':
    case 'invalid':
      if (!values.notes.replace(/\s/gu, '')) {
        errors.notes = 'This outcome requires notes explaining the reason.'
      }
      break

    case 'success':
    case 'failure':
      if (!values.rats || !values.rats.length) {
        errors.rats = 'Must have at least one rat assigned.'
      }
      if (!values.system) {
        errors.system = 'Must have a star system location.'
      }
      if (!values.platform) {
        errors.platform = 'Must have a platform.'
      }
      if (values.outcome === 'success' && !values.firstLimpetId) {
        errors.firstLimpetId = 'Successful rescues must have a first limpet rat.'
      }
      if (values.outcome === 'failure' && !values.notes.replace(/\s/gu, '')) {
        errors.notes = 'Failed cases must have notes explaining what went wrong.'
      }
      break

    default:
      errors.outcome = 'Outcome is not set!'
      break
  }

  const noChange = !Object.keys(errors).length && !Object.keys(changes).length

  return {
    valid: !Object.keys(errors).length && !noChange,
    errors,
    noChange,
  }
}




/**
 * Owns the paperwork form's pending-change state and all the field
 * handlers. Returns the derived field values, a validity object, and the
 * set of handlers that get passed down into the various form fields.
 * @param {object} rescue - The rescue resource object.
 * @param {object} rats - Rats keyed by ID.
 * @param {boolean} userCanEdit - Whether the current user can edit this rescue.
 * @param {object[]} dispatcherRats - Rats currently assigned as dispatchers.
 * @returns {object} Changes state, field values, validity, and handlers.
 */
export default function usePaperworkChanges (rescue, rats, userCanEdit, dispatcherRats = []) {
  const [changes, setChangesState] = useState({})

  const hasUnsavedChanges = Object.values(changes).some((value) => {
    return typeof value !== 'undefined'
  })

  const setChanges = useCallback((changedFields) => {
    setChangesState((prev) => {
      return {
        ...prev,
        ...Object.entries(changedFields).reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]: rescue.attributes[key] === value ? undefined : value,
          }
        }, {}),
      }
    })
  }, [rescue])

  const resetChanges = useCallback(() => {
    setChangesState({})
  }, [])

  const handleChange = useCallback(({ target }) => {
    setChanges({ [target.name]: target.value })
  }, [setChanges])

  const handleNotesChange = useCallback((event) => {
    return setChanges({ notes: event.target.value })
  }, [setChanges])

  const handleRadioInputChange = useCallback(({ target }) => {
    const attribute = target.name
    let { value } = target

    if (value === 'true') {
      value = true
    } else if (value === 'false') {
      value = false
    }

    const extraChanges = {}
    if (attribute === 'platform' && value !== rescue) {
      extraChanges.firstLimpetId = []
      extraChanges.rats = []
    }
    if (attribute === 'outcome' && value !== 'success') {
      extraChanges.firstLimpetId = []
    }

    setChanges({ ...extraChanges, [attribute]: value })
  }, [setChanges, rescue])

  const handleFirstLimpetChange = useCallback((value) => {
    // TagsInput sometimes fires onChange when nothing actually changed.
    if (typeof changes.firstLimpetId === 'undefined' && value.length && value[0].id === rescue.relationships.firstLimpet?.data?.id) {
      return
    }

    let newValue = []
    if (value.length) {
      if (value[0].id === rescue.relationships.firstLimpet?.data?.id) {
        newValue = undefined
      } else {
        newValue = value
      }
    }

    setChanges({ firstLimpetId: newValue })
  }, [changes, rescue, setChanges])

  const handleSystemChange = useCallback((value) => {
    // TagsInput sometimes fires onChange when nothing actually changed.
    if (typeof changes.system === 'undefined' && value.length && value[0].value === rescue.attributes.system) {
      return
    }

    let newValue = null
    if (value.length) {
      if (value[0].value === rescue.attributes.system) {
        newValue = undefined
      } else {
        newValue = value
      }
    }

    setChanges({ system: newValue })
  }, [changes, rescue, setChanges])

  const handleRatsChange = useCallback((value) => {
    setChanges({ rats: value })
  }, [setChanges])

  const handleDispatchersChange = useCallback((selectedRats) => {
    // Store both: rats for TagsInput display, users for submission
    const users = selectedRats.map((rat) => {
      return rat.relationships?.user?.data
    }).filter(Boolean)
    setChangesState((prev) => {
      return { ...prev, dispatchers: users, dispatcherRats: selectedRats }
    })
  }, [])

  const handleRatsRemove = useCallback((rat) => {
    const firstLimpetId = changes.firstLimpetId?.[0]?.id ?? rescue.relationships?.firstLimpet?.data?.id ?? null
    if (rat?.id === firstLimpetId) {
      handleFirstLimpetChange([])
    }
  }, [changes, rescue, handleFirstLimpetChange])

  const fieldValues = useMemo(() => {
    return getFieldValues(rescue, rats, changes, dispatcherRats)
  }, [rescue, rats, changes, dispatcherRats])

  const validity = useMemo(() => {
    return validate(rescue, userCanEdit, changes, fieldValues)
  }, [rescue, userCanEdit, changes, fieldValues])

  return {
    changes,
    fieldValues,
    validity,
    hasUnsavedChanges,
    resetChanges,
    handlers: {
      handleChange,
      handleNotesChange,
      handleRadioInputChange,
      handleFirstLimpetChange,
      handleSystemChange,
      handleRatsChange,
      handleRatsRemove,
      handleDispatchersChange,
    },
  }
}
