import Head from 'next/head'
import { useState } from 'react'

export default function Pricing() {
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const handleProUpgrade = async () => {
    setCheckoutLoading(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1OSk1QJxXxXxXxXxXxXxXxXx',
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
        }),
      })
      const { url } = await response.json()
      if (url) window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Demo mode - Stripe checkout coming soon!')
    } finally {
      setCheckoutLoading(false)
    }
  }
  return (
    <>
      <Head>
        <title>Pricing - ChartFlow</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        .animated-gradient {
            background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
            background-size: 400% 400%;
            animation: gradient-shift 15s ease infinite;
        }
        
        @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .card-gradient {
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .hover-scale { 
            transition: all 0.3s ease; 
        }
        .hover-scale:hover { 
            transform: scale(1.05) translateY(-5px); 
            box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }
        
        .glow-pulse {
            animation: pulse-glow 3s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
            0%, 100% { 
                box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
            }
            50% { 
                box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.6);
            }
        }
      `}</style>

      <div className="animated-gradient min-h-screen text-white">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <i className="fas fa-chart-line text-3xl text-white"></i>
              <span className="text-2xl font-bold">ChartFlow</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="/" className="hover:text-purple-200 transition-colors">Home</a>
              <a href="#" className="text-purple-300 font-bold">Pricing</a>
              <a href="#" className="hover:text-purple-200 transition-colors">Contact</a>
            </div>
          </div>
        </nav>
        
        {/* Header */}
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <i className="fas fa-gem text-purple-300 mr-3"></i>
            Simple Pricing
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
            Start free and upgrade when you're ready. No surprises, just beautiful dashboards.
          </p>
        </div>
        
        {/* Pricing Plans - Only Free and Pro */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Free Plan */}
            <div className="card-gradient rounded-2xl p-8 hover-scale">
              <div className="text-center">
                <div className="mb-6">
                  <i className="fas fa-seedling text-5xl text-green-300"></i>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-purple-200 mb-6">Perfect for getting started</p>
                
                <div className="mb-8">
                  <div className="text-5xl font-bold mb-2">
                    <span className="text-green-300">$0</span>
                  </div>
                  <p className="text-purple-300">Forever free</p>
                </div>
                
                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-300 mr-3 flex-shrink-0"></i>
                    <span>3 dashboard projects</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-300 mr-3 flex-shrink-0"></i>
                    <span>All chart types</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-300 mr-3 flex-shrink-0"></i>
                    <span>7-day data storage</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-300 mr-3 flex-shrink-0"></i>
                    <span>Public sharing</span>
                  </li>
                </ul>
                
                <button 
                  className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white font-bold py-4 px-6 rounded-xl hover:from-green-500 hover:to-green-600 transition-all"
                  onClick={() => window.location.href = '/'}
                >
                  Get Started Free
                </button>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="card-gradient rounded-2xl p-8 hover-scale border-2 border-purple-400 relative glow-pulse">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                  ⭐ MOST POPULAR
                </span>
              </div>
              
              <div className="text-center">
                <div className="mb-6">
                  <i className="fas fa-rocket text-5xl text-purple-300"></i>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-purple-200 mb-6">For serious professionals</p>
                
                <div className="mb-8">
                  <div className="text-5xl font-bold mb-2">
                    <span className="text-purple-300">$20</span>
                  </div>
                  <p className="text-purple-300">per month</p>
                </div>
                
                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-center">
                    <i className="fas fa-infinity text-purple-300 mr-3 flex-shrink-0"></i>
                    <span><strong>Unlimited</strong> dashboards</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-database text-purple-300 mr-3 flex-shrink-0"></i>
                    <span><strong>Permanent</strong> storage</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-lock text-purple-300 mr-3 flex-shrink-0"></i>
                    <span><strong>Password</strong> protection</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-palette text-purple-300 mr-3 flex-shrink-0"></i>
                    <span><strong>Custom</strong> branding</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-download text-purple-300 mr-3 flex-shrink-0"></i>
                    <span><strong>HD exports</strong> (PNG, PDF)</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-headset text-purple-300 mr-3 flex-shrink-0"></i>
                    <span><strong>Priority</strong> support</span>
                  </li>
                </ul>
                
                <button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                  onClick={handleProUpgrade}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Loading...
                    </>
                  ) : (
                    'Start 14-Day Free Trial'
                  )}
                </button>
                <p className="text-xs text-purple-300 mt-3">No credit card required</p>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-gradient rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">
                  <i className="fas fa-question-circle text-purple-300 mr-2"></i>
                  Can I cancel anytime?
                </h3>
                <p className="text-purple-100">
                  Yes! Cancel your subscription at any time. No questions asked, no fees.
                </p>
              </div>
              
              <div className="card-gradient rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">
                  <i className="fas fa-question-circle text-purple-300 mr-2"></i>
                  Is my data secure?
                </h3>
                <p className="text-purple-100">
                  Absolutely. Enterprise-grade encryption and we never share your data.
                </p>
              </div>
              
              <div className="card-gradient rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">
                  <i className="fas fa-question-circle text-purple-300 mr-2"></i>
                  Do I need to know code?
                </h3>
                <p className="text-purple-100">
                  Not at all! Just upload your CSV and we handle everything else.
                </p>
              </div>
              
              <div className="card-gradient rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">
                  <i className="fas fa-question-circle text-purple-300 mr-2"></i>
                  How big can my files be?
                </h3>
                <p className="text-purple-100">
                  Free: up to 5MB. Pro: up to 50MB with faster processing.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 text-center border-t border-white/10">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <i className="fas fa-chart-line text-2xl text-purple-300"></i>
            <span className="text-xl font-bold">ChartFlow</span>
          </div>
          <p className="text-purple-300">Turn your data into beautiful charts that flow ✨</p>
        </footer>
      </div>
    </>
  )
}