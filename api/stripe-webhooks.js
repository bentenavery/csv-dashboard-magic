const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
        
      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('New subscription created:', subscription.id);
  
  // Get customer details
  const customer = await stripe.customers.retrieve(subscription.customer);
  
  // Send welcome email (implement with your email service)
  await sendWelcomeEmail(customer, subscription);
  
  // Log to analytics or database
  console.log(`Trial started for ${customer.email}, ends: ${new Date(subscription.trial_end * 1000)}`);
}

async function handleTrialWillEnd(subscription) {
  console.log('Trial ending soon for subscription:', subscription.id);
  
  // Get customer details
  const customer = await stripe.customers.retrieve(subscription.customer);
  
  // Send trial ending reminder email
  await sendTrialEndingEmail(customer, subscription);
}

async function handlePaymentSucceeded(invoice) {
  if (invoice.billing_reason === 'subscription_cycle') {
    console.log('Subscription payment succeeded:', invoice.subscription);
    
    // Get customer and subscription details
    const customer = await stripe.customers.retrieve(invoice.customer);
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    
    // Send payment confirmation email
    await sendPaymentSuccessEmail(customer, subscription, invoice);
  }
}

async function handlePaymentFailed(invoice) {
  console.log('Payment failed for subscription:', invoice.subscription);
  
  // Get customer details
  const customer = await stripe.customers.retrieve(invoice.customer);
  
  // Send payment failed email with retry instructions
  await sendPaymentFailedEmail(customer, invoice);
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);
  
  // Handle plan changes, trial extensions, etc.
  const customer = await stripe.customers.retrieve(subscription.customer);
  console.log(`Subscription ${subscription.id} updated for ${customer.email}`);
}

async function handleSubscriptionCanceled(subscription) {
  console.log('Subscription canceled:', subscription.id);
  
  // Get customer details
  const customer = await stripe.customers.retrieve(subscription.customer);
  
  // Send cancellation confirmation and feedback request
  await sendCancellationEmail(customer, subscription);
}

// Email functions (integrate with SendGrid, Mailgun, etc.)
async function sendWelcomeEmail(customer, subscription) {
  console.log(`TODO: Send welcome email to ${customer.email}`);
  // Implement with your email service
  // Include trial end date, onboarding links, support info
}

async function sendTrialEndingEmail(customer, subscription) {
  console.log(`TODO: Send trial ending email to ${customer.email}`);
  // Remind about trial ending in 3 days
  // Include benefits of continuing, easy upgrade process
}

async function sendPaymentSuccessEmail(customer, subscription, invoice) {
  console.log(`TODO: Send payment confirmation to ${customer.email}`);
  // Thank them for payment, include receipt, account access
}

async function sendPaymentFailedEmail(customer, invoice) {
  console.log(`TODO: Send payment failed email to ${customer.email}`);
  // Inform about failed payment, include retry link
}

async function sendCancellationEmail(customer, subscription) {
  console.log(`TODO: Send cancellation email to ${customer.email}`);
  // Confirm cancellation, request feedback, offer to pause instead
}

// Configure the API route to accept raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}