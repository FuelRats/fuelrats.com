import apiErrorLocalisations from '~/data/apiErrorLocalisations'


// Maps JSON pointer segments like '/data/attributes/email' → 'Email'.
// Used to produce a sensible default "fieldname is invalid" message when a
// specific override hasn't been provided.
const fieldLabels = {
  name: 'CMDR name',
  nickname: 'Nickname',
  nick: 'Nickname',
  displayNick: 'Display nickname',
  email: 'Email',
  password: 'Password',
  system: 'System',
  platform: 'Platform',
  code: 'Two-factor code',
  token: 'Token',
  response: 'Passkey response',
  secret: 'Secret',
  description: 'Description',
  outcome: 'Outcome',
}


function pointerField (pointer) {
  if (typeof pointer !== 'string') {
    return undefined
  }
  const match = pointer.match(/\/data\/attributes\/([^/]+)/u)
  return match?.[1]
}


/**
 * Convert a JSON:API or OAuth error into a friendly { title, detail } pair.
 *
 * Priority:
 * 1. pointerMessages override keyed by JSON pointer
 * 2. statusMessages override keyed by status string
 * 3. Localised default for the error's status
 * 4. Generic "invalid {field}" when the error has a known pointer
 * 5. The API's own title/detail
 * 6. A last-resort catch-all
 * @param {object} error JSON:API error or OAuth error
 * @param {object} [options]
 * @param {object} [options.pointerMessages] Map of JSON pointer → { title?, detail? }
 * @param {object} [options.statusMessages] Map of status string → { title?, detail? }
 * @param {string} [options.fallbackDetail] Detail to use if nothing else matches
 * @returns {{ title: string, detail: string }}
 */
export default function friendlyApiError (error, options = {}) {
  if (!error) {
    return {
      title: 'Error',
      detail: options.fallbackDetail ?? 'An unexpected error occurred.',
    }
  }

  const { pointerMessages = {}, statusMessages = {}, fallbackDetail } = options
  const pointer = error.source?.pointer
  const status = error.status ?? error.error

  // 1. pointer override
  if (pointer && pointerMessages[pointer]) {
    const override = pointerMessages[pointer]
    return {
      title: override.title ?? apiErrorLocalisations[status]?.title ?? error.title ?? 'Error',
      detail: override.detail,
    }
  }

  // 2. status override
  if (status && statusMessages[status]) {
    const override = statusMessages[status]
    return {
      title: override.title ?? apiErrorLocalisations[status]?.title ?? error.title ?? 'Error',
      detail: override.detail,
    }
  }

  // 3. localised default
  const localised = apiErrorLocalisations[status]

  // 4. generic field-level message for validation errors we don't have specific
  //    mappings for. Only do this for 422/conflict since those are the ones
  //    that typically carry field pointers.
  if ((status === 'unprocessable_entity' || status === 'conflict') && pointer) {
    const field = pointerField(pointer)
    const label = fieldLabels[field] ?? field
    if (label) {
      const verb = status === 'conflict' ? 'is already in use' : 'is invalid'
      return {
        title: localised?.title ?? 'Invalid Data',
        detail: `${label.charAt(0).toUpperCase()}${label.slice(1)} ${verb}.`,
      }
    }
  }

  if (localised) {
    return { ...localised }
  }

  // 5. API-provided title/detail
  if (error.title || error.detail) {
    return {
      title: error.title ?? 'Error',
      detail: error.detail ?? fallbackDetail ?? 'An unexpected error occurred.',
    }
  }

  // 6. OAuth error
  if (error.error_description) {
    return {
      title: 'Error',
      detail: error.error_description,
    }
  }

  // 7. last resort
  return {
    title: 'Error',
    detail: fallbackDetail ?? 'An unexpected error occurred. Please try again.',
  }
}
