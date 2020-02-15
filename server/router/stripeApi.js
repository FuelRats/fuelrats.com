/* eslint-disable global-require, no-magic-numbers, camelcase */
const Router = require('koa-router')



const donationTiers = {
  1: {
    description: 'Every little bit helps! Your contribution will ensure our continuous service to the galaxy. Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins1.png',
  },
  2: {
    description: 'Thank you so much! A donation like this will go a long way towards covering our running costs. Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins5.png',
  },
  3: {
    description: 'Wow! This is a major donation for our sake. A contribution like this offsets our running costs for three whole days! Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins10.png',
  },
  4: {
    description: 'Holy limpet! You sure like to live dangerously! We are most grateful for everything you can give. Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins20.png',
  },
  5: {
    description: 'Mother of rats! Talk about a boatload of generosity! We highly appreciate you going the extra lightyear to help us out. Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins35.png',
  },
}




const internalServerErrorDocument = (error = {}) => {
  return {
    errors: [
      {
        status: 'internal_server',
        code: 500,
        source: {
          message: error.message,
          stack: error.stack,
        },
      },
    ],
  }
}





const prepareResponse = async (ctx, next) => {
  try {
    const apiResponse = await next()

    if (apiResponse) {
      ctx.status = 200
      ctx.type = 'application/json'
      ctx.body = JSON.stringify(apiResponse)
    } else {
      throw new Error('Router received an unprocessable response.')
    }
  } catch (error) {
    ctx.status = error.statusCode || 500
    ctx.type = 'application/json'
    ctx.body = JSON.stringify(internalServerErrorDocument(error))
  }
}





module.exports = (router, env) => {
  const stripe = require('stripe')(env.stripe.secret)

  const stApiRouter = new Router()
  stApiRouter.use(prepareResponse)

  stApiRouter.post('/checkout/donate', (ctx) => {
    const {
      body = {},
    } = ctx.request

    const {
      amount,
      currency,
      email,
      customer,
    } = body

    let tier = 1
    if (amount >= 3500) {
      tier = 5
    } else if (amount >= 2000) {
      tier = 4
    } else if (amount >= 1000) {
      tier = 3
    } else if (amount >= 500) {
      tier = 2
    }

    return stripe.checkout.sessions.create({
      success_url: `${env.publicUrl}/donate/success`,
      cancel_url: `${env.publicUrl}/donate/cancel`,
      submit_type: 'donate',
      payment_method_types: ['card'],
      customer_email: email,
      customer,
      line_items: [{
        name: 'One-time Donation',
        description: donationTiers[tier].description,
        images: [donationTiers[tier].image],
        amount,
        currency,
        quantity: 1,
      }],
    })
  })

  router.use('/st-api', stApiRouter.routes(), stApiRouter.allowedMethods())
}
