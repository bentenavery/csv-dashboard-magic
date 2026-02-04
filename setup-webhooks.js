#!/usr/bin/env node

/**
 * 🪝 ChartFlow Webhook Setup Automation
 * 
 * Automatically configures Stripe webhooks for production deployment
 */

require('dotenv').config({ path: '.env.local' });
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function setupWebhooks() {
  console.log('🪝 CHARTFLOW STRIPE WEBHOOK SETUP\n');

  // Get the deployed app URL
  const appUrl = await question('Enter your deployed ChartFlow URL (e.g., https://chartflow-xyz.vercel.app): ');
  
  if (!appUrl.startsWith('http')) {
    console.log('❌ Please enter a full URL starting with https://');
    rl.close();
    return;
  }

  // Check if Stripe is configured
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey || stripeSecretKey.includes('YOUR_') || stripeSecretKey.includes('XxX')) {
    console.log('❌ Please configure real Stripe API keys in .env.local first');
    rl.close();
    return;
  }

  try {
    const stripe = require('stripe')(stripeSecretKey);
    
    console.log('\n🔧 Setting up webhook endpoint...');
    
    // Create webhook endpoint
    const webhook = await stripe.webhookEndpoints.create({
      url: `${appUrl}/api/stripe-webhook`,
      enabled_events: [
        'checkout.session.completed',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.payment_succeeded',
        'invoice.payment_failed'
      ],
      description: 'ChartFlow payment processing webhook'
    });

    console.log('✅ Webhook endpoint created successfully!');
    console.log(`📡 Webhook URL: ${webhook.url}`);
    console.log(`🔑 Webhook ID: ${webhook.id}`);
    console.log(`🔐 Signing Secret: ${webhook.secret}`);
    
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Add this to your production environment variables:');
    console.log(`   STRIPE_WEBHOOK_SECRET=${webhook.secret}`);
    console.log('2. Redeploy your app with the updated environment variable');
    console.log('3. Test the webhook by making a test payment');
    
    console.log('\n🧪 TEST THE WEBHOOK:');
    console.log('1. Go to your ChartFlow site');
    console.log('2. Click "Upgrade to Pro"'); 
    console.log('3. Use test card: 4242 4242 4242 4242');
    console.log('4. Check Stripe Dashboard → Webhooks → Events for delivery');
    
    console.log('\n🎉 ChartFlow payment system is now fully configured!');
    
  } catch (error) {
    console.log(`❌ Error setting up webhook: ${error.message}`);
    
    if (error.message.includes('Invalid API key')) {
      console.log('\n💡 Make sure you have real Stripe API keys in .env.local');
    }
  }
  
  rl.close();
}

// Auto-setup if app URL is provided as argument
if (process.argv[2]) {
  const appUrl = process.argv[2];
  
  if (!appUrl.startsWith('http')) {
    console.log('❌ Please provide a full URL: node setup-webhooks.js https://your-app.vercel.app');
    process.exit(1);
  }
  
  console.log(`🪝 Setting up webhooks for: ${appUrl}`);
  
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey || stripeSecretKey.includes('YOUR_') || stripeSecretKey.includes('XxX')) {
    console.log('❌ Please configure real Stripe API keys in .env.local first');
    process.exit(1);
  }

  (async () => {
    try {
      const stripe = require('stripe')(stripeSecretKey);
      
      const webhook = await stripe.webhookEndpoints.create({
        url: `${appUrl}/api/stripe-webhook`,
        enabled_events: [
          'checkout.session.completed',
          'customer.subscription.updated', 
          'customer.subscription.deleted',
          'invoice.payment_succeeded',
          'invoice.payment_failed'
        ]
      });

      console.log('✅ Webhook created successfully!');
      console.log(`🔐 Add to production: STRIPE_WEBHOOK_SECRET=${webhook.secret}`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  })();
} else {
  setupWebhooks();
}

module.exports = { setupWebhooks };