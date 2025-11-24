import React, { useState, useEffect } from 'react'
import { createMedication, supabase, Medication } from '../utils/supabase'

interface MedicationManagerProps {
  onClose: () => void
}

export const MedicationManager: React.FC<MedicationManagerProps> = ({ onClose }) => {
  const [medications, setMedications] = useState<Medication[]>([])
  const [newMedication, setNewMedication] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadMedications()
  }, [])

  const loadMedications = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('name')
      
      if (error) throw error
      setMedications(data || [])
    } catch (error) {
      console.error('Error loading medications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMedication.trim()) return

    setSaving(true)
    try {
      const medication = await createMedication(newMedication.trim())
      setMedications(prev => [...prev, medication])
      setNewMedication('')
    } catch (error) {
      console.error('Error adding medication:', error)
      alert('Error adding medication. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const toggleMedicationStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('medications')
        .update({ is_active: !isActive })
        .eq('id', id)

      if (error) throw error

      setMedications(prev => 
        prev.map(med => 
          med.id === id ? { ...med, is_active: !isActive } : med
        )
      )
    } catch (error) {
      console.error('Error updating medication:', error)
      alert('Error updating medication. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Medications
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Add new medication form */}
          <form onSubmit={handleAddMedication} className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Add New Medication or Supplement
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="Enter medication name..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={saving || !newMedication.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>

          {/* Medications list */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Current Medications & Supplements
            </label>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading medications...
              </div>
            ) : medications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No medications added yet
              </div>
            ) : (
              <div className="space-y-2">
                {medications.map((medication) => (
                  <div
                    key={medication.id}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border
                      ${medication.is_active 
                        ? 'bg-white border-gray-200' 
                        : 'bg-gray-50 border-gray-100'
                      }
                    `}
                  >
                    <span
                      className={`
                        ${medication.is_active 
                          ? 'text-gray-900' 
                          : 'text-gray-400 line-through'
                        }
                      `}
                    >
                      {medication.name}
                    </span>
                    <button
                      onClick={() => toggleMedicationStatus(medication.id, medication.is_active)}
                      className={`
                        px-3 py-1 text-xs font-medium rounded-full
                        ${medication.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {medication.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
