import createJSONAPIReducer from '@fuelrats/web-util/redux-json-api'



const {
  reduce,
  RESOURCE,
  updatesResources,
  deletesResource,
  createsRelationship,
  deletesRelationship,
} = createJSONAPIReducer('fuelrats', {
  decals: { },
  clients: { },
  epics: { },
  groups: { },
  nicknames: { },
  rats: { },
  rescues: { },
  ships: { },
  'rat-statistics': { },
  users: { },
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
