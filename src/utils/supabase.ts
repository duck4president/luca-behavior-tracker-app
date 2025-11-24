import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DailyEntry {
  id: string
  date: string
  overall_rating: number
  tantrum_rating: number
  focus_rating: number
  iep_score?: number
  notes: string
  created_at: string
  updated_at: string
}

export interface Medication {
  id: string
  name: string
  is_active: boolean
  created_at: string
}

export interface DailyMedication {
  id: string
  daily_entry_id: string
  medication_id: string
  taken: boolean
}

export interface TantrumBehavior {
  id: string
  daily_entry_id: string
  screaming: boolean
  swearing: boolean
  throwing: boolean
  hitting: boolean
  threatening: boolean
}

export interface ChartAnnotation {
  id: string
  date: string
  note: string
  created_at: string
}

// Database functions
export const createDailyEntry = async (entry: Omit<DailyEntry, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('daily_entries')
    .insert([entry])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getDailyEntries = async (startDate?: string, endDate?: string) => {
  let query = supabase
    .from('daily_entries')
    .select(`
      *,
      daily_medications(*, medications(*)),
      tantrum_behaviors(*)
    `)
    .order('date', { ascending: false })
  
  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export const getDailyEntry = async (date: string) => {
  const { data, error } = await supabase
    .from('daily_entries')
    .select(`
      *,
      daily_medications(*, medications(*)),
      tantrum_behaviors(*)
    `)
    .eq('date', date)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export const getMedications = async () => {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('is_active', true)
    .order('name')
  
  if (error) throw error
  return data
}

export const createMedication = async (name: string) => {
  const { data, error } = await supabase
    .from('medications')
    .insert([{ name, is_active: true }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const saveDailyMedications = async (dailyEntryId: string, medications: { medication_id: string, taken: boolean }[]) => {
  // First delete existing entries for this date
  await supabase
    .from('daily_medications')
    .delete()
    .eq('daily_entry_id', dailyEntryId)
  
  // Insert new entries
  const medicationEntries = medications.map(med => ({
    daily_entry_id: dailyEntryId,
    medication_id: med.medication_id,
    taken: med.taken
  }))
  
  const { data, error } = await supabase
    .from('daily_medications')
    .insert(medicationEntries)
  
  if (error) throw error
  return data
}

export const saveTantrumBehaviors = async (dailyEntryId: string, behaviors: Omit<TantrumBehavior, 'id' | 'daily_entry_id'>) => {
  // First delete existing entry for this date
  await supabase
    .from('tantrum_behaviors')
    .delete()
    .eq('daily_entry_id', dailyEntryId)
  
  // Insert new entry
  const { data, error } = await supabase
    .from('tantrum_behaviors')
    .insert([{ ...behaviors, daily_entry_id: dailyEntryId }])
  
  if (error) throw error
  return data
}
