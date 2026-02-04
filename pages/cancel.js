import { useRouter } from 'next/router'

export default function Cancel() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-2xl">
            <div className="text-6xl mb-6">😔</div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-4">
              Payment Cancelled
            </h1>
            <p className="text-xl text-purple-200 mb-8 leading-relaxed">
              No worries! You can still use the free version with 3 dashboards 
              and 7-day storage. Upgrade anytime when you're ready.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Continue with Free Plan 🎉
              </button>
              
              <button 
                onClick={() => router.push('/#pricing')}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
              >
                View Pricing Again 💎
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}