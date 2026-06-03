import Link from 'next/link'
import { Stethoscope } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-brand-navy border-b border-brand-navy-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-brand-teal" aria-label="DPC Finder logo" />
            <span className="font-display text-white text-sm tracking-wide hidden sm:block">
              DirectPrimaryCare<span className="text-brand-teal">Finder</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-4">
            <Link
              href="/listings"
              className="text-gray-300 hover:text-white text-sm font-body px-3 py-2 rounded transition-colors"
            >
              Find a Doctor
            </Link>
            <Link
              href="/submit"
              className="text-gray-300 hover:text-white text-sm font-body px-3 py-2 rounded transition-colors"
            >
              Add Practice
            </Link>
            <Link
              href="/submit"
              className="bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-body font-semibold px-4 py-2 rounded transition-colors"
            >
              List Your Practice
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
