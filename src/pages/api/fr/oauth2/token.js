import frApiProxy, { config } from '~/util/server/frApiProxy'
import getEnv from '~/util/server/getEnv'





const env = getEnv()





export default frApiProxy({
  auth: `${env.frapi.clientId}:${env.frapi.clientSecret}`,
})
export { config }
