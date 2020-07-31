import createJSONAPIReducer from '@fuelrats/web-util/redux-json-api'

import deepMergeResource from '~/helpers/deepMergeResource'





const {
  reduce,
  RESOURCE,
  updatesResources,
  deletesResource,
  createsRelationship,
  deletesRelationship,
} = createJSONAPIReducer('fuelrats', {
  decals: { },
  epics: { },
  groups: { },
  nicknames: { },
  rats: { },
  rescues: { },
  ships: { },
  'user-statistics': { },
  users: {
    mergeMethod: (state, target, source) => {
      if (state?.session?.userId === target.id) {
        return deepMergeResource(target, source)
      }

      return Object.assign(target, source)
    },
  },
  profiles: {
    target: 'users',
    reducer: (resource) => {
      return { ...resource, type: 'users' }
    },
  },
})





export {
  reduce as reduceJSONAPIResources,
  RESOURCE,
  updatesResources,
  deletesResource,
  createsRelationship,
  deletesRelationship,
}
