// ChartFlow Trial Signup with Stripe Elements
// This replaces the basic email capture with proper subscription trial

class ChartFlowTrialSignup {
  constructor() {
    this.stripe = Stripe(this.getPublishableKey());
    this.elements = null;
    this.cardElement = null;
    this.currentPlan = 'pro';
    this.setupEventListeners();
  }

  getPublishableKey() {
    // In production, this would come from your environment
    return 'pk_test_your_stripe_publishable_key'; // Replace with actual key
  }

  setupEventListeners() {
    // Trial signup buttons
    document.querySelectorAll('[data-plan-trial]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const plan = button.dataset.planTrial;
        this.startTrialSignup(plan);
      });
    });

    // Modal close handlers
    document.addEventListener('click', (e) => {
      if (e.target.id === 'trialModal' || e.target.classList.contains('close-modal')) {
        this.closeTrialModal();
      }
    });

    // Form submission
    const trialForm = document.getElementById('trialSignupForm');
    if (trialForm) {
      trialForm.addEventListener('submit', this.handleTrialSubmit.bind(this));
    }
  }

  startTrialSignup(plan = 'pro') {
    this.currentPlan = plan;
    
    // Update modal content based on plan
    this.updateModalForPlan(plan);
    
    // Show modal
    document.getElementById('trialModal').style.display = 'block';
    
    // Initialize Stripe Elements
    this.initializeStripeElements();
  }

  updateModalForPlan(plan) {
    const planDetails = {
      pro: {
        name: 'Pro',
        price: '$20',
        features: ['Unlimited dashboards', 'Custom branding', 'Priority support']
      },
      team: {
        name: 'Team', 
        price: '$50',
        features: ['Everything in Pro', 'Team collaboration', 'White-label options', 'Admin controls']
      }
    };

    const details = planDetails[plan];
    
    // Update modal title and details
    document.querySelector('#trialModal .plan-name').textContent = details.name;
    document.querySelector('#trialModal .plan-price').textContent = details.price;
    
    // Update features list
    const featuresList = document.querySelector('#trialModal .plan-features');
    featuresList.innerHTML = details.features.map(feature => 
      `<li class="flex items-center text-sm"><i class="fas fa-check text-green-300 mr-2"></i>${feature}</li>`
    ).join('');
  }

  initializeStripeElements() {
    // Create elements instance
    this.elements = this.stripe.elements({
      appearance: {
        theme: 'night',
        variables: {
          colorPrimary: '#667eea',
        }
      }
    });

    // Create card element
    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#fff',
          '::placeholder': {
            color: 'rgba(255,255,255,0.6)',
          },
        },
      },
    });

    // Mount card element
    this.cardElement.mount('#card-element');

    // Handle real-time validation errors from the card Element
    this.cardElement.on('change', ({error}) => {
      const displayError = document.getElementById('card-errors');
      if (error) {
        displayError.textContent = error.message;
        displayError.style.display = 'block';
      } else {
        displayError.textContent = '';
        displayError.style.display = 'none';
      }
    });
  }

  async handleTrialSubmit(event) {
    event.preventDefault();

    const submitButton = document.getElementById('trialSubmitButton');
    const originalText = submitButton.innerHTML;
    
    // Disable submit button and show loading
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Setting up your trial...';

    try {
      // Get form data
      const formData = new FormData(event.target);
      const customerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company') || '',
        plan: this.currentPlan
      };

      // Validate required fields
      if (!customerData.name || !customerData.email) {
        throw new Error('Name and email are required');
      }

      // Create subscription with trial
      const response = await fetch('/api/create-trial-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { subscriptionId, customerId, clientSecret, trialEnd } = await response.json();

      // Confirm payment method for future billing
      const {error: confirmError} = await this.stripe.confirmSetup(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: customerData.name,
            email: customerData.email,
          },
        }
      });

      if (confirmError) {
        throw confirmError;
      }

      // Send welcome email
      await this.sendWelcomeEmail(customerData, trialEnd);

      // Success! Show confirmation and redirect
      this.showTrialSuccess(customerData, trialEnd);

    } catch (error) {
      console.error('Trial signup error:', error);
      this.showError(error.message || 'Something went wrong. Please try again.');
      
      // Reset button
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  }

  async sendWelcomeEmail(customerData, trialEnd) {
    try {
      await fetch('/api/send-trial-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'welcome',
          customerEmail: customerData.email,
          customerName: customerData.name,
          trialEndDate: trialEnd,
          planName: customerData.plan === 'team' ? 'Team' : 'Pro'
        }),
      });
    } catch (error) {
      console.error('Welcome email error:', error);
      // Don't fail the signup if email fails
    }
  }

  showTrialSuccess(customerData, trialEnd) {
    const trialEndDate = new Date(trialEnd * 1000).toLocaleDateString();
    
    // Close modal
    this.closeTrialModal();
    
    // Show success message
    const successMessage = `
      <div class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" id="successModal">
        <div class="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-2xl max-w-md mx-4 text-white text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h2 class="text-2xl font-bold mb-4">Trial Started Successfully!</h2>
          <p class="mb-6">
            Welcome ${customerData.name}! Your 14-day free trial is now active.
            <br><br>
            <strong>Trial ends:</strong> ${trialEndDate}
            <br>
            <strong>Plan:</strong> ChartFlow ${customerData.plan === 'team' ? 'Team' : 'Pro'}
          </p>
          <div class="space-y-3">
            <button onclick="window.location.href='/dashboard'" class="w-full bg-white text-purple-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              🚀 Start Building Dashboards
            </button>
            <button onclick="document.getElementById('successModal').remove()" class="w-full bg-transparent border border-white py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
              Continue Browsing
            </button>
          </div>
          <p class="text-sm opacity-80 mt-4">
            Check your email for a welcome message with next steps!
          </p>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successMessage);

    // Track conversion
    if (typeof gtag !== 'undefined') {
      gtag('event', 'trial_started', {
        event_category: 'engagement',
        event_label: customerData.plan,
        value: customerData.plan === 'team' ? 50 : 20
      });
    }
  }

  showError(message) {
    const errorDiv = document.getElementById('trial-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    } else {
      alert(`Error: ${message}`);
    }
  }

  closeTrialModal() {
    const modal = document.getElementById('trialModal');
    if (modal) {
      modal.style.display = 'none';
      
      // Cleanup Stripe elements
      if (this.cardElement) {
        this.cardElement.destroy();
        this.cardElement = null;
      }
      if (this.elements) {
        this.elements = null;
      }
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.chartFlowTrial = new ChartFlowTrialSignup();
});