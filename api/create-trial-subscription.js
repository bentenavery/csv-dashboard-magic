const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Allow': 'POST'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const requestBody = JSON.parse(event.body || '{}');
    const { 
      email, 
      name, 
      company = '', 
      plan = 'pro' // Default to pro plan
    } = requestBody;
    
    if (!email || !name) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Email and name are required' 
        })
      };
    }

    // Create or retrieve Stripe customer
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });
    
    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          company: company,
          source: 'chartflow_trial_signup'
        }
      });
    }

    // Determine price ID based on plan
    const priceId = plan === 'team' 
      ? process.env.STRIPE_TEAM_PRICE_ID || 'price_team_default'
      : process.env.STRIPE_PRO_PRICE_ID || 'price_pro_default';

    // Create subscription with 14-day trial
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      trial_period_days: 14,
      metadata: {
        plan: plan,
        trial_source: 'website_signup',
        company: company
      }
    });

    // Return subscription details
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscriptionId: subscription.id,
        customerId: customer.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        trialEnd: subscription.trial_end,
        status: subscription.status
      })
    };

  } catch (error) {
    console.error('Trial subscription creation failed:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: error.message,
        details: 'Failed to create trial subscription'
      })
    };
  }
}