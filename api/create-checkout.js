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
    const { priceId } = requestBody;
    
    // Use the correct price ID from environment or fallback to the real one we created
    const price_id = priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1SxHGMDrwQ40jmgDO7cSLw03';
    
    console.log('Creating checkout session with price:', price_id);
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://chartflow-pied.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://chartflow-pied.vercel.app'}/cancel`,
      metadata: {
        product: 'ChartFlow Pro',
        version: '1.0',
        timestamp: new Date().toISOString()
      }
    });

    console.log('Checkout session created:', session.id);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: session.id, url: session.url })
    };
    
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    
    // Return specific error information
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: error.message,
        code: error.code || 'unknown',
        details: 'Failed to create checkout session',
        timestamp: new Date().toISOString()
      })
    };
  }
}