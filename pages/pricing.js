export default function Pricing() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
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
              <span className="text-3xl">📊</span>
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
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-purple-300 mr-3">💎</span>
            Simple Pricing
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
            Start free and upgrade when you're ready. No surprises, just beautiful dashboards.
          </p>
        </div>
        
        {/* Pricing Plans */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Free Plan */}
            <div className="card-gradient rounded-2xl p-8 hover-scale">
              <div className="text-center">
                <div className="mb-6">
                  <span className="text-5xl">🌱</span>
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
                    <span className="text-green-300 mr-3 flex-shrink-0">✅</span>
                    <span>3 dashboard projects</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-300 mr-3 flex-shrink-0">✅</span>
                    <span>All chart types</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-300 mr-3 flex-shrink-0">✅</span>
                    <span>7-day data storage</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-300 mr-3 flex-shrink-0">✅</span>
                    <span>Public sharing</span>
                  </li>
                </ul>
                
                <button className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white font-bold py-4 px-6 rounded-xl hover:from-green-500 hover:to-green-600 transition-all">
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
                  <span className="text-5xl">🚀</span>
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
                    <span className="text-purple-300 mr-3 flex-shrink-0">∞</span>
                    <span><strong>Unlimited</strong> dashboards</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-300 mr-3 flex-shrink-0">💾</span>
                    <span><strong>Permanent</strong> storage</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-300 mr-3 flex-shrink-0">🔒</span>
                    <span><strong>Password</strong> protection</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-300 mr-3 flex-shrink-0">🎨</span>
                    <span><strong>Custom</strong> branding</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-300 mr-3 flex-shrink-0">⬇️</span>
                    <span><strong>HD exports</strong> (PNG, PDF)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-300 mr-3 flex-shrink-0">🎧</span>
                    <span><strong>Priority</strong> support</span>
                  </li>
                </ul>
                
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all text-lg shadow-2xl">
                  Start 14-Day Free Trial
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
                  <span className="text-purple-300 mr-2">❓</span>
                  Can I cancel anytime?
                </h3>
                <p className="text-purple-100">
                  Yes! Cancel your subscription at any time. No questions asked, no fees.
                </p>
              </div>
              
              <div className="card-gradient rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">
                  <span className="text-purple-300 mr-2">🔐</span>
                  Is my data secure?
                </h3>
                <p className="text-purple-100">
                  Absolutely. Enterprise-grade encryption and we never share your data.
                </p>
              </div>
              
              <div className="card-gradient rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">
                  <span className="text-purple-300 mr-2">💻</span>
                  Do I need to know code?
                </h3>
                <p className="text-purple-100">
                  Not at all! Just upload your CSV and we handle everything else.
                </p>
              </div>
              
              <div className="card-gradient rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">
                  <span className="text-purple-300 mr-2">📁</span>
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
            <span className="text-2xl">📊</span>
            <span className="text-xl font-bold">ChartFlow</span>
          </div>
          <p className="text-purple-300">Turn your data into beautiful charts that flow ✨</p>
        </footer>
      </div>
    </>
  )
}