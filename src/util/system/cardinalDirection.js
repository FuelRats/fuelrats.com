// Cardinal direction calculation matching SwiftSqueak's Vector3.swift bearing logic.
// North = +Z, East = +X. Bearing computed from atan2(originX, originZ).

const CARDINAL_DIRECTIONS = [
  { max: 22.5, label: 'N' },
  { max: 67.5, label: 'NE' },
  { max: 112.5, label: 'E' },
  { max: 157.5, label: 'SE' },
  { max: 202.5, label: 'S' },
  { max: 247.5, label: 'SW' },
  { max: 292.5, label: 'W' },
  { max: 337.5, label: 'NW' },
]

const FULL_CIRCLE = 360
const HALF_CIRCLE = 180
const DIRECTION_THRESHOLD_LY = 1000

export function bearingDegrees (fromCoords, toCoords) {
  const originX = fromCoords.x - toCoords.x
  const originZ = fromCoords.z - toCoords.z
  const radians = Math.atan2(originX, originZ)
  let degrees = (radians * HALF_CIRCLE) / Math.PI
  while (degrees < 0) {
    degrees += FULL_CIRCLE
  }
  return degrees
}

export function bearingToCardinal (degrees) {
  const match = CARDINAL_DIRECTIONS.find((entry) => {
    return degrees < entry.max
  })
  return match?.label ?? 'N'
}

export function getCardinalDirection (systemCoords, landmarkCoords, distanceLy) {
  if (!systemCoords || !landmarkCoords) {
    return null
  }
  if (typeof distanceLy === 'number' && distanceLy < DIRECTION_THRESHOLD_LY) {
    return null
  }
  return bearingToCardinal(bearingDegrees(systemCoords, landmarkCoords))
}
