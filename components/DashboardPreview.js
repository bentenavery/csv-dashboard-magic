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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Dashboard: {fileName}
        </h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Save Dashboard
        </button>
      </div>

      {/* Chart Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chart Type
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            X Axis (Categories)
          </label>
          <select
            value={selectedColumns.x}
            onChange={(e) => setSelectedColumns({...selectedColumns, x: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Y Axis (Values)
          </label>
          <select
            value={selectedColumns.y}
            onChange={(e) => setSelectedColumns({...selectedColumns, y: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Display */}
      <div className="h-96 mb-6">
        {renderChart()}
      </div>

      {/* Data Preview */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Data Preview ({data.length} rows)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.slice(0, 5).map(col => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 5).map((row, idx) => (
                <tr key={idx}>
                  {columns.slice(0, 5).map(col => (
                    <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > 5 && (
          <p className="mt-2 text-sm text-gray-500">
            ... and {data.length - 5} more rows
          </p>
        )}
      </div>

      {/* Share Options */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Share Dashboard</h3>
        <div className="flex space-x-4">
          <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
            📧 Share via Email
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
            🔗 Get Share Link
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
            📱 Export as Image
          </button>
        </div>
      </div>
    </div>
  )
}