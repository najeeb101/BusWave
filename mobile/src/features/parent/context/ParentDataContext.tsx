import { createContext, useContext, type ReactNode } from 'react'
import { useParentData } from '@/features/parent/screens/useParentData'

type ParentContextValue = ReturnType<typeof useParentData>

const ParentDataContext = createContext<ParentContextValue | null>(null)

export function ParentDataProvider({ children }: { children: ReactNode }) {
  const value = useParentData()
  return <ParentDataContext.Provider value={value}>{children}</ParentDataContext.Provider>
}

export function useParentContext(): ParentContextValue {
  const ctx = useContext(ParentDataContext)
  if (!ctx) throw new Error('useParentContext must be used inside ParentDataProvider')
  return ctx
}
