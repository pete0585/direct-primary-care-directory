import Link from 'next/link'
import { Stethoscope } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-navy-dark text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-5 h-5 text-brand-teal" aria-label="DPC Finder" />
              <span className="font-display text-white text-sm tracking-wide">
                DirectPrimaryCareFinder.com
              </span>
            </Link>
            <p className="text-sm font-body leading-relaxed max-w-xs">
              The national directory for Direct Primary Care practices. Find a DPC doctor who has time
              for you — flat monthly fee, no insurance required.
            </p>
          </div>

          <div>
            <h3 className="text-white font-display text-xs uppercase tracking-widest mb-4">For Patients</h3>
            <ul className="space-y-2 text-sm font-body">
              <li><Link href="/listings" className="hover:text-white transition-colors">Find a DPC Practice</Link></li>
              <li><Link href="/categories/family-medicine" className="hover:text-white transition-colors">Family Medicine</Link></li>
              <li><Link href="/categories/pediatrics" className="hover:text-white transition-colors">Pediatrics</Link></li>
              <li><Link href="/categories/womens-health" className="hover:text-white transition-colors">Women&apos;s Health</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display text-xs uppercase tracking-widest mb-4">For Physicians</h3>
            <ul className="space-y-2 text-sm font-body">
              <li><Link href="/submit" className="hover:text-white transition-colors">Add Your Practice</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-colors">Verified ($99/yr)</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-colors">Featured ($199/yr)</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-xs font-body text-center">
          <p>
            &copy; {new Date().getFullYear()} DirectPrimaryCareFinder.com — Not affiliated with any insurance carrier or medical association.
            DPC is a subscription-based model and does not replace insurance.
          </p>
        </div>
      </div>
    </footer>
  )
}
