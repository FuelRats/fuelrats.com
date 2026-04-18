// Maps a star's type/subType/luminosity into a human-readable description.
// Ported from SwiftSqueak/Sources/mechasqueak/SystemsAPI/Star.swift

const SCOOPABLE_CLASSES = ['O', 'B', 'A', 'F', 'G', 'K', 'M']
const SUPERGIANT_LUMINOSITY = ['Iab', 'Ia', 'Ib', 'I']
const GIANT_LUMINOSITY = ['II', 'IIa', 'IIb', 'IIab', 'III', 'IIIa', 'IIIb', 'IIIab']
const SUBGIANT_LUMINOSITY = ['IV', 'IVa', 'IVb', 'IVab']

const SUBTYPE_MAP = {
  'T Tauri Star': 'TTS',
  'Wolf-Rayet Star': 'W',
  'C Star': 'C',
  'S-type Star': 'S',
  'MS-type Star': 'MS',
  'White Dwarf (DA) Star': 'DA',
  'Herbig Ae/Be Star': 'HAeBe',
}

const ALL_CLASSES = ['O', 'B', 'A', 'F', 'G', 'K', 'M', 'L', 'T', 'Y', 'TTS', 'W', 'C', 'S', 'MS', 'DA', 'HAeBe', 'N']

function getSpectralClass (star) {
  const candidate = (star.type === 'Star' && star.subType) ? star.subType : star.type
  if (!candidate) {
    return null
  }

  const [firstWord] = candidate.split(' ')
  if (ALL_CLASSES.includes(firstWord)) {
    return firstWord
  }

  return SUBTYPE_MAP[candidate] ?? null
}

function within (value, list) {
  return value && list.includes(value)
}

const HYPERGIANT_MAG_THRESHOLD = -8
const HYPERGIANT_RADIUS_THRESHOLD = 500

function getStarDescription (star) {
  if (!star) {
    return null
  }

  const spectral = getSpectralClass(star)
  const { luminosity } = star
  const magnitude = star.absoluteMagnitude
  const radius = star.solarRadius ?? 0
  const isHypergiantSize = (typeof magnitude === 'number' && magnitude < HYPERGIANT_MAG_THRESHOLD) || radius > HYPERGIANT_RADIUS_THRESHOLD

  if (within(spectral, ['O', 'B', 'A']) && within(luminosity, SUPERGIANT_LUMINOSITY)) {
    return isHypergiantSize ? 'Blue hypergiant' : 'Blue supergiant'
  }
  if (within(spectral, ['F', 'G']) && within(luminosity, SUPERGIANT_LUMINOSITY)) {
    return isHypergiantSize ? 'Yellow hypergiant' : 'Yellow supergiant'
  }
  if (within(spectral, ['K', 'M']) && within(luminosity, SUPERGIANT_LUMINOSITY)) {
    if (spectral === 'M' && luminosity === 'Ia' && isHypergiantSize) {
      return 'Red hypergiant'
    }
    return 'Red supergiant'
  }

  if (within(spectral, ['O', 'B', 'A']) && within(luminosity, GIANT_LUMINOSITY)) {
    return 'Blue giant'
  }
  if (within(spectral, ['F', 'G']) && within(luminosity, GIANT_LUMINOSITY)) {
    return 'Yellow giant'
  }
  if (within(spectral, ['K', 'M']) && within(luminosity, GIANT_LUMINOSITY)) {
    return 'Red giant'
  }

  if (within(spectral, ['O', 'B', 'A']) && within(luminosity, SUBGIANT_LUMINOSITY)) {
    return 'Blue sub-giant'
  }
  if (within(spectral, ['F', 'G']) && within(luminosity, SUBGIANT_LUMINOSITY)) {
    return 'Yellow sub-giant'
  }
  if (within(spectral, ['K', 'M']) && within(luminosity, SUBGIANT_LUMINOSITY)) {
    return 'Red sub-giant'
  }

  switch (spectral) {
    case 'O': return 'Blue star'
    case 'B': return 'Blue-white star'
    case 'A': return 'White star'
    case 'F': return 'Yellow-white star'
    case 'G': return 'Yellow dwarf'
    case 'K': return 'Orange dwarf'
    case 'M': return 'Red dwarf'
    case 'L':
    case 'T':
    case 'Y':
      return 'Brown dwarf'
    case 'TTS': return 'T Tauri star'
    case 'W': return 'Wolf-Rayet star'
    case 'C': return 'Carbon star'
    case 'S': return 'Cool giant'
    case 'MS': return 'Barium star'
    case 'DA': return 'White dwarf'
    case 'HAeBe': return 'Herbig Ae/Be star'
    case 'N': return 'Neutron star'
    default:
      return star.subType ?? star.type ?? null
  }
}

function isScoopableStar (star) {
  if (star?.isScoopable === true) {
    return true
  }
  const spectral = getSpectralClass(star)
  return spectral ? SCOOPABLE_CLASSES.includes(spectral) : false
}

export { getSpectralClass, getStarDescription, isScoopableStar }
