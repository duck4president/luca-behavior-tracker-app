import React, { useState, useEffect } from 'react'
import { formatDate, formatDisplayDate } from '../utils/dateHelpers'
import { 
  supabase,
  createDailyEntry, 
  getDailyEntry, 
  getMedications, 
  saveDailyMedications, 
  saveTantrumBehaviors,
  DailyEntry,
  Medication
} from '../utils/supabase'

interface DailyFormProps {
  selectedDate: Date
  onSave: () => void
  onClose: () => void
  onDateChange?: (date: Date) => void
}

interface FormData {
  overall_rating: number
  tantrum_rating: number
  focus_rating: number
  iep_score: number
  notes: string
  medications: { [key: string]: boolean }
  tantrum_behaviors: {
    screaming: boolean
    swearing: boolean
    throwing: boolean
    hitting: boolean
    threatening: boolean
  }
}

const RatingScale: React.FC<{
  label: string
  value: number
  onChange: (value: number) => void
  color?: string
}> = ({ label, value, onChange, color = 'primary' }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-900 mb-3">
        {label}
        <span className="ml-2 text-lg font-bold text-gray-700">({value}/7)</span>
      </label>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5, 6, 7].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`
              w-10 h-10 rounded-full border-2 font-semibold text-sm transition-all
              ${value === rating
                ? `bg-${color}-500 border-${color}-500 text-white shadow-lg scale-110`
                : `border-gray-300 text-gray-600 hover:border-${color}-300 hover:bg-${color}-50`
              }
            `}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  )
}

const CheckboxGroup: React.FC<{
  label: string
  options: { key: string; label: string }[]
  values: { [key: string]: boolean }
  onChange: (key: string, value: boolean) => void
}> = ({ label, options, values, onChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-900 mb-3">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.key} className="flex items-center">
            <input
              type="checkbox"
              checked={values[option.key] || false}
              onChange={(e) => onChange(option.key, e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
            />
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export const DailyForm: React.FC<DailyFormProps> = ({ selectedDate, onSave, onClose, onDateChange }) => {
  const [loading, setLoading] = useState(false)
  const [medications, setMedications] = useState<Medication[]>([])
  const [existingEntry, setExistingEntry] = useState<DailyEntry | null>(null)
  const [formData, setFormData] = useState<FormData>({
    overall_rating: 4,
    tantrum_rating: 4,
    focus_rating: 4,
    iep_score: 36,
    notes: '',
    medications: {},
    tantrum_behaviors: {
      screaming: false,
      swearing: false,
      throwing: false,
      hitting: false,
      threatening: false
    }
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load medications
        const meds = await getMedications()
        setMedications(meds || [])

        // Load existing entry for this date
        const dateStr = formatDate(selectedDate)
        const entry = await getDailyEntry(dateStr)
        
        if (entry) {
          setExistingEntry(entry)
          setFormData({
            overall_rating: entry.overall_rating,
            tantrum_rating: entry.tantrum_rating,
            focus_rating: entry.focus_rating,
            iep_score: entry.iep_score || 36,
            notes: entry.notes,
            medications: entry.daily_medications?.reduce((acc: any, dm: any) => {
              acc[dm.medication_id] = dm.taken
              return acc
            }, {}) || {},
            tantrum_behaviors: entry.tantrum_behaviors?.[0] || {
              screaming: false,
              swearing: false,
              throwing: false,
              hitting: false,
              threatening: false
            }
          })
        } else {
          // Set default medications to checked based on yesterday's entry
          const yesterday = new Date(selectedDate)
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayEntry = await getDailyEntry(formatDate(yesterday))
          
          if (yesterdayEntry?.daily_medications) {
            const defaultMedications = yesterdayEntry.daily_medications.reduce((acc: any, dm: any) => {
              if (dm.taken) acc[dm.medication_id] = true
              return acc
            }, {})
            setFormData(prev => ({ ...prev, medications: defaultMedications }))
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dateStr = formatDate(selectedDate)
      
      let dailyEntry: DailyEntry

      if (existingEntry) {
        // Update existing entry
        const { data: updatedEntry } = await supabase
          .from('daily_entries')
          .update({
            overall_rating: formData.overall_rating,
            tantrum_rating: formData.tantrum_rating,
            focus_rating: formData.focus_rating,
            iep_score: formData.iep_score,
            notes: formData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEntry.id)
          .select()
          .single()
        
        dailyEntry = updatedEntry
      } else {
        // Create new entry
        dailyEntry = await createDailyEntry({
          date: dateStr,
          overall_rating: formData.overall_rating,
          tantrum_rating: formData.tantrum_rating,
          focus_rating: formData.focus_rating,
          iep_score: formData.iep_score,
          notes: formData.notes
        })
      }

      // Save medications
      const medicationEntries = Object.entries(formData.medications).map(([medicationId, taken]) => ({
        medication_id: medicationId,
        taken
      }))
      
      if (medicationEntries.length > 0) {
        await saveDailyMedications(dailyEntry.id, medicationEntries)
      }

      // Save tantrum behaviors
      await saveTantrumBehaviors(dailyEntry.id, formData.tantrum_behaviors)

      onSave()
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('Error saving entry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const tantrumBehaviorOptions = [
    { key: 'screaming', label: 'Screaming' },
    { key: 'swearing', label: 'Swearing' },
    { key: 'throwing', label: 'Throwing' },
    { key: 'hitting', label: 'Hitting' },
    { key: 'threatening', label: 'Threatening' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full my-8 flex flex-col max-h-screen">
        <div className="flex-shrink-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">
            Daily Check-in
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Date Picker Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Select Date
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="date"
                value={formatDate(selectedDate)}
                onChange={(e) => {
                  if (e.target.value && onDateChange) {
                    // Create date in local timezone to avoid date shifting
                    const [year, month, day] = e.target.value.split('-').map(Number)
                    const localDate = new Date(year, month - 1, day)
                    onDateChange(localDate)
                  }
                }}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => onDateChange && onDateChange(new Date())}
                className="px-3 py-2 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
              >
                Today
              </button>
            </div>
            <div className="mt-2 text-center">
              <p className="text-lg font-medium text-gray-700">
                {formatDisplayDate(selectedDate)}
              </p>
              {existingEntry && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Entry exists for this date
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Medications */}
            {medications.length > 0 && (
              <CheckboxGroup
                label="Medications & Supplements"
                options={medications.map(med => ({ key: med.id, label: med.name }))}
                values={formData.medications}
                onChange={(key, value) => 
                  setFormData(prev => ({
                    ...prev,
                    medications: { ...prev.medications, [key]: value }
                  }))
                }
              />
            )}

            {/* Overall Rating */}
            <RatingScale
              label="Overall Day"
              value={formData.overall_rating}
              onChange={(value) => setFormData(prev => ({ ...prev, overall_rating: value }))}
              color="primary"
            />

            {/* Tantrum Rating */}
            <RatingScale
              label="Tantrum Severity"
              value={formData.tantrum_rating}
              onChange={(value) => setFormData(prev => ({ ...prev, tantrum_rating: value }))}
              color="accent"
            />

            {/* Tantrum Behaviors */}
            <CheckboxGroup
              label="Tantrum Behaviors"
              options={tantrumBehaviorOptions}
              values={formData.tantrum_behaviors}
              onChange={(key, value) =>
                setFormData(prev => ({
                  ...prev,
                  tantrum_behaviors: { ...prev.tantrum_behaviors, [key]: value }
                }))
              }
            />

            {/* Focus Rating */}
            <RatingScale
              label="Focus Level"
              value={formData.focus_rating}
              onChange={(value) => setFormData(prev => ({ ...prev, focus_rating: value }))}
              color="primary"
            />

            {/* IEP Score */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                IEP Score
                <span className="ml-2 text-lg font-bold text-gray-700">({formData.iep_score}/72)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={formData.iep_score}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(72, parseInt(e.target.value) || 1))
                    setFormData(prev => ({ ...prev, iep_score: value }))
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-lg font-semibold text-center"
                  placeholder="Enter score (1-72)"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400 text-sm">/ 72</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Daily behavior score (1 = lowest, 72 = highest)
              </p>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Daily Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Any additional observations or notes..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
