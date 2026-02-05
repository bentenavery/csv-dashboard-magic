export default function handler(req, res) {
  res.status(200).json({ 
    message: 'API is working!', 
    method: req.method,
    timestamp: new Date().toISOString(),
    env: {
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasStripePublic: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasPriceId: !!process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    }
  });
}