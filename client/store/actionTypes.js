/* eslint-disable max-classes-per-file */// I know what I'm doing. shut up.





import enumerable from '../helpers/enum'





const readable = (target) => {
  target.read = undefined
  target.search = undefined
  return target
}


const writable = (target) => {
  target.create = undefined
  target.delete = undefined
  target.update = undefined
  return readable(target)
}





@enumerable
@writable
class Decals {
  static redeem
}

@enumerable
@writable
class Epics {}

@enumerable
@readable
class Leaderboard {}

@enumerable
@writable
class Nicknames {}

@enumerable
@writable
class Rats {}

@enumerable
@writable
class Rescues {
  static patchRats
}
@enumerable
@writable
class Ships {}

@enumerable
@writable
class Users {}





@enumerable
class Images {
  static read
  static dispose
}


@enumerable
class Password {
  static reset
  static requestReset
  static update
  static validateReset
}

@enumerable
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





@enumerable
class StripeCart {
  static clear
  static deleteItem
  static read
  static updateItem
}

@enumerable
@writable
class StripeOrders {
  static pay
}

@enumerable
@readable
class StripeProducts {}

@enumerable
class Stripe {
  static cart = StripeCart
  static orders = StripeOrders
  static products = StripeProducts
}



@enumerable
@readable
class Authors {}

@enumerable
@readable
class Categories {}

@enumerable
@readable
class Pages {}

@enumerable
@readable
class Posts {}


@enumerable
class Wordpress {
  static authors = Authors
  static categories = Categories
  static pages = Pages
  static posts = Posts
}





@enumerable
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
