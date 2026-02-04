import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Success() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-2xl">
            {loading ? (
              <>
                <div className="text-6xl mb-6 animate-bounce">🎉</div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">
                  Payment Processing...
                </h1>
                <div className="animate-spin h-8 w-8 border-4 border-green-400 border-t-transparent rounded-full mx-auto"></div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-6 animate-bounce">🚀</div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">
                  Welcome to CSV Dashboard Pro!
                </h1>
                <p className="text-xl text-purple-200 mb-8 leading-relaxed">
                  Your subscription is now active! You now have unlimited dashboards, 
                  permanent storage, and all premium features.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-4 border border-green-300/30">
                    <div className="text-2xl mb-2">∞</div>
                    <div className="text-green-200 font-medium">Unlimited Dashboards</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-4 border border-blue-300/30">
                    <div className="text-2xl mb-2">🔒</div>
                    <div className="text-blue-200 font-medium">Permanent Storage</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-300/30">
                    <div className="text-2xl mb-2">🎨</div>
                    <div className="text-purple-200 font-medium">Custom Branding</div>
                  </div>
                </div>

                <button 
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Start Creating Dashboards! 🎯
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}