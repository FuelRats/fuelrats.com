const HASH_KEY = 'fr.ash'

export default async function getFingerprint () {
  if (typeof window === 'undefined') {
    return null
  }

  let fpHash = localStorage.getItem(HASH_KEY)

  if (!fpHash) {
    const FingerprintJS = await import('@fingerprintjs/fingerprintjs')
    const fpAgent = await FingerprintJS.load()
    const fpResult = await fpAgent.get()

    fpHash = fpResult.visitorId

    localStorage.setItem(HASH_KEY, fpHash)
  }


  return fpHash
}
