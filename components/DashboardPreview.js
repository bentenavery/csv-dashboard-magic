import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function DashboardPreview({ data, fileName }) {
  const [chartData, setChartData] = useState(null)
  const [chartType, setChartType] = useState('bar')
  const [columns, setColumns] = useState([])
  const [selectedColumns, setSelectedColumns] = useState({ x: '', y: '' })

  useEffect(() => {
    if (data && data.length > 0) {
      const cols = Object.keys(data[0])
      setColumns(cols)
      
      // Auto-detect best columns
      const numericCols = cols.filter(col => 
        data.some(row => !isNaN(parseFloat(row[col])) && isFinite(row[col]))
      )
      const textCols = cols.filter(col => 
        !numericCols.includes(col)
      )

      setSelectedColumns({
        x: textCols[0] || cols[0],
        y: numericCols[0] || cols[1]
      })
    }
  }, [data])

  useEffect(() => {
    if (data && selectedColumns.x && selectedColumns.y) {
      generateChartData()
    }
  }, [data, selectedColumns, chartType])

  const generateChartData = () => {
    if (!data || !selectedColumns.x || !selectedColumns.y) return

    // Group data by X axis
    const groupedData = {}
    data.forEach(row => {
      const xValue = row[selectedColumns.x]
      const yValue = parseFloat(row[selectedColumns.y]) || 0
      
      if (groupedData[xValue]) {
        groupedData[xValue] += yValue
      } else {
        groupedData[xValue] = yValue
      }
    })

    const labels = Object.keys(groupedData).slice(0, 20) // Limit to 20 items
    const values = labels.map(label => groupedData[label])

    const colors = [
      'rgba(99, 102, 241, 0.8)',
      'rgba(168, 85, 247, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(6, 182, 212, 0.8)',
    ]

    const chartConfig = {
      labels,
      datasets: [
        {
          label: selectedColumns.y,
          data: values,
          backgroundColor: chartType === 'pie' 
            ? colors.slice(0, labels.length)
            : colors[0],
          borderColor: chartType === 'pie'
            ? colors.slice(0, labels.length).map(color => color.replace('0.8', '1'))
            : colors[0].replace('0.8', '1'),
          borderWidth: 1,
        },
      ],
    }

    setChartData(chartConfig)
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: chartType === 'pie' ? 'bottom' : 'top',
      },
      title: {
        display: true,
        text: `${selectedColumns.y} by ${selectedColumns.x}`,
      },
    },
    scales: chartType === 'pie' ? {} : {
      y: {
        beginAtZero: true,
      },
    },
  }

  const renderChart = () => {
    if (!chartData) return null

    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />
      case 'line':
        return <Line data={chartData} options={chartOptions} />
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />
      default:
        return <Bar data={chartData} options={chartOptions} />
    }
  }

  if (!data || data.length === 0) {
    return <div>No data to display</div>
  }

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur opacity-30 animate-pulse"></div>
      
      <div className="relative bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-2">
              ✨ Your Dashboard Is Ready!
            </h2>
            <p className="text-purple-200">
              Created from: <span className="font-semibold text-pink-300">{fileName}</span>
            </p>
          </div>
          <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center">
            <span className="mr-2">💾</span>
            Save Dashboard
          </button>
        </div>

      {/* Chart Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-2xl border border-purple-300/20 backdrop-blur-sm">
        <div>
          <label className="block text-sm font-bold text-purple-100 mb-3 flex items-center">
            <span className="mr-2">📊</span>
            Chart Type
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full bg-white/10 border border-purple-300/30 rounded-xl px-4 py-3 text-white font-medium backdrop-blur-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
          >
            <option value="bar" className="bg-purple-900 text-white">📊 Bar Chart</option>
            <option value="line" className="bg-purple-900 text-white">📈 Line Chart</option>
            <option value="pie" className="bg-purple-900 text-white">🥧 Pie Chart</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-purple-100 mb-3 flex items-center">
            <span className="mr-2">📏</span>
            X Axis (Categories)
          </label>
          <select
            value={selectedColumns.x}
            onChange={(e) => setSelectedColumns({...selectedColumns, x: e.target.value})}
            className="w-full bg-white/10 border border-purple-300/30 rounded-xl px-4 py-3 text-white font-medium backdrop-blur-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
          >
            {columns.map(col => (
              <option key={col} value={col} className="bg-purple-900 text-white">{col}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-purple-100 mb-3 flex items-center">
            <span className="mr-2">📐</span>
            Y Axis (Values)
          </label>
          <select
            value={selectedColumns.y}
            onChange={(e) => setSelectedColumns({...selectedColumns, y: e.target.value})}
            className="w-full bg-white/10 border border-purple-300/30 rounded-xl px-4 py-3 text-white font-medium backdrop-blur-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
          >
            {columns.map(col => (
              <option key={col} value={col} className="bg-purple-900 text-white">{col}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
        <div className="h-96">
          {renderChart()}
        </div>
      </div>

      {/* Data Preview */}
      <div className="bg-gradient-to-r from-indigo-800/20 to-purple-800/20 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-2">📋</span>
          Data Preview 
          <span className="ml-2 text-pink-300">({data.length} rows)</span>
        </h3>
        
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600/50 to-pink-600/50">
                {columns.slice(0, 5).map(col => (
                  <th
                    key={col}
                    className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white/5 backdrop-blur-sm divide-y divide-white/10">
              {data.slice(0, 5).map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  {columns.slice(0, 5).map(col => (
                    <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-purple-100 font-medium">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.length > 5 && (
          <p className="mt-4 text-purple-300 text-center">
            ✨ and {data.length - 5} more rows of awesome data
          </p>
        )}
      </div>

      {/* Share Options */}
      <div className="mt-8 pt-8 border-t border-white/20">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-2">🚀</span>
          Share Your Masterpiece
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
            <span className="mr-2 group-hover:animate-bounce">📧</span>
            Share via Email
          </button>
          
          <button className="group bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
            <span className="mr-2 group-hover:animate-bounce">🔗</span>
            Get Share Link
          </button>
          
          <button className="group bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
            <span className="mr-2 group-hover:animate-bounce">📱</span>
            Export Image
          </button>
        </div>
      </div>
    </div>
      </div>
  )
}