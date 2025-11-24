import React, { useState } from 'react'
import { DailyForm } from './components/DailyForm'
import { MedicationManager } from './components/MedicationManager'
import { BehaviorChart } from './components/BehaviorChart'

function App() {
  const [showDailyForm, setShowDailyForm] = useState(false)
  const [showMedicationManager, setShowMedicationManager] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<'overall' | 'tantrum' | 'focus' | 'iep'>('overall')
  const [timeWindow, setTimeWindow] = useState<'week' | 'month' | 'all' | 'custom'>('month')
  const [customDateRange, setCustomDateRange] = useState<{start: string, end: string}>({
    start: '',
    end: ''
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [formSelectedDate, setFormSelectedDate] = useState<Date>(new Date())

  const handleTodayClick = () => {
    console.log('Today button clicked!')
    setFormSelectedDate(new Date())
    setShowDailyForm(true)
  }

  const handleMedsClick = () => {
    console.log('Meds button clicked!')
    setShowMedicationManager(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Lucas Behavior Tracker
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleMedsClick}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                Manage Meds
              </button>
              <button
                onClick={() => alert('Test notification clicked!')}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                Test Notification
              </button>
              <button
                onClick={handleTodayClick}
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
              >
                Today's Entry
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Today's Quick Actions
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleTodayClick}
              className="flex-1 bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-lg hover:bg-primary-100 transition-colors text-left"
            >
              <div className="font-medium">Daily Check-in</div>
              <div className="text-sm text-primary-600">
                Wednesday, November 13, 2024
              </div>
            </button>
            <button
              onClick={handleMedsClick}
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <div className="font-medium">Manage Medications</div>
              <div className="text-sm text-gray-600">
                Add or modify medications
              </div>
            </button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Behavior Trends
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Metric Selection */}
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button 
                  onClick={() => setSelectedMetric('overall')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    selectedMetric === 'overall' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  Overall
                </button>
                <button 
                  onClick={() => setSelectedMetric('tantrum')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    selectedMetric === 'tantrum' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  Tantrums
                </button>
                <button 
                  onClick={() => setSelectedMetric('focus')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    selectedMetric === 'focus' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  Focus
                </button>
                <button 
                  onClick={() => setSelectedMetric('iep')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    selectedMetric === 'iep' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  IEP Score
                </button>
              </div>

              {/* Time Window Selection */}
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button 
                  onClick={() => setTimeWindow('week')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    timeWindow === 'week' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  7 Days
                </button>
                <button 
                  onClick={() => setTimeWindow('month')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    timeWindow === 'month' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  30 Days
                </button>
                <button 
                  onClick={() => setTimeWindow('all')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    timeWindow === 'all' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  All Time
                </button>
                <button 
                  onClick={() => setShowDatePicker(true)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    timeWindow === 'custom' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  Custom Range
                </button>
              </div>
            </div>
          </div>

          {/* Behavior Chart */}
          <BehaviorChart
            timeWindow={timeWindow}
            selectedMetric={selectedMetric}
            onDateClick={(date) => {
              setFormSelectedDate(date)
              setShowDailyForm(true)
            }}
            customDateRange={customDateRange}
          />
        </div>
      </main>

      {/* Modals */}
      {showDailyForm && (
        <DailyForm
          selectedDate={formSelectedDate}
          onSave={() => setShowDailyForm(false)}
          onClose={() => setShowDailyForm(false)}
          onDateChange={(date) => setFormSelectedDate(date)}
        />
      )}

      {showMedicationManager && (
        <MedicationManager
          onClose={() => setShowMedicationManager(false)}
        />
      )}

      {/* Date Range Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Date Range
              </h3>
              <button
                onClick={() => setShowDatePicker(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowDatePicker(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customDateRange.start && customDateRange.end) {
                    setTimeWindow('custom')
                    setShowDatePicker(false)
                  }
                }}
                disabled={!customDateRange.start || !customDateRange.end}
                className="flex-1 px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
