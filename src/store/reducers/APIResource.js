import { produce } from 'immer'





import { HttpStatus } from '../../helpers/HttpStatus'





const createJSONAPIResourceReducer = (sourceIdent, initialState, resourceTypes) => {
  const withResourceType = (reducerFunc) => {
    return (draftState, resource) => {
      let resourceType = resourceTypes[resource.type]
      if (resourceType) {
        if (typeof resourceType === 'string') {
          resourceType = { target: resourceType }
        }

        reducerFunc(draftState, resource, resourceType)
      }
    }
  }

  const updateResource = withResourceType((draftState, resource, resourceType) => {
    const { target, resourceReducer } = resourceType
    draftState[target][resource.id] = resourceReducer ? resourceReducer(resource) : resource
  })

  const createResource = withResourceType((draftState, resource, resourceType) => {
    updateResource(draftState, resource, resourceType)


    const { target, dependencies } = resourceType

    if (dependencies) {
      const { id, type } = resource
      dependencies.forEach((dependency) => {
        const dependentObjId = draftState[target][id].attributes[dependency.idAttribute]
        const dependentObj = draftState[dependency.type][dependentObjId]
        if (dependentObj) {
          dependentObj.relationships[target].data.push({ id, type })
        }
      })
    }
  })

  const deleteResource = withResourceType((draftState, resource, resourceType) => {
    const { id } = resource
    const { target, dependencies } = resourceType

    if (dependencies) {
      dependencies.forEach((dependency) => {
        const dependentObjId = draftState[target][id].attributes[dependency.idAttribute]
        const dependentObj = draftState[dependency.type][dependentObjId]
        if (dependentObj) {
          dependentObj.relationships[target].data = dependentObj.relationships[target].data.filter((curValue) => {
            return curValue.id !== id
          })
        }
      })
    }

    delete draftState[target][id]
  })

  return produce((draftState, action) => {
    const {
      response,
      request,
      payload,
    } = action

    if (request && request.baseUrl === sourceIdent && HttpStatus.isSuccess(response.status)) { // Check if this action is a result of a HTTP request we care about
      if (payload && payload.data) { // Double check that the payload contains processible data
        const { data } = payload

        if (Array.isArray(data)) {
          data.forEach((resource) => {
            updateResource(draftState, resource)
          })
        } else {
          switch (request.method) {
            case 'post':
              createResource(draftState, data)
              break

            case 'delete':
              deleteResource(draftState, data)
              break

            case 'put':
            case 'get':
              updateResource(draftState, data)
              break

            default:
              break
          }
        }

        if (payload.included) {
          payload.included.forEach((resource) => {
            updateResource(draftState, resource)
          })
        }
      }
    }
  }, initialState)
}





export default createJSONAPIResourceReducer
