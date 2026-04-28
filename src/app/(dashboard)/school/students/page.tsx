import { createClient } from '@/lib/supabase/server'
import StudentsTable from './StudentsTable'
import type { StudentRow } from './StudentsTable'
import type { BusRow } from '../buses/BusesTable'

export default async function StudentsPage() {
  const supabase = createClient()
  const [studentsResult, busesResult] = await Promise.all([
    supabase.rpc('get_students_with_bus'),
    supabase.rpc('get_buses_with_drivers'),
  ])
  return (
    <StudentsTable
      initialStudents={(studentsResult.data ?? []) as StudentRow[]}
      buses={(busesResult.data ?? []) as BusRow[]}
    />
  )
}
