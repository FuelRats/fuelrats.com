import frApiProxy from '~/util/server/frApiProxy'
import getEnv from '~/util/server/getEnv'

const env = getEnv()

export default frApiProxy({
  auth: `${env.frapi.clientId}:${env.frapi.clientSecret}`,
})
export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}
