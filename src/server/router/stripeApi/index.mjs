/* eslint-disable no-unused-vars */
/* eslint-disable no-magic-numbers */





// Module imports
import Router from 'koa-router'
import stripeJs from 'stripe'

import createControlTower from './TrafficControl'
import authorizeUser from './authorization'
import prepareResponse from './document'

const getDonationItemInfo = (amount) => {
  if (amount >= 3500) {
    return {
      description: 'Mother of rats! Talk about a boatload of generosity! We highly appreciate you going the extra lightyear to help us out. Fly Safe, CMDR o7',
      image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins35.png',
    }
  }

  if (amount >= 2000) {
    return {
      description: 'Holy limpet! You sure like to live dangerously! We are most grateful for everything you can give. Fly Safe, CMDR o7',
      image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins20.png',
    }
  }

  if (amount >= 1000) {
    return {
      description: 'Wow! This is a major donation for our sake. A contribution like this offsets our running costs for three whole days! Fly Safe, CMDR o7',
      image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins10.png',
    }
  }


  if (amount >= 500) {
    return {
      description: 'Thank you so much! A donation like this will go a long way towards covering our running costs. Fly Safe, CMDR o7',
      image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins5.png',
    }
  }

  return {
    description: 'Every little bit helps! Your contribution will ensure our continuous service to the galaxy. Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins1.png',
  }
}

const configureStripeApi = (router) => {
  const trafficControl = createControlTower()
  const stApiRouter = new Router()
  stApiRouter.use(prepareResponse)
  stApiRouter.use(trafficControl)
  stApiRouter.use(authorizeUser)


  stApiRouter.post('/checkout/donate', async (ctx) => {
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

    const donationInfo = getDonationItemInfo(amount)

    ctx.body = await stripe.checkout.sessions.create({
      success_url: `${ctx.state.env.publicUrl}/donate/success`,
      cancel_url: `${ctx.state.env.publicUrl}/donate/cancel`,
      submit_type: 'donate',
      payment_method_types: ['card'],
      customer_email: email,
      customer,
      line_items: [{
        name: 'One-time Donation',
        description: donationInfo?.description,
        images: [donationInfo?.image],
        amount,
        currency,
        quantity: 1,
      }],
    })
  })

  router.use('/st-api', stApiRouter.routes(), stApiRouter.allowedMethods())
}





export default configureStripeApi
