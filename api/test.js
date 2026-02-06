exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      message: 'API is working!', 
      method: event.httpMethod,
      timestamp: new Date().toISOString(),
      env: {
        hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
        hasStripePublic: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        hasPriceId: !!process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        appUrl: process.env.NEXT_PUBLIC_APP_URL
      }
    })
  };
}