const USER_SORT_OPTIONS = [
  { value: '-createdAt', label: 'Created (newest)' },
  { value: 'createdAt', label: 'Created (oldest)' },
  { value: '-updatedAt', label: 'Updated (newest)' },
  { value: 'updatedAt', label: 'Updated (oldest)' },
  { value: 'email', label: 'Email (A-Z)' },
  { value: '-email', label: 'Email (Z-A)' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'legacy', label: 'Legacy' },
  { value: 'deactivated', label: 'Deactivated' },
]

const initialUserFilters = {
  email: '',
  nickname: '',
  status: '',
  suspended: '',
  createdAfter: '',
  createdBefore: '',
  sort: '-createdAt',
}

function userFilterReducer (state, action) {
  if (action.type === 'reset') {
    return initialUserFilters
  }
  return { ...state, [action.field]: action.value }
}


function buildUserFilterParams (filters, offset, pageSize) {
  const filter = {}

  if (filters.email.trim()) {
    filter.email = { iLike: `%${filters.email.trim()}%` }
  }
  if (filters.status) {
    filter.status = filters.status
  }
  if (filters.suspended === 'yes') {
    filter.suspended = { ne: null }
  } else if (filters.suspended === 'no') {
    filter.suspended = null
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

  return {
    sort: filters.sort,
    include: 'rats,groups',
    'page[offset]': offset,
    'page[limit]': pageSize,
    filter: JSON.stringify(filter),
  }
}


function getUserFilterFields () {
  const fields = [
    { type: 'text', field: 'nickname', label: 'IRC Nickname', placeholder: 'Search by IRC nick...' },
    { type: 'chips', field: 'status', label: 'Status', options: STATUS_OPTIONS },
    { type: 'dateRange', fieldAfter: 'createdAfter', fieldBefore: 'createdBefore', label: 'Created' },
  ]

  const footerFields = [
    { type: 'toggle', field: 'suspended', label: 'Suspended only', activeValue: 'yes' },
  ]

  return { fields, footerFields }
}


export {
  USER_SORT_OPTIONS,
  initialUserFilters,
  userFilterReducer,
  buildUserFilterParams,
  getUserFilterFields,
}
