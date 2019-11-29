/* eslint-disable max-classes-per-file */// I know what I'm doing. shut up.





import { customEnumerable } from '../helpers/enum'

/**
 *  Decorator which turns a class into an enumerable with values that are usable as redux action types.
 */
const actionType = customEnumerable((target, key) => `${target.prototype.constructor.name}/${key.toString()}`.toLowerCase())

/**
 * Adds read properties to the class, then defines it as an actionType domain.
 *
 * @param {Object} target
 */
const readableActionType = (target) => {
  target.read = undefined
  target.search = undefined
  return actionType(target)
}

/**
 * Adds read and write properties to the class, then defines it as an actionType domain class.
 *
 * @param {Object} target
 */
const writableActionType = (target) => {
  target.create = undefined
  target.delete = undefined
  target.update = undefined
  return readableActionType(target)
}





@writableActionType
class Decals {
  static redeem
}

@writableActionType
class Epics {}

@readableActionType
class Leaderboard {}

@writableActionType
class Nicknames {}

@writableActionType
class Rats {}

@writableActionType
class Rescues {
  static patchRats
}

@writableActionType
class Ships {}

@writableActionType
class Users {}





@actionType
class Images {
  static read
  static dispose
}


@actionType
class Password {
  static reset
  static requestReset
  static update
  static validateReset
}

@actionType
class Session {
  static password = Password

  static login
  static logout
  static register

  static initialize

  static read
  static readClientOAuthPage

  static pageChange
  static setFlag
}





@actionType
class StripeCart {
  static clear
  static deleteItem
  static read
  static updateItem
}

@writableActionType
class StripeOrders {
  static pay
}

@readableActionType
class StripeProducts {}

@actionType
class Stripe {
  static cart = StripeCart
  static orders = StripeOrders
  static products = StripeProducts
}



@readableActionType
class WordpressAuthors {}

@readableActionType
class WordpressCategories {}

@readableActionType
class WordpressPages {}

@readableActionType
class WordpressPosts {}


@actionType
class Wordpress {
  static authors = WordpressAuthors
  static categories = WordpressCategories
  static pages = WordpressPages
  static posts = WordpressPosts
}





@actionType
class ActionTypes {
  // API Resources
  static decals = Decals
  static epics = Epics
  static leaderboard = Leaderboard
  static nicknames = Nicknames
  static rats = Rats
  static rescues = Rescues
  static ships = Ships
  static users = Users


  // Special
  static images = Images
  static session = Session


  // Services
  static stripe = Stripe
  static wordpress = Wordpress
}




export default ActionTypes
