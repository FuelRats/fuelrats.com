import frApiProxy from '~/util/server/frApiProxy'





export default frApiProxy()
export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}
