import { createContext, useContext, type ReactNode } from 'react'
import { useDriverData } from '@/features/driver/hooks/useDriverData'

type DriverContextValue = ReturnType<typeof useDriverData>

const DriverDataContext = createContext<DriverContextValue | null>(null)

export function DriverDataProvider({ children }: { children: ReactNode }) {
  const value = useDriverData()
  return <DriverDataContext.Provider value={value}>{children}</DriverDataContext.Provider>
}

export function useDriverContext(): DriverContextValue {
  const ctx = useContext(DriverDataContext)
  if (!ctx) throw new Error('useDriverContext must be used inside DriverDataProvider')
  return ctx
}
