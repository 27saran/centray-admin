'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

// ログインセッション情報のプロバイダー
export default function NextAuthSessionProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>
}
