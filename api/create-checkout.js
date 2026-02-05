const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId } = req.body;
    
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
    res.status(200).json({ id: session.id, url: session.url });
    
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    
    // Return specific error information
    res.status(500).json({ 
      error: error.message,
      code: error.code || 'unknown',
      details: 'Failed to create checkout session',
      timestamp: new Date().toISOString()
    });
  }
}