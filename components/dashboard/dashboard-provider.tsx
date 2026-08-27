'use client'

import { createContext, useContext } from 'react'

interface DashboardUser {
  id: string
  username: string
  avatar: string | null
  global_name: string | null
}

interface DashboardContextType {
  accessToken: string | null
  user: DashboardUser | null
}

const DashboardContext = createContext<DashboardContextType>({
  accessToken: null,
  user: null,
})

export function DashboardProvider({
  accessToken,
  user,
  children,
}: {
  accessToken: string | null
  user: DashboardUser | null
  children: React.ReactNode
}) {
  return (
    <DashboardContext.Provider value={{ accessToken, user }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  return useContext(DashboardContext)
}
