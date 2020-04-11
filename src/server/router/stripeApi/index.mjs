/* eslint-disable no-magic-numbers */





// Module imports
import Router from 'koa-router'
import stripeJs from 'stripe'

import prepareResponse from './document'



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





const configureStripeApi = (router) => {
  const stApiRouter = new Router()
  stApiRouter.use(prepareResponse)

  stApiRouter.post('/checkout/donate', (ctx) => {
    const stripe = stripeJs(ctx.state.env.stripe.secret)
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
      success_url: `${ctx.state.env.publicUrl}/donate/success`,
      cancel_url: `${ctx.state.env.publicUrl}/donate/cancel`,
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





export default configureStripeApi
