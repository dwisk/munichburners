"use client"

import { LanguageProvider } from "munichburners/lib/LanguageContext"
import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

// THIS WILL WORK

export default function Providers({ session, children }: { session: Session | null, children: React.ReactNode }) {
    return (
        <SessionProvider session={session}>
            <LanguageProvider>
              {children}
            </LanguageProvider>
        </SessionProvider>
    )
}