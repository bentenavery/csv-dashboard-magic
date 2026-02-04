#!/usr/bin/env node

/**
 * 🚀 LIVE CHARTFLOW STRIPE SETUP
 * Real-time configuration as user provides keys
 */

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function liveStripeSetup() {
  console.log('🚀 CHARTFLOW LIVE STRIPE SETUP');
  console.log('===============================\n');
  
  console.log('💡 Open https://dashboard.stripe.com in another tab\n');
  
  // Get publishable key
  const publishableKey = await question('📋 Paste your Stripe PUBLISHABLE key (pk_test_... or pk_live_...): ');
  
  if (!publishableKey.startsWith('pk_')) {
    console.log('❌ Invalid publishable key format. Should start with pk_test_ or pk_live_');
    rl.close();
    return;
  }
  
  // Get secret key
  const secretKey = await question('🔑 Paste your Stripe SECRET key (sk_test_... or sk_live_...): ');
  
  if (!secretKey.startsWith('sk_')) {
    console.log('❌ Invalid secret key format. Should start with sk_test_ or sk_live_');
    rl.close();
    return;
  }
  
  console.log('\n✅ Keys look good! Now let\'s create your ChartFlow Pro product...\n');
  
  console.log('📍 In Stripe Dashboard → Products → Add product:');
  console.log('   Name: "ChartFlow Pro"');
  console.log('   Description: "Unlimited dashboards with premium features"');
  console.log('   Price: $20.00 USD');
  console.log('   Billing: Monthly recurring\n');
  
  const priceId = await question('💰 Paste your PRICE ID (price_...): ');
  
  if (!priceId.startsWith('price_')) {
    console.log('❌ Invalid price ID format. Should start with price_');
    rl.close();
    return;
  }
  
  // Update .env.local with real keys
  const envContent = `# Stripe Configuration - LIVE KEYS
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${publishableKey}
STRIPE_SECRET_KEY=${secretKey}
NEXT_PUBLIC_STRIPE_PRICE_ID=${priceId}
STRIPE_WEBHOOK_SECRET=whsec_to_be_configured_after_deployment

# App Configuration
NEXT_PUBLIC_APP_URL=https://chartflow.vercel.app

# Supabase Configuration (Optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
`;

  fs.writeFileSync('.env.local', envContent);
  
  console.log('\n🎉 ENVIRONMENT CONFIGURED WITH LIVE KEYS!');
  console.log('✅ .env.local updated with your Stripe configuration\n');
  
  // Test the keys
  console.log('🧪 Testing Stripe connection...');
  
  try {
    const stripe = require('stripe')(secretKey);
    
    // Test API connection
    const account = await stripe.accounts.retrieve();
    console.log(`✅ Connected to Stripe account: ${account.business_profile?.name || account.id}`);
    console.log(`✅ Account status: ${account.charges_enabled ? 'READY FOR PAYMENTS' : 'PENDING VERIFICATION'}`);
    
    // Verify price
    const price = await stripe.prices.retrieve(priceId);
    console.log(`✅ Price verified: $${price.unit_amount / 100} ${price.currency.toUpperCase()} ${price.recurring?.interval || 'one-time'}`);
    
    // Test checkout session creation
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://chartflow.vercel.app/success',
      cancel_url: 'https://chartflow.vercel.app/cancel',
      metadata: { test: 'true' }
    });
    
    console.log(`✅ Test checkout session created: ${session.id}`);
    console.log(`💳 Payment URL: ${session.url}\n`);
    
    console.log('🚀 CHARTFLOW IS NOW READY FOR PAYMENTS!');
    console.log('=======================================');
    console.log('✅ Stripe integration: COMPLETE');
    console.log('✅ $20/month subscriptions: READY');
    console.log('✅ Payment processing: LIVE');
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Deploy ChartFlow with these settings');
    console.log('2. Test payment with card: 4242 4242 4242 4242');
    console.log('3. Set up webhooks after deployment');
    console.log('4. Launch marketing to get customers!');
    
  } catch (error) {
    console.log(`❌ Stripe test failed: ${error.message}`);
    
    if (error.message.includes('Invalid API key')) {
      console.log('💡 Check your secret key is correct');
    } else if (error.message.includes('No such price')) {
      console.log('💡 Check your price ID is correct');
    }
  }
  
  rl.close();
}

liveStripeSetup().catch(console.error);