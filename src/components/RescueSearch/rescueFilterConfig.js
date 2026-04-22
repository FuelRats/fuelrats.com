const RESCUE_SORT_OPTIONS = [
  { value: '-createdAt', label: 'Created (newest)' },
  { value: 'createdAt', label: 'Created (oldest)' },
  { value: '-updatedAt', label: 'Updated (newest)' },
  { value: 'updatedAt', label: 'Updated (oldest)' },
  { value: 'client', label: 'Client (A-Z)' },
  { value: '-client', label: 'Client (Z-A)' },
  { value: 'system', label: 'System (A-Z)' },
  { value: '-system', label: 'System (Z-A)' },
]

const PLATFORM_OPTIONS = [
  { value: 'pc', label: 'PC', icon: 'tv' },
  { value: 'xb', label: 'XB', icon: ['fab', 'xbox'] },
  { value: 'ps', label: 'PS', icon: ['fab', 'playstation'] },
]

const EXPANSION_OPTIONS = [
  { value: 'horizons3', label: 'Legacy' },
  { value: 'horizons4', label: 'Horizons' },
  { value: 'odyssey', label: 'Odyssey' },
]

const OUTCOME_OPTIONS = [
  { value: 'success', label: 'Success' },
  { value: 'failure', label: 'Failure' },
  { value: 'invalid', label: 'Invalid' },
  { value: 'other', label: 'Other' },
  { value: 'purge', label: 'Trash' },
]

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'closed', label: 'Closed' },
]

const ADMIN_STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'queued', label: 'Queued' },
  { value: 'closed', label: 'Closed' },
]

const initialRescueFilters = {
  client: '',
  system: '',
  platform: '',
  expansion: '',
  outcome: '',
  status: '',
  codeRed: '',
  carrier: '',
  firstLimpet: '',
  rat: '',
  notes: '',
  clientNick: '',
  unfiled: '',
  createdAfter: '',
  createdBefore: '',
  updatedAfter: '',
  updatedBefore: '',
  sort: '-createdAt',
}

function rescueFilterReducer (state, action) {
  if (action.type === 'reset') {
    return initialRescueFilters
  }
  return { ...state, [action.field]: action.value }
}


function buildRescueFilterParams (filters, offset, pageSize) {
  const filter = {}

  if (filters.client.trim()) {
    filter.client = { iLike: `%${filters.client.trim()}%` }
  }
  if (filters.system.trim()) {
    filter.system = { iLike: `%${filters.system.trim()}%` }
  }
  if (filters.platform) {
    filter.platform = filters.platform
  }
  if (filters.expansion) {
    filter.expansion = filters.expansion
  }
  if (filters.outcome) {
    filter.outcome = filters.outcome
  } else {
    filter.or = [{ outcome: { ne: 'purge' } }, { outcome: null }]
  }
  if (filters.status) {
    filter.status = filters.status
  }
  if (filters.codeRed) {
    filter.codeRed = filters.codeRed === 'yes'
  }
  if (filters.carrier) {
    filter.carrier = filters.carrier === 'yes'
  }
  if (filters.notes.trim()) {
    filter.notes = { iLike: `%${filters.notes.trim()}%` }
  }
  if (filters.clientNick?.trim()) {
    filter.clientNick = { iLike: `%${filters.clientNick.trim()}%` }
  }
  if (filters.unfiled === 'yes') {
    filter.status = 'closed'
    filter.outcome = null
  }
  if (filters.createdAfter || filters.createdBefore) {
    filter.createdAt = {}
    if (filters.createdAfter) {
      filter.createdAt.gte = filters.createdAfter
    }
    if (filters.createdBefore) {
      filter.createdAt.lte = `${filters.createdBefore}T23:59:59Z`
    }
  }
  if (filters.updatedAfter || filters.updatedBefore) {
    filter.updatedAt = {}
    if (filters.updatedAfter) {
      filter.updatedAt.gte = filters.updatedAfter
    }
    if (filters.updatedBefore) {
      filter.updatedAt.lte = `${filters.updatedBefore}T23:59:59Z`
    }
  }

  return {
    sort: filters.sort,
    include: 'rats',
    'page[offset]': offset,
    'page[limit]': pageSize,
    filter: JSON.stringify(filter),
  }
}


function getRescueFilterFields (options = {}) {
  const { userRats, crChipClassName, admin } = options

  const fields = [
    { type: 'systemSearch', field: 'system', label: 'System', placeholder: 'e.g. SOL' },
    { type: 'chips', field: 'platform', label: 'Platform', options: PLATFORM_OPTIONS },
    { type: 'chips', field: 'expansion', label: 'Game Mode', options: EXPANSION_OPTIONS },
    { type: 'chips', field: 'status', label: 'Status', options: admin ? ADMIN_STATUS_OPTIONS : STATUS_OPTIONS },
    { type: 'chips', field: 'outcome', label: 'Outcome', options: OUTCOME_OPTIONS },
  ]

  if (userRats?.length > 1) {
    fields.push({
      type: 'chips',
      field: 'rat',
      label: 'Rat',
      options: userRats.map((rat) => {
        return { value: rat.id, label: rat.attributes.name }
      }),
    })
  }

  if (admin) {
    fields.push(
      { type: 'text', field: 'clientNick', label: 'IRC Nick', placeholder: 'Search by IRC nick...' },
    )
  }

  fields.push(
    { type: 'text', field: 'notes', label: 'Notes', placeholder: 'Search notes...' },
    { type: 'dateRange', fieldAfter: 'createdAfter', fieldBefore: 'createdBefore', label: 'Created' },
    { type: 'dateRange', fieldAfter: 'updatedAfter', fieldBefore: 'updatedBefore', label: 'Updated' },
  )

  const footerFields = [
    {
      type: 'toggle', field: 'codeRed', label: 'Code Red only', activeValue: 'yes', chipClassName: crChipClassName,
    },
    { type: 'toggle', field: 'carrier', label: 'Carrier only', activeValue: 'yes' },
  ]

  if (options.showFirstLimpet) {
    footerFields.push({ type: 'toggle', field: 'firstLimpet', label: 'First limpet', activeValue: 'yes' })
  }

  if (admin) {
    footerFields.push({ type: 'toggle', field: 'unfiled', label: 'Unfiled only', activeValue: 'yes' })
  }

  return { fields, footerFields }
}


export {
  RESCUE_SORT_OPTIONS,
  initialRescueFilters,
  rescueFilterReducer,
  buildRescueFilterParams,
  getRescueFilterFields,
}
