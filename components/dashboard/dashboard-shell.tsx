// Re-export auth utilities for backwards compatibility.
// The actual auth logic lives in auth-provider.tsx, which is rendered
// by the dashboard layout. This file exists so that existing imports
// like `import { useAuth } from '@/components/dashboard/dashboard-shell'`
// continue to resolve correctly.

export { useAuth, AuthContext } from '@/components/dashboard/auth-provider'
