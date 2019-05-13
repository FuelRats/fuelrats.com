# FR.com Redux Selector Spec v1

This document aims to explain the concept and implementation of selectors as they exist within the fuelrats.com repository.


## Core Concepts

Selectors are resuable functions which refine the global state object (or simply `state`) down to readily usable data. Selectors may be used in any component, class, or even by other selectors if needed.

The ultimate goals of selectors are to:
* Prevent code duplication when mapping state to components,
* Abstract complex logic into convenient functions,
* Decrease the cost of refactoring global state,
* And to increase overall application performance via memoization (see: Memoized Selectors).





## Basic Rules

* Selectors **MUST** be pure functions.
  * Meaning the function, given the same input, always returns the same result with no side-effects.
* Selectors **MUST** accept state as the first argument
* Selectors **MAY** accept the component's props as the second argument.
  * Passing the component's props may also be emulated by the calling function, as long as the second argument is either `undefined` or an object.
* Selectors **MUST** return with **ONE** of the following:
  * `null` when data does not exist or should not be returned to the calling function.
  * An object or value which corresponds to the name of the function.
  * An array or collection of objects or values which corresponds to the name of the function.
* Selectors which would normally result in a new object instance upon every return (IE: using `array.prototype.map` to map data) **MUST** be a memoized selector.





## Types of Selectors


### Simple Selectors

Simple selectors are basic functions which simply return data at a specific location in state.

For example, If we have a state object like:
```javascript
{
  ...
  rats: {
    rats: {...},
    count: 15,
  },
  ...
}
```

A selector which gets all rats in state would look like:
```javascript
const selectRats = (state) => state.rats.rats
```

Alternatively, if we want to select a specific rat, we may also accept component props which contain a rat's id

```javascript
const selectRatById = (state, props) => state.rats.rats[props.ratId]
```





### Memoized Selectors

Memoized selectors leverage the `reselect` package to memoize data produced by more complex mapping logic which uses functions like `array.prototype.map` and `array.prototype.reduce`.

Say the global state from the example above also contains the following:
```javascript
{
  ...
  user: {
    id: '972380a5-4530-4a09-90c9-c719e2393ff2',
    type: 'users',
    attributes: {...},
    relationships: {
      rats: {
        data: [/*list of JSONAPI resource references*/]
      },
    },
  },
  ...
}
```
Say we want to get all of the rats belonging to the user. We would do so like this:

```javascript

const selectUser = (state) => state.user

const selectUserRats = createSelector(
  [selectUser, selectRats],
  (user, rats) => user.relationships.rats.data.map((ratRef) => rats[ratRef.id])
)

```
Since functions like `array.prototype.map` and `array.prototype.reduce` always produce a new object instance, any change in global state will result in a re-render of components using the resulting data. By using `createSelector`, we create a function which stores the result of it's second argument, and returns that value if the input data (first argument) is the same. This document is not an exhuaustive guide on how to use `reselect` and `createSelector()`. For more on this topic, [read the reselect documentation][reselect-documentation]





## Naming Selectors

Selector names, as they exist within this repository, should follow this general pattern:

```
select<Resource>[SubResource...][By<PropName>]
```

Selector names must also follow these rules:

* Selectors **MUST** begin with the word `select`
* The primary resource **MUST** be a valid top-level state object.
* There **MAY** be one or multiple sub-resources, but less is considered better.
* If the selector uses a componet prop, the prop name **MUST** be specified.
    * if the prop name is prefixed by the primary resource, and there are no sub-resources, the prefix may be omitted. IE: if the prop name is `ratId`, the selector may be named `selectRatById` instead of `selectRatByRatId`. Avoid names like `selectRatShipsById`. A selector like this might be better named something like `selectShipsByRatId`.

Some examples:
```javascript
// selects the user in state.
selectUser

// selects all rats in state.
selectRats

// selects the user's rats.
selectUserRats

// selects a rat's ships.
selectShipsByRatId

// selects a single rat by the rat's ID.
selectRatById
```

## Further Reading

* [Reselect][reselect-documentation]
* [Redux docs on selectors][redux-computing-derived]


[reselect-documentation]: https://github.com/reduxjs/reselect
[redux-computing-derived]: https://redux.js.org/recipes/computing-derived-data
