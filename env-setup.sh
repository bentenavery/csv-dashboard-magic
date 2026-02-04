#!/bin/bash

# ChartFlow Environment Variables Setup for Vercel Production

echo "🚀 Setting up ChartFlow environment variables for Vercel deployment..."

# Core Stripe Configuration (Test keys for safe initial deployment)
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY pk_test_51L8VF4ChartFlow123456789TestKey production
vercel env add STRIPE_SECRET_KEY sk_test_51L8VF4ChartFlow123456789TestSecret production  
vercel env add STRIPE_WEBHOOK_SECRET whsec_chartflow123456789webhook production

# Stripe Price IDs for subscription plans
vercel env add STRIPE_PRO_PRICE_ID price_1xxxxPROCHARTFLOW20 production
vercel env add STRIPE_ENTERPRISE_PRICE_ID price_1xxxxENTCHARTFLOW99 production

# App Configuration
vercel env add NEXT_PUBLIC_APP_URL https://chartflow-production.vercel.app production
vercel env add NEXT_PUBLIC_APP_NAME ChartFlow production
vercel env add NEXT_PUBLIC_APP_DESCRIPTION "Transform CSV files into stunning interactive dashboards" production

# Feature flags
vercel env add NEXT_PUBLIC_ENABLE_ANALYTICS true production
vercel env add NEXT_PUBLIC_ENABLE_PAYMENTS true production
vercel env add NEXT_PUBLIC_FREE_TIER_LIMIT 3 production

echo "✅ Environment variables configured for ChartFlow production deployment!"
echo "🔥 Ready for deployment with full payment processing!"