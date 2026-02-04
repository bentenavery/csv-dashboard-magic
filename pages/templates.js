import { useState } from 'react'

const sampleTemplates = [
  {
    id: 1,
    title: "Sales Performance Dashboard",
    description: "Track sales metrics, revenue trends, and team performance",
    industry: "Sales",
    preview: "/api/preview/sales",
    sampleData: `Month,Revenue,Leads,Conversions
January,45000,120,24
February,52000,135,27
March,48000,98,19
April,61000,145,29`,
    chartTypes: ["bar", "line"],
    useCase: "Perfect for sales teams tracking monthly performance"
  },
  {
    id: 2,  
    title: "Marketing Campaign Analytics",
    description: "Analyze campaign performance, ROI, and engagement metrics",
    industry: "Marketing",
    preview: "/api/preview/marketing",
    sampleData: `Campaign,Spend,Clicks,Conversions,Revenue
Google Ads,5000,1200,48,12000
Facebook,3500,980,36,8640
LinkedIn,2000,320,12,3600
Email,500,850,42,10080`,
    chartTypes: ["pie", "bar"],
    useCase: "Marketing managers optimizing ad spend and ROI"
  },
  {
    id: 3,
    title: "Website Traffic Analysis", 
    description: "Monitor website visitors, page views, and conversion rates",
    industry: "Digital",
    preview: "/api/preview/website",
    sampleData: `Date,Visitors,Page Views,Bounce Rate,Conversions
2024-01-01,1200,2400,45,24
2024-01-02,1350,2700,42,27
2024-01-03,980,1960,48,19
2024-01-04,1450,2900,40,29`,
    chartTypes: ["line", "bar"],
    useCase: "Website owners tracking growth and optimization"
  },
  {
    id: 4,
    title: "Financial Expense Tracking",
    description: "Monitor business expenses, budgets, and cost categories", 
    industry: "Finance",
    preview: "/api/preview/expenses",
    sampleData: `Category,Jan,Feb,Mar,Apr
Office,2500,2300,2600,2400
Marketing,5000,4500,6000,5500
Software,1200,1200,1400,1300
Travel,800,1200,600,900`,
    chartTypes: ["bar", "pie"],
    useCase: "Small business owners managing budgets and expenses"
  }
]

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const downloadTemplate = (template) => {
    const blob = new Blob([template.sampleData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.title.toLowerCase().replace(/\s+/g, '-')}-template.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Templates</h1>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Ready-to-Use Dashboard Templates
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Download sample CSV files and see instant dashboard examples
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sampleTemplates.map(template => (
            <div key={template.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {template.industry}
                  </span>
                  <button
                    onClick={() => downloadTemplate(template)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Download CSV ↓
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {template.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {template.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Data Preview:</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-600 overflow-x-auto">
                    {template.sampleData.split('\n').slice(0, 3).map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                    <div className="text-gray-400">...</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Charts:</h4>
                  <div className="flex space-x-2">
                    {template.chartTypes.map(type => (
                      <span key={type} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Chart
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  <strong>Use Case:</strong> {template.useCase}
                </p>

                <button
                  onClick={() => setSelectedTemplate(template)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                >
                  Try This Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How to Use Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Use These Templates</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Download Template</h4>
              <p className="text-gray-600">Click "Download CSV" to get the sample data file with the right format</p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Customize with Your Data</h4>
              <p className="text-gray-600">Replace the sample data with your own numbers while keeping the column structure</p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Upload & Visualize</h4>
              <p className="text-gray-600">Upload your customized CSV to instantly generate beautiful, shareable dashboards</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="/"
              className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 text-lg font-medium"
            >
              Start Creating Your Dashboard →
            </a>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Use Our Templates?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">⚡</div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Setup</h4>
              <p className="text-gray-600 text-sm">Pre-formatted data structures save you hours of setup time</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">📊</div>
              <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
              <p className="text-gray-600 text-sm">Proven data visualization formats that actually work</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">🎯</div>
              <h4 className="font-semibent text-gray-900 mb-2">Industry-Specific</h4>
              <p className="text-gray-600 text-sm">Tailored for common business use cases and metrics</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">🚀</div>
              <h4 className="font-semibold text-gray-900 mb-2">Ready to Share</h4>
              <p className="text-gray-600 text-sm">Professional-looking dashboards you can share immediately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}