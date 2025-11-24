import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, addWeeks } from 'date-fns'

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd')
}

export const formatDisplayDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy')
}

export const formatShortDate = (date: Date): string => {
  return format(date, 'MMM d')
}

export const getWeekRange = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }) // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return { start, end }
}

export const getWeekDays = (date: Date) => {
  const { start, end } = getWeekRange(date)
  return eachDayOfInterval({ start, end })
}

export const getPreviousWeek = (date: Date) => {
  return subWeeks(date, 1)
}

export const getNextWeek = (date: Date) => {
  return addWeeks(date, 1)
}

export const isToday = (date: Date): boolean => {
  const today = new Date()
  return formatDate(date) === formatDate(today)
}

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

export const getDaysAgo = (days: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return formatDate(date)
}

export const getScoreColor = (score: number): string => {
  // Color gradient from red (1) to green (7)
  const colors = [
    '#ef4444', // 1 - red
    '#f97316', // 2 - orange
    '#eab308', // 3 - yellow
    '#84cc16', // 4 - lime
    '#22c55e', // 5 - green
    '#10b981', // 6 - emerald
    '#059669', // 7 - emerald-600
  ]
  
  return colors[Math.max(0, Math.min(6, score - 1))] || colors[3]
}

export const getScoreGradient = (scores: number[]): string => {
  if (scores.length === 0) return '#84cc16'
  
  const colors = scores.map(score => getScoreColor(score))
  
  if (colors.length === 1) return colors[0]
  
  // Create CSS gradient string
  const step = 100 / (colors.length - 1)
  const gradientStops = colors.map((color, index) => 
    `${color} ${index * step}%`
  ).join(', ')
  
  return `linear-gradient(90deg, ${gradientStops})`
}
