import { useState } from 'react'
import Papa from 'papaparse'
import DashboardPreview from '../components/DashboardPreview'

export default function Home() {
  const [csvData, setCsvData] = useState(null)
  const [fileName, setFileName] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setFileName(file.name)
    setProcessing(true)

    Papa.parse(file, {
      complete: (results) => {
        setCsvData(results.data)
        setProcessing(false)
      },
      header: true,
      skipEmptyLines: true
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Turn Your</span>
            <span className="block text-indigo-600">CSV Files Into Beautiful Dashboards</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Upload any CSV file and get an interactive, shareable dashboard in 60 seconds. 
            No coding required.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mt-16 max-w-lg mx-auto">
          {!csvData ? (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Upload your CSV file</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop or click to select your CSV file
                </p>
                <div className="mt-6">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="sr-only"
                      accept=".csv"
                      onChange={handleFileUpload}
                    />
                    <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      {processing ? 'Processing...' : 'Choose CSV File'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <DashboardPreview data={csvData} fileName={fileName} />
          )}
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything you need to visualize your data
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Instant Charts</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Automatically generate bar charts, line graphs, and pie charts from your data.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Easy Sharing</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Generate shareable links with password protection for your dashboards.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Secure & Private</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Your data stays secure with enterprise-grade encryption and privacy controls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Simple, transparent pricing
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-medium text-gray-900">Free</h3>
              <p className="mt-4 text-sm text-gray-500">Perfect for trying out the service</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">$0</span>
                <span className="text-base font-medium text-gray-500">/month</span>
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-sm text-gray-500">3 dashboards</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-sm text-gray-500">7-day data retention</span>
                </li>
              </ul>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-medium text-indigo-900">Pro</h3>
              <p className="mt-4 text-sm text-indigo-700">For professionals and small teams</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-indigo-900">$20</span>
                <span className="text-base font-medium text-indigo-700">/month</span>
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-sm text-indigo-700">Unlimited dashboards</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-sm text-indigo-700">Permanent storage</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-sm text-indigo-700">Custom branding</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-3 text-sm text-indigo-700">Password protection</span>
                </li>
              </ul>
              <button className="mt-8 w-full bg-indigo-600 text-white rounded-lg py-2 px-4 hover:bg-indigo-700">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}