import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('💳 Payment successful!', session);
        
        // Here you would typically:
        // 1. Save the customer subscription to your database
        // 2. Send a welcome email
        // 3. Enable Pro features for the user
        
        break;
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        console.log('📋 Subscription updated:', subscription);
        
        // Handle subscription changes (upgrades, downgrades, etc.)
        
        break;
      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        console.log('❌ Subscription canceled:', canceledSubscription);
        
        // Handle subscription cancellation
        // Downgrade user to free plan
        
        break;
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log('✅ Payment succeeded for invoice:', invoice);
        
        // Handle successful recurring payments
        
        break;
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        console.log('❌ Payment failed for invoice:', failedInvoice);
        
        // Handle failed payments
        // Send payment retry email, etc.
        
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}