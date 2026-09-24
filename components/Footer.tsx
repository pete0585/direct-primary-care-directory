import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import NewsletterSignup from '@/components/NewsletterSignup';
export default function Footer() {
    return (<footer className="bg-brand-navy-dark text-gray-400 mt-20">
      <></>
    
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">
              <a href="https://studiozerohq.com" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors">Powered by AIdam</a>
              {' · '}
              <a href="https://studiozerohq.com" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors">Studio Zero — AI Marketing Operators for Healthcare</a>
            </p>
          </div>
        
      {/* Newsletter signup compact */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <NewsletterSignup compact/>
      </div>
  </footer>);
}
