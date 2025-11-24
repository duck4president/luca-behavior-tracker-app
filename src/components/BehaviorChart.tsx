import React, { useState, useEffect, useCallback } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { format, parseISO, subDays } from 'date-fns'
import { getDailyEntries, DailyEntry } from '../utils/supabase'
import { formatShortDate, getScoreColor } from '../utils/dateHelpers'

interface BehaviorChartProps {
  onDateClick: (date: Date) => void
  timeWindow: 'week' | 'month' | 'all' | 'custom'
  selectedMetric: 'overall' | 'tantrum' | 'focus' | 'iep'
  customDateRange?: { start: string; end: string }
}

interface ChartDataPoint {
  date: string
  displayDate: string
  overall_rating: number
  tantrum_rating: number
  focus_rating: number
  iep_score: number
  notes: string
  entry: DailyEntry
}

export const BehaviorChart: React.FC<BehaviorChartProps> = ({
  onDateClick,
  timeWindow,
  selectedMetric,
  customDateRange
}) => {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  const loadChartData = useCallback(async () => {
    setLoading(true)
    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
      const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        console.log('Supabase not configured - using demo mode')
        setData([])
        setLoading(false)
        return
      }

      let startDate: string | undefined
      let endDate: string | undefined
      const today = new Date()

      if (timeWindow === 'week') {
        startDate = format(subDays(today, 7), 'yyyy-MM-dd')
      } else if (timeWindow === 'month') {
        startDate = format(subDays(today, 30), 'yyyy-MM-dd')
      } else if (timeWindow === 'custom' && customDateRange?.start && customDateRange?.end) {
        startDate = customDateRange.start
        endDate = customDateRange.end
      }

      const entries = await getDailyEntries(startDate, endDate)
      
      const chartData: ChartDataPoint[] = (entries || []).map(entry => ({
        date: entry.date,
        displayDate: formatShortDate(parseISO(entry.date)),
        overall_rating: entry.overall_rating,
        tantrum_rating: entry.tantrum_rating,
        focus_rating: entry.focus_rating,
        iep_score: entry.iep_score || 0,
        notes: entry.notes,
        entry
      })).reverse() // Reverse to show chronological order

      setData(chartData)
    } catch (error) {
      console.error('Error loading chart data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [timeWindow, customDateRange])

  useEffect(() => {
    loadChartData()
  }, [loadChartData])

  const handlePointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const point = data.activePayload[0].payload as ChartDataPoint
      onDateClick(parseISO(point.date))
    }
  }

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'overall': return 'Overall Day'
      case 'tantrum': return 'Tantrum Severity'
      case 'focus': return 'Focus Level'
      case 'iep': return 'IEP Score'
      default: return 'Overall Day'
    }
  }

  const getMetricKey = () => {
    switch (selectedMetric) {
      case 'overall': return 'overall_rating'
      case 'tantrum': return 'tantrum_rating'
      case 'focus': return 'focus_rating'
      case 'iep': return 'iep_score'
      default: return 'overall_rating'
    }
  }

  const getChartDomain = () => {
    return selectedMetric === 'iep' ? [1, 72] : [1, 7]
  }

  const getScoreDisplay = (value: number) => {
    return selectedMetric === 'iep' ? `${value}/72` : `${value}/7`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">
            {format(parseISO(data.date), 'EEEE, MMM d')}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            {getMetricLabel()}: <span className="font-semibold">{getScoreDisplay(payload[0].value)}</span>
          </p>
          {data.notes && (
            <p className="text-xs text-gray-500 max-w-xs">
              {data.notes.length > 100 ? `${data.notes.substring(0, 100)}...` : data.notes}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">Click to view details</p>
        </div>
      )
    }
    return null
  }

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    const value = payload[getMetricKey()]
    const color = getScoreColor(value)
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={color}
        stroke="#ffffff"
        strokeWidth={2}
        className="cursor-pointer hover:r-6 transition-all"
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No data available</p>
          <p className="text-sm">Start tracking daily entries to see your progress!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {getMetricLabel()} Trends
        </h3>
        <p className="text-sm text-gray-500">
          Click on any point to view that day's details
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            onClick={handlePointClick}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="displayDate"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              domain={getChartDomain()}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference lines for context */}
            <ReferenceLine y={selectedMetric === 'iep' ? 36 : 4} stroke="#d1d5db" strokeDasharray="5 5" />
            
            <Line
              type="monotone"
              dataKey={getMetricKey()}
              stroke={getScoreColor(4)} // Default color
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 6, fill: getScoreColor(4) }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          {selectedMetric === 'iep' ? (
            <>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Low (1-24)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Medium (25-48)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>High (49-72)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Poor (1-2)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Fair (3-4)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Good (5-7)</span>
              </div>
            </>
          )}
        </div>
        <div className="text-right">
          <p>{data.length} entries shown</p>
        </div>
      </div>
    </div>
  )
}
