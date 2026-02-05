import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [csvData, setCsvData] = useState(null)
  const [fileName, setFileName] = useState('')
  const [processing, setProcessing] = useState(false)

  return (
    <>
      <Head>
        <title>ChartFlow - Turn CSV Into Charts That Flow Beautifully</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </Head>
      
      <style jsx global>{`
        /* Custom gradient backgrounds */
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .hero-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }
        
        .card-gradient {
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        /* Animations */
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(1deg); }
        }
        
        @keyframes pulse-glow {
            0%, 100% { 
                box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
            }
            50% { 
                box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.6);
            }
        }
        
        @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .floating { animation: float 6s ease-in-out infinite; }
        .glow-pulse { animation: pulse-glow 3s ease-in-out infinite; }
        
        .animated-gradient {
            background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
            background-size: 400% 400%;
            animation: gradient-shift 15s ease infinite;
        }
        
        /* Hover effects */
        .hover-scale { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.05) translateY(-2px); }
        
        .hover-glow { transition: all 0.3s ease; }
        .hover-glow:hover { 
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
            transform: translateY(-2px);
        }
      `}</style>

      <div className="animated-gradient min-h-screen text-white">
        {/* Header Navigation */}
        <header className="relative z-10">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <i className="fas fa-chart-line text-3xl text-white floating"></i>
                        <span className="text-2xl font-bold">ChartFlow</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-purple-200 hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="text-purple-200 hover:text-white transition-colors">Pricing</a>
                        <a href="mailto:hello@chartflow.com" className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all hover-scale">
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32">
            <div className="absolute inset-0 hero-gradient opacity-80"></div>
            <div className="relative z-10 container mx-auto px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="hero-title text-5xl md:text-7xl font-black mb-8 leading-tight">
                        Turn CSV Files Into
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                            Charts That Flow Beautifully
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-purple-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Drop your CSV, get stunning interactive dashboards in seconds. No spreadsheet headaches, 
                        no complex tools—just <strong className="text-pink-300">pure visual magic</strong> ✨
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-8 text-purple-200 mb-16">
                        <div className="flex items-center">
                            <i className="fas fa-bolt text-yellow-300 mr-2"></i>
                            <span>60-second setup</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-palette text-pink-300 mr-2"></i>
                            <span>Beautiful by default</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-share-alt text-blue-300 mr-2"></i>
                            <span>Share anywhere</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Upload Section */}
        <section className="relative -mt-16 z-20 pb-20">
            <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="card-gradient rounded-3xl p-12 hover-glow">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-pink-400 to-purple-600 rounded-2xl flex items-center justify-center floating">
                                <i className="fas fa-file-csv text-3xl text-white"></i>
                            </div>
                            
                            <h2 className="text-3xl font-bold text-white mb-4">Drop Your CSV Magic Here</h2>
                            <p className="text-purple-200 mb-8 text-lg">Watch your boring spreadsheet data transform into beautiful insights ✨</p>
                            
                            <div className="upload-area rounded-2xl p-12 mb-8 cursor-pointer group">
                                <input type="file" className="hidden" accept=".csv" />
                                <div className="text-center">
                                    <i className="fas fa-cloud-upload-alt text-5xl text-purple-300 mb-4 group-hover:text-white transition-colors"></i>
                                    <p className="text-purple-100 group-hover:text-white transition-colors">
                                        Drag & drop your CSV file here, or click to browse
                                    </p>
                                    <p className="text-sm text-purple-300 mt-2">Supports files up to 50MB • Instant processing</p>
                                </div>
                            </div>
                            
                            <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover-scale glow-pulse">
                                <i className="fas fa-rocket mr-3"></i>
                                Create My Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Why Your Data Will Love This</h2>
                    <p className="text-xl text-purple-200 max-w-2xl mx-auto">Everything you need to turn boring spreadsheets into visual masterpieces</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card-gradient rounded-2xl p-8 hover-glow feature-card">
                        <div className="text-center">
                            <i className="fas fa-bolt text-5xl text-yellow-300 mb-6 floating"></i>
                            <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
                            <p className="text-purple-200 leading-relaxed">
                                Upload your CSV and watch charts appear instantly. No waiting, no loading screens—just pure speed.
                            </p>
                        </div>
                    </div>

                    <div className="card-gradient rounded-2xl p-8 hover-glow feature-card">
                        <div className="text-center">
                            <i className="fas fa-palette text-5xl text-pink-300 mb-6 floating"></i>
                            <h3 className="text-2xl font-bold text-white mb-4">Beautiful Charts</h3>
                            <p className="text-purple-200 leading-relaxed">
                                Bar charts, line graphs, pie charts—all automatically styled with gorgeous colors that make your data pop.
                            </p>
                        </div>
                    </div>

                    <div className="card-gradient rounded-2xl p-8 hover-glow feature-card">
                        <div className="text-center">
                            <i className="fas fa-share-alt text-5xl text-blue-300 mb-6 floating"></i>
                            <h3 className="text-2xl font-bold text-white mb-4">Share & Impress</h3>
                            <p className="text-purple-200 leading-relaxed">
                                Generate shareable links that wow your audience. Your data has never looked this professional.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-block bg-white bg-opacity-20 text-white px-6 py-3 rounded-full mb-6">
                        <i className="fas fa-gem mr-2"></i>
                        Simple Pricing That Makes Sense
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Start Free, Upgrade When Ready</h2>
                    <p className="text-xl text-purple-200">No hidden fees, no surprises—just honest pricing for awesome dashboards</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="card-gradient rounded-3xl p-8 hover-glow">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                                <i className="fas fa-seedling text-3xl text-white"></i>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-2">Free Forever</h3>
                            <p className="text-purple-200 mb-8">Perfect for getting started</p>
                            
                            <div className="mb-8">
                                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">$0</span>
                                <span className="text-purple-200 text-xl">/month</span>
                            </div>
                            
                            <ul className="text-left space-y-4 mb-8">
                                <li className="flex items-center">
                                    <i className="fas fa-check text-green-400 mr-3"></i>
                                    <span className="text-purple-100">3 beautiful dashboards</span>
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-check text-green-400 mr-3"></i>
                                    <span className="text-purple-100">All chart types</span>
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-check text-green-400 mr-3"></i>
                                    <span className="text-purple-100">7-day storage</span>
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-check text-green-400 mr-3"></i>
                                    <span className="text-purple-100">Share anywhere</span>
                                </li>
                            </ul>
                            
                            <button className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover-scale">
                                Start Building Now
                                <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                <i className="fas fa-crown mr-1"></i>
                                MOST POPULAR
                            </div>
                        </div>
                        
                        <div className="card-gradient rounded-3xl p-8 border-2 border-purple-400 glow-pulse hover-glow">
                            <div className="text-center pt-4">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-purple-600 rounded-2xl flex items-center justify-center">
                                    <i className="fas fa-rocket text-3xl text-white"></i>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-white mb-2">Pro Power</h3>
                                <p className="text-purple-200 mb-8">For professionals who mean business</p>
                                
                                <div className="mb-8">
                                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">$20</span>
                                    <span className="text-purple-200 text-xl">/month</span>
                                </div>
                                
                                <ul className="text-left space-y-4 mb-8">
                                    <li className="flex items-center">
                                        <i className="fas fa-infinity text-purple-300 mr-3"></i>
                                        <span className="text-white font-medium">Unlimited dashboards</span>
                                    </li>
                                    <li className="flex items-center">
                                        <i className="fas fa-shield-alt text-purple-300 mr-3"></i>
                                        <span className="text-white font-medium">Permanent storage</span>
                                    </li>
                                    <li className="flex items-center">
                                        <i className="fas fa-palette text-purple-300 mr-3"></i>
                                        <span className="text-white font-medium">Custom branding</span>
                                    </li>
                                    <li className="flex items-center">
                                        <i className="fas fa-lock text-purple-300 mr-3"></i>
                                        <span className="text-white font-medium">Password protection</span>
                                    </li>
                                </ul>
                                
                                <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-black py-4 px-6 rounded-2xl text-lg shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover-scale mb-3">
                                    Start Free Trial
                                    <i className="fas fa-sparkles ml-2"></i>
                                </button>
                                <p className="text-purple-300 text-sm">No credit card required • Cancel anytime</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-black bg-opacity-20 border-t border-white border-opacity-10 py-12">
            <div className="container mx-auto px-6 text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                    <i className="fas fa-chart-line text-2xl text-purple-300"></i>
                    <span className="text-xl font-bold">ChartFlow</span>
                </div>
                <p className="text-purple-300 mb-6">Turn your data into charts that flow beautifully</p>
                
                <div className="flex flex-wrap justify-center gap-8 text-purple-400">
                    <a href="mailto:hello@chartflow.com" className="hover:text-white transition-colors">Contact</a>
                    <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white border-opacity-10 text-purple-400 text-sm">
                    © 2026 ChartFlow. Made with ❤️ for data lovers everywhere.
                </div>
            </div>
        </footer>
      </div>
    </>
  )
}