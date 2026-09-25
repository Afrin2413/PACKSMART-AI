import React from 'react';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-950 border-t border-brand-lime/10 py-8 px-6 text-xs text-warm-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-lime" />
          <span className="font-semibold text-warm-200">PACKSMART AI</span>

        </div>

        <div className="text-center md:text-right text-[11px]">
          <p>
            "Choose the Right Packaging. Reduce Waste. Extend Shelf Life."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
