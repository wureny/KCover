"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so we can safely show the UI once we're on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Avoid rendering theme-dependent components before client-side hydration
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
} 