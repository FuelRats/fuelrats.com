let ciEnv = null
const COMMIT_HASH_LENGTH = 10

function getCIEnv () {
  if (!ciEnv) {
    ciEnv = {
      isCi: process.env.CI,
      ciId: process.env.GITHUB_RUN_ID,
      server: process.env.GITHUB_SERVER_URL ?? 'https://github.com',
      repository: process.env.GITHUB_REPOSITORY ?? 'fuelrats/fuelrats.com',
      branch: process.env.GITHUB_REF?.replace(/^refs\/heads\//u, '')?.replace(/\//gu, '-') ?? 'develop',
      commit: process.env.GITHUB_SHA?.toLowerCase(),
      commitShort: process.env.GITHUB_SHA?.slice(0, COMMIT_HASH_LENGTH)?.toLowerCase(),
    }
  }

  return ciEnv
}


module.exports = getCIEnv
