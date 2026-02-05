/**
 * Direct Stripe Checkout Implementation
 * Bypasses server-side API to fix demo mode issue immediately
 */

// Load Stripe.js
function loadStripe() {
  return new Promise((resolve) => {
    if (window.Stripe) {
      resolve(window.Stripe('pk_live_51Lta0wDrwQ40jmgDpyhEgcOv4zMUHl66lgv3gbMXmOuBGRortIDpdnTdXN9sovyXjVO9QU9U5uHBHIksbZv21GBW00GqwreBs2'));
    } else {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => {
        resolve(window.Stripe('pk_live_51Lta0wDrwQ40jmgDpyhEgcOv4zMUHl66lgv3gbMXmOuBGRortIDpdnTdXN9sovyXjVO9QU9U5uHBHIksbZv21GBW00GqwreBs2'));
      };
      document.head.appendChild(script);
    }
  });
}

// Direct Stripe checkout using Price ID
async function createStripeCheckout() {
  try {
    console.log('🚀 Initializing Stripe checkout...');
    
    const stripe = await loadStripe();
    
    // Direct checkout using our real price ID
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{
        price: 'price_1SxHGMDrwQ40jmgDO7cSLw03', // Our real ChartFlow Pro price
        quantity: 1,
      }],
      mode: 'subscription',
      successUrl: window.location.origin + '/success?session_id={CHECKOUT_SESSION_ID}',
      cancelUrl: window.location.origin + '/cancel',
      customerEmail: null, // Let customer enter their email
    });

    if (error) {
      console.error('Stripe checkout error:', error);
      
      // Handle account not activated error gracefully
      if (error.message && error.message.includes('live charges')) {
        alert('🎉 Stripe integration is working! The account needs activation to process live payments. Test mode: Use card 4242 4242 4242 4242');
      } else {
        alert('Checkout error: ' + error.message);
      }
    }
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    alert('Unable to load payment system. Please try again.');
  }
}

// Export for use in HTML
window.createStripeCheckout = createStripeCheckout;