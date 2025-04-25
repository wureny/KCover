"use client"

import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

export default function Header() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            K-Cover
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link 
              href="/" 
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/algorithm" 
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Algorithm Demo
            </Link>
            <Link 
              href="/docs" 
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Documentation
            </Link>
          </nav>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
} 