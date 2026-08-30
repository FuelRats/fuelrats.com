// Human-readable catalog for IRC channel-access FLAGS on a permission group.
//
// The API (api.fuelrats.com groupFlagLetters.mjs) validates flags against this exact
// 26-letter set; lowercase `g` is intentionally NOT valid. Keep the catalog in sync.
//
// Each flag: { letter, label, description, modeGranting }. `modeGranting: true` marks
// the durable auto-status modes applied on join (op/voice/etc). The UI shows the friendly
// label — never a bare letter — as the primary control.

// Authoritative valid set from the API, for the sync check. Order is irrelevant (set equality).
const API_FLAG_LETTERS = 'ABFGHIKNOQUVabcfhikmoqstuv'

const FLAG_CATEGORIES = [
  {
    key: 'status',
    label: 'Status on join',
    description: 'Channel status automatically applied when the member joins.',
    flags: [
      { letter: 'O', label: 'Auto-op', description: 'Opped (@) automatically on join.', modeGranting: true },
      { letter: 'H', label: 'Auto-halfop', description: 'Given halfop (%) automatically on join.', modeGranting: true },
      { letter: 'V', label: 'Auto-voice', description: 'Given voice (+) automatically on join.', modeGranting: true },
      { letter: 'Q', label: 'Auto-owner', description: 'Given owner (~) automatically on join.', modeGranting: true },
      { letter: 'A', label: 'Auto-admin', description: 'Given admin/protect (&) automatically on join.', modeGranting: true },
    ],
  },
  {
    key: 'founder',
    label: 'Founder',
    description: 'Full control of the channel.',
    flags: [
      { letter: 'F', label: 'Founder', description: 'Full founder-level control of the channel.', modeGranting: false },
    ],
  },
  {
    key: 'grant',
    label: 'Grant status to others',
    description: 'Ability to give channel status to other users.',
    flags: [
      { letter: 'o', label: 'Op others', description: 'Op and deop other users.', modeGranting: false },
      { letter: 'h', label: 'Halfop others', description: 'Halfop and dehalfop other users.', modeGranting: false },
      { letter: 'v', label: 'Voice others', description: 'Voice and devoice other users.', modeGranting: false },
      { letter: 'q', label: 'Set owner', description: 'Grant and remove owner status.', modeGranting: false },
      { letter: 'a', label: 'Set admin', description: 'Grant and remove admin/protect status.', modeGranting: false },
    ],
  },
  {
    key: 'moderation',
    label: 'Moderation',
    description: 'Channel moderation commands.',
    flags: [
      { letter: 'b', label: 'Ban', description: 'Ban users from the channel.', modeGranting: false },
      { letter: 'k', label: 'Kick', description: 'Kick users from the channel.', modeGranting: false },
      { letter: 'K', label: 'Manage auto-kick / bad-words', description: 'Manage the auto-kick and bad-words lists.', modeGranting: false },
      { letter: 'N', label: 'Protected from kick', description: 'Cannot be kicked from the channel.', modeGranting: false },
      { letter: 'u', label: 'Unban others', description: 'Remove bans on other users.', modeGranting: false },
      { letter: 'U', label: 'Unban self', description: 'Remove bans that affect oneself.', modeGranting: false },
      { letter: 't', label: 'Change topic', description: 'Change the channel topic.', modeGranting: false },
    ],
  },
  {
    key: 'management',
    label: 'Management',
    description: 'Channel settings and information.',
    flags: [
      { letter: 'f', label: 'Manage access list', description: 'Change the channel access list.', modeGranting: false },
      { letter: 's', label: 'Change channel settings/modes', description: 'Change channel settings, modes, and assignments.', modeGranting: false },
      { letter: 'G', label: 'View channel key', description: 'Retrieve the channel key.', modeGranting: false },
      { letter: 'I', label: 'View channel info', description: 'View detailed channel information.', modeGranting: false },
      { letter: 'i', label: 'Invite / self-invite', description: 'Invite oneself or others into the channel.', modeGranting: false },
      { letter: 'm', label: 'Read channel memos', description: 'Read memos sent to the channel.', modeGranting: false },
      { letter: 'c', label: 'Fantasy (!) commands', description: 'Use in-channel fantasy (!) commands.', modeGranting: false },
      { letter: 'B', label: 'Make ChanServ speak', description: 'Make ChanServ say or act in the channel.', modeGranting: false },
    ],
  },
]

// Letter -> { letter, label, description, modeGranting, category } lookup.
const FLAG_BY_LETTER = {}
// Categorised render order (all valid letters, grouped).
const FLAG_ORDER = []

for (const category of FLAG_CATEGORIES) {
  for (const flag of category.flags) {
    FLAG_BY_LETTER[flag.letter] = { ...flag, category: category.key }
    FLAG_ORDER.push(flag.letter)
  }
}

// Single source of truth for validation, derived from the catalog above.
const VALID_FLAG_SET = new Set(FLAG_ORDER)

const flagLabel = (letter) => {
  return FLAG_BY_LETTER[letter]?.label ?? letter
}

const flagInfo = (letter) => {
  return FLAG_BY_LETTER[letter]
}

// "OV" -> ["Auto-op", "Auto-voice"] (unknown letters fall through as the raw letter).
const describeFlags = (flags) => {
  return Array.from(flags ?? '').map(flagLabel)
}

// True when every character of `flags` is a valid flag letter.
const isValidFlags = (flags) => {
  return Array.from(flags ?? '').every((letter) => {
    return VALID_FLAG_SET.has(letter)
  })
}

export {
  API_FLAG_LETTERS,
  FLAG_CATEGORIES,
  FLAG_ORDER,
  VALID_FLAG_SET,
  flagLabel,
  flagInfo,
  describeFlags,
  isValidFlags,
}

export default FLAG_BY_LETTER
