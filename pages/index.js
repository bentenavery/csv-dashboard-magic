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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50"></div>
      
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-white text-sm font-medium animate-bounce">
              ✨ Transform Your Data in Seconds
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-pink-100 leading-tight">
            Turn CSV Files Into
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 animate-pulse">
              Stunning Dashboards
            </span>
          </h1>
          
          <p className="mt-8 max-w-3xl mx-auto text-xl text-purple-100 leading-relaxed">
            Drop your CSV, get beautiful interactive charts instantly. No spreadsheet headaches, 
            no complex tools - just <span className="text-pink-300 font-semibold">pure visual magic</span> ✨
          </p>
          
          <div className="mt-4 flex justify-center space-x-8 text-sm text-purple-300">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              No coding required
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              60-second setup
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-pink-400 rounded-full mr-2 animate-pulse"></div>
              Share anywhere
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mt-20 max-w-2xl mx-auto">
          {!csvData ? (
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur opacity-75 animate-pulse"></div>
              
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-2xl">
                <div className="text-center">
                  {/* Animated Icon */}
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform hover:scale-110 transition-all duration-300 shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">Drop Your CSV Magic Here</h3>
                  <p className="text-purple-200 mb-8 text-lg">
                    Watch your boring data transform into beautiful insights ✨
                  </p>
                  
                  <div className="border-2 border-dashed border-purple-300/50 rounded-2xl p-8 mb-8 hover:border-pink-300/70 transition-all duration-300">
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        className="sr-only"
                        accept=".csv"
                        onChange={handleFileUpload}
                      />
                      
                      <div className="text-center">
                        <div className="text-2xl mb-4">📊</div>
                        <div className="text-purple-100 text-sm">
                          Drag & drop your CSV file here or click to browse
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <button
                    onClick={() => document.querySelector('input[type="file"]').click()}
                    className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Creating Magic...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🚀</span>
                        Choose Your CSV File
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                      </>
                    )}
                  </button>
                  
                  <div className="mt-6 text-purple-300 text-sm">
                    Supports files up to 50MB • Instant processing
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <DashboardPreview data={csvData} fileName={fileName} />
          )}
        </div>

        {/* Features Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-4">
              Why Your Data Will Love This
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Everything you need to turn boring spreadsheets into visual masterpieces
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/50 to-purple-500/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-pink-300/50 transition-all duration-300">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
                <p className="text-purple-200 leading-relaxed">
                  Upload your CSV and watch charts appear instantly. No waiting, no loading screens - 
                  just pure speed and efficiency.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/50 to-indigo-500/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-purple-300/50 transition-all duration-300">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-4">Beautiful Charts</h3>
                <p className="text-purple-200 leading-relaxed">
                  Bar charts, line graphs, pie charts - all automatically styled with gorgeous colors 
                  that make your data pop.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/50 to-pink-500/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-indigo-300/50 transition-all duration-300">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-4">Share & Impress</h3>
                <p className="text-purple-200 leading-relaxed">
                  Generate shareable links that wow your audience. Your data has never looked 
                  this professional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm font-medium mb-6">
              💰 Simple Pricing That Makes Sense
            </div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-4">
              Start Free, Upgrade When Ready
            </h2>
            <p className="text-xl text-purple-200">
              No hidden fees, no surprises - just honest pricing for awesome dashboards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/50 to-blue-500/50 rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 hover:border-green-300/50 transition-all duration-300">
                <div className="text-center">
                  <div className="text-2xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Free Forever</h3>
                  <p className="text-purple-200 mb-8">Perfect for getting started</p>
                  
                  <div className="mb-8">
                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">$0</span>
                    <span className="text-purple-200 text-xl">/month</span>
                  </div>
                  
                  <ul className="space-y-4 text-left mb-8">
                    <li className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-purple-100">3 beautiful dashboards</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-purple-100">7-day data storage</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-purple-100">All chart types</span>
                    </li>
                  </ul>
                  
                  <button className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
                    Start Building Now 🚀
                  </button>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl opacity-100 blur animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl rounded-3xl border border-purple-300/50 p-8">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold shadow-lg">
                    ⭐ MOST POPULAR
                  </span>
                </div>
                
                <div className="text-center pt-4">
                  <div className="text-2xl mb-4">👑</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Pro Power</h3>
                  <p className="text-purple-100 mb-8">For professionals who mean business</p>
                  
                  <div className="mb-8">
                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">$20</span>
                    <span className="text-purple-200 text-xl">/month</span>
                  </div>
                  
                  <ul className="space-y-4 text-left mb-8">
                    <li className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-white font-medium">∞ Unlimited dashboards</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-white font-medium">🔒 Permanent secure storage</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-white font-medium">🎨 Custom branding</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-white font-medium">🔐 Password protection</span>
                    </li>
                  </ul>
                  
                  <button className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 mb-3">
                    Start Free Trial ✨
                  </button>
                  
                  <p className="text-purple-300 text-sm">
                    No credit card required • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}