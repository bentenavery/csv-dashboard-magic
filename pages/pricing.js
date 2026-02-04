export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
            </div>
            <a
              href="/"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              ← Back to Builder
            </a>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Start free, upgrade when you need more power
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900">Free</h3>
            <p className="mt-4 text-gray-500">Perfect for trying out the service</p>
            <p className="mt-8">
              <span className="text-4xl font-extrabold text-gray-900">$0</span>
              <span className="text-base font-medium text-gray-500">/month</span>
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-gray-500">3 dashboards</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-gray-500">7-day data retention</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-gray-500">Basic charts (bar, line, pie)</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-gray-500">Shareable links</span>
              </li>
            </ul>
            <button className="mt-8 w-full bg-gray-200 text-gray-800 rounded-lg py-3 px-4 hover:bg-gray-300">
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg shadow-sm p-8 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <h3 className="text-2xl font-bold text-indigo-900">Pro</h3>
            <p className="mt-4 text-indigo-700">For professionals and small teams</p>
            <p className="mt-8">
              <span className="text-4xl font-extrabold text-indigo-900">$20</span>
              <span className="text-base font-medium text-indigo-700">/month</span>
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-indigo-700">Unlimited dashboards</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-indigo-700">Permanent storage</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-indigo-700">Custom branding</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-indigo-700">Password protection</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-indigo-700">Export as images</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-indigo-700">Priority support</span>
              </li>
            </ul>
            <button className="mt-8 w-full bg-indigo-600 text-white rounded-lg py-3 px-4 hover:bg-indigo-700">
              Start 7-Day Free Trial
            </button>
          </div>

          {/* Team Plan */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900">Team</h3>
            <p className="mt-4 text-gray-500">For growing teams and agencies</p>
            <p className="mt-8">
              <span className="text-4xl font-extrabold text-gray-900">$50</span>
              <span className="text-base font-medium text-gray-500">/month</span>
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-gray-500">Everything in Pro</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-gray-500">Up to 10 team members</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-gray-500">Collaboration features</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-gray-500">Admin dashboard</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-gray-500">White-label option</span>
              </li>
              <li className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-gray-500">Dedicated support</span>
              </li>
            </ul>
            <button className="mt-8 w-full bg-gray-800 text-white rounded-lg py-3 px-4 hover:bg-gray-900">
              Contact Sales
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h3>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                What file formats do you support?
              </h4>
              <p className="text-gray-600">
                Currently we support CSV files. We're working on adding Excel (.xlsx), Google Sheets, and JSON support soon.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                How secure is my data?
              </h4>
              <p className="text-gray-600">
                Your data is encrypted at rest and in transit. We use enterprise-grade security with Supabase and never share your data with third parties.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Can I cancel anytime?
              </h4>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. Your dashboards will remain accessible until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Do you offer refunds?
              </h4>
              <p className="text-gray-600">
                We offer a 7-day free trial so you can test everything before paying. If you're not satisfied, we offer a 30-day money-back guarantee.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                What if I need help?
              </h4>
              <p className="text-gray-600">
                We provide email support for all users and priority support for Pro+ customers. Check out our help center or contact us directly.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-indigo-50 rounded-lg p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to transform your data?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of businesses creating beautiful dashboards in seconds
          </p>
          <a
            href="/"
            className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 text-lg font-medium"
          >
            Start Your Free Trial →
          </a>
        </div>
      </div>
    </div>
  )
}