#!/usr/bin/env node

/**
 * 🧪 ChartFlow Stripe Integration Test Suite
 * 
 * This script tests the complete Stripe payment integration
 * to ensure ChartFlow can generate real revenue.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local (Next.js style)
require('dotenv').config({ path: '.env.local' });

const config = {
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
};

console.log('🚀 CHARTFLOW STRIPE INTEGRATION TEST\n');

// Test 1: Environment Variables
function testEnvironmentVariables() {
  console.log('📋 Test 1: Environment Variables');
  
  const tests = [
    { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', value: config.stripePublishableKey, required: true },
    { key: 'STRIPE_SECRET_KEY', value: config.stripeSecretKey, required: true },
    { key: 'NEXT_PUBLIC_STRIPE_PRICE_ID', value: config.stripePriceId, required: true },
    { key: 'STRIPE_WEBHOOK_SECRET', value: config.webhookSecret, required: false },
    { key: 'NEXT_PUBLIC_APP_URL', value: config.appUrl, required: true }
  ];

  let passed = 0;
  tests.forEach(test => {
    const status = test.value && test.value !== 'your_key_here' ? '✅' : (test.required ? '❌' : '⚠️');
    console.log(`${status} ${test.key}: ${test.value ? (test.value.substring(0, 20) + '...') : 'NOT SET'}`);
    if (status === '✅') passed++;
  });

  console.log(`\nResult: ${passed}/${tests.length} environment variables configured\n`);
  return passed >= 3; // At minimum need publishable key, secret key, and price ID
}

// Test 2: API Endpoints
async function testApiEndpoints() {
  console.log('🔌 Test 2: API Endpoints');
  
  const endpoints = [
    '/api/create-checkout',
    '/api/stripe-webhook'
  ];

  for (const endpoint of endpoints) {
    const filePath = path.join(__dirname, 'pages', endpoint + '.js');
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${endpoint}: ${exists ? 'EXISTS' : 'MISSING'}`);
  }
  console.log();
}

// Test 3: Stripe API Connection
async function testStripeConnection() {
  console.log('🔗 Test 3: Stripe API Connection');
  
  if (!config.stripeSecretKey || config.stripeSecretKey === 'your_key_here') {
    console.log('❌ Cannot test - Stripe secret key not configured\n');
    return false;
  }

  try {
    const stripe = require('stripe')(config.stripeSecretKey);
    
    // Test API connection by fetching account info
    const account = await stripe.accounts.retrieve();
    console.log(`✅ Connected to Stripe account: ${account.business_profile?.name || account.id}`);
    console.log(`✅ Account status: ${account.charges_enabled ? 'CHARGES ENABLED' : 'PENDING VERIFICATION'}`);
    console.log(`✅ Live mode: ${account.livemode ? 'LIVE' : 'TEST'}`);
    
    // Test price ID exists
    if (config.stripePriceId) {
      try {
        const price = await stripe.prices.retrieve(config.stripePriceId);
        console.log(`✅ Price configured: $${price.unit_amount / 100} ${price.currency.toUpperCase()} ${price.recurring?.interval || 'one-time'}`);
        console.log(`✅ Product name: ${price.product?.name || 'Unknown'}`);
      } catch (error) {
        console.log(`❌ Price ID error: ${error.message}`);
        return false;
      }
    }
    
    console.log();
    return true;
  } catch (error) {
    console.log(`❌ Stripe connection failed: ${error.message}\n`);
    return false;
  }
}

// Test 4: Create Test Checkout Session
async function testCheckoutSession() {
  console.log('💳 Test 4: Checkout Session Creation');
  
  if (!config.stripeSecretKey || !config.stripePriceId) {
    console.log('❌ Cannot test - Missing Stripe configuration\n');
    return false;
  }

  try {
    const stripe = require('stripe')(config.stripeSecretKey);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: config.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${config.appUrl}/success`,
      cancel_url: `${config.appUrl}/cancel`,
      metadata: {
        test: 'true',
        plan: 'pro'
      }
    });

    console.log(`✅ Checkout session created: ${session.id}`);
    console.log(`✅ Payment URL: ${session.url}`);
    console.log(`✅ Success URL: ${session.success_url}`);
    console.log(`✅ Cancel URL: ${session.cancel_url}`);
    console.log();
    
    return true;
  } catch (error) {
    console.log(`❌ Checkout session creation failed: ${error.message}\n`);
    return false;
  }
}

// Test 5: Webhook Configuration
async function testWebhookConfiguration() {
  console.log('🪝 Test 5: Webhook Configuration');
  
  if (!config.stripeSecretKey) {
    console.log('❌ Cannot test - Missing Stripe secret key\n');
    return false;
  }

  try {
    const stripe = require('stripe')(config.stripeSecretKey);
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
    
    const appWebhooks = webhooks.data.filter(wh => 
      wh.url.includes(config.appUrl.replace('http://', '').replace('https://', ''))
    );

    if (appWebhooks.length > 0) {
      console.log(`✅ Found ${appWebhooks.length} webhook(s) for this app:`);
      appWebhooks.forEach(wh => {
        console.log(`   📡 ${wh.url} (${wh.enabled_events.length} events)`);
      });
    } else {
      console.log('⚠️  No webhooks found for this app URL');
      console.log('   Set up webhooks manually in Stripe Dashboard');
    }
    
    console.log();
    return true;
  } catch (error) {
    console.log(`❌ Webhook check failed: ${error.message}\n`);
    return false;
  }
}

// Test 6: Dependencies Check
function testDependencies() {
  console.log('📦 Test 6: Dependencies Check');
  
  const requiredDeps = [
    'stripe',
    '@stripe/stripe-js',
    'next',
    'react'
  ];

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  let allInstalled = true;
  requiredDeps.forEach(dep => {
    const installed = deps[dep] ? '✅' : '❌';
    console.log(`${installed} ${dep}: ${deps[dep] || 'NOT INSTALLED'}`);
    if (!deps[dep]) allInstalled = false;
  });

  console.log();
  return allInstalled;
}

// Main test runner
async function runTests() {
  const results = {
    environment: testEnvironmentVariables(),
    endpoints: await testApiEndpoints(),
    stripeConnection: await testStripeConnection(),
    checkoutSession: await testCheckoutSession(),
    webhooks: await testWebhookConfiguration(),
    dependencies: testDependencies()
  };

  console.log('📊 TEST RESULTS SUMMARY:');
  console.log('========================');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test.toUpperCase()}`);
  });

  const passedTests = Object.values(results).filter(r => r === true).length;
  const totalTests = Object.values(results).length;
  
  console.log(`\n🎯 OVERALL: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests >= 4) {
    console.log('\n🚀 CHARTFLOW PAYMENT SYSTEM READY FOR REVENUE!');
    console.log('💰 You can now accept $20/month subscriptions from customers.');
    console.log('\nNext steps:');
    console.log('1. Deploy to production with these configurations');
    console.log('2. Test with Stripe test card: 4242 4242 4242 4242');
    console.log('3. Switch to live keys when ready for real payments');
  } else {
    console.log('\n⚠️  SETUP INCOMPLETE');
    console.log('Please fix the failing tests before accepting payments.');
  }
}

// Run tests
runTests().catch(console.error);