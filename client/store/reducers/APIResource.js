import actionStatus from '../actionStatus'





const createJSONAPIResourceReducer = (sourceIdent, initialState, resourceTypes) => {
  const updateResourcesReducer = (state, { payload }) => {
    let hasChanged = false
    let nextState = { ...state }

    const resources = [
      ...(Array.isArray(payload.data) ? payload.data : [payload.data]),
      ...(payload.included || []),
    ]

    nextState = resources.reduce((acc, resource) => {
      const {
        type,
        id,
      } = resource

      const resourceType = resourceTypes[type]

      if (resourceType) {
        const targetKey = resourceType.target || resourceType
        hasChanged = true
        return {
          ...acc,
          [targetKey]: {
            ...acc[targetKey],
            [id]: resourceType.resourceReducer ? resourceType.resourceReducer(resource) : { ...resource },
          },
        }
      }
      return acc
    }, nextState)

    return hasChanged ? nextState : state
  }

  const postResourceReducer = (state, action) => {
    let hasChanged = false
    let nextState = { ...state }

    const {
      attributes,
      id,
      type,
    } = action.payload.data

    const resourceType = resourceTypes[type]
    if (resourceType) {
      const targetKey = resourceType.target
      const dependencies = resourceType.dependencies || null

      if (dependencies) {
        nextState = dependencies.reduce((acc, dependency) => {
          const dependencyId = attributes[dependency.idAttribute]
          const dependentObj = nextState[dependency.type][dependencyId]

          if (dependentObj) {
            hasChanged = true

            return {
              ...acc,
              [dependency.type]: {
                ...acc[dependency.type],
                [dependencyId]: {
                  ...dependentObj,
                  relationships: {
                    ...dependentObj.relationships,
                    [targetKey]: {
                      data: [
                        ...dependentObj.relationships[targetKey].data,
                        {
                          id,
                          type,
                        },
                      ],
                    },
                  },
                },
              },
            }
          }

          return acc
        }, nextState)
      }
    }

    return updateResourcesReducer(hasChanged ? nextState : state, action)
  }

  const deleteResourceReducer = (state, { payload }) => {
    let hasChanged = false
    let nextState = { ...state }

    const {
      id,
      type,
    } = payload.data

    const resourceType = resourceTypes[type]

    if (resourceType) {
      const targetKey = resourceType.target || resourceType
      const { dependencies } = resourceType

      if (dependencies) {
        nextState = dependencies.reduce((acc, dependency) => {
          const dependencyId = nextState[targetKey][id].attributes[dependency.idAttribute]
          const dependentObj = nextState[dependency.type][dependencyId]
          if (dependentObj) {
            return {
              ...acc,
              [dependency.type]: {
                ...acc[dependency.type],
                [dependencyId]: {
                  ...dependentObj,
                  relationships: {
                    ...dependentObj.relationships,
                    [targetKey]: {
                      data: dependentObj.relationships[targetKey].data.filter((curValue) => curValue.id !== id),
                    },
                  },
                },
              },
            }
          }
          return acc
        }, nextState)
      }

      delete nextState[targetKey][id]
      hasChanged = true
    }

    return hasChanged ? nextState : state
  }

  return (state = initialState, action) => {
    const {
      request,
      status,
    } = action

    if (request && request.baseUrl === sourceIdent && status === actionStatus.SUCCESS && action.payload && action.payload.data) {
      switch (request.method) {
        case 'delete':
          return deleteResourceReducer(state, action)

        case 'post':
          return postResourceReducer(state, action)

        default:
          return updateResourcesReducer(state, action)
      }
    }
    return state
  }
}





export default createJSONAPIResourceReducer
