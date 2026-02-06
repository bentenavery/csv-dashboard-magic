const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      email, 
      name, 
      company = '', 
      plan = 'pro' // Default to pro plan
    } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ 
        error: 'Email and name are required' 
      });
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
    res.status(200).json({
      subscriptionId: subscription.id,
      customerId: customer.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      trialEnd: subscription.trial_end,
      status: subscription.status
    });

  } catch (error) {
    console.error('Trial subscription creation failed:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to create trial subscription'
    });
  }
}