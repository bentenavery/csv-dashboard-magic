#!/bin/bash
echo "🚀 FORCING VERCEL DEPLOYMENT"

# Build the project
npm run build

# Create deployment trigger file  
echo "DEPLOYMENT_ID=$(date +%s)" > DEPLOYMENT_TRIGGER.txt

# Commit and push to trigger Vercel via GitHub integration
git add -A
git commit -m "FORCE DEPLOY: Beautiful gradient design to Vercel $(date)"
git push origin main

echo "✅ Deployment triggered via GitHub → Vercel integration"
echo "🌐 Check: https://chartflow-pied.vercel.app in 2-3 minutes"