import { createClient } from '@/lib/supabase/server'
import BusesTable from './BusesTable'
import type { BusRow } from './BusesTable'

export default async function BusesPage() {
  const supabase = createClient()
  const { data } = await supabase.rpc('get_buses_with_drivers')
  return <BusesTable initialBuses={(data ?? []) as BusRow[]} />
}
