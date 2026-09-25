import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, History, Scale, Activity,
  Calculator, Leaf, BookOpen, UserCheck, ShieldCheck, X, Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'New Analysis', path: '/new-analysis', icon: PlusCircle, highlight: true },
    { label: 'My Analyses', path: '/history', icon: History },
    { label: 'Compare Materials', path: '/compare', icon: Scale },
    { label: 'Shelf-Life Simulator', path: '/simulator', icon: Activity },
    { label: 'Cost Calculator', path: '/cost-calculator', icon: Calculator },
    { label: 'Sustainability Engine', path: '/sustainability', icon: Leaf },
    { label: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
    { label: 'Profile & Settings', path: '/profile', icon: UserCheck },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-charcoal-950 border-r border-brand-lime/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-charcoal-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-emerald to-brand-lime p-0.5 shadow-glow-lime">
              <div className="w-full h-full bg-charcoal-900 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand-lime group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-base tracking-wider text-warm-100 flex items-center gap-1.5">
                PACKSMART <span className="text-brand-lime">AI</span>
              </div>
              <div className="text-[10px] text-warm-400 font-mono tracking-tight">
                Food Packaging
              </div>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-warm-400 hover:text-warm-100 hover:bg-charcoal-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-emerald/40 to-brand-lime/10 text-brand-lightlime border border-brand-lime/30 shadow-sm'
                      : item.highlight
                      ? 'text-brand-lime hover:bg-brand-lime/10 border border-brand-lime/20'
                      : 'text-warm-300 hover:text-warm-100 hover:bg-charcoal-800/60'
                  }`
                }
              >
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-brand-lime' : ''}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-lime/20 text-brand-lime">
                    CORE
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Footer Badge */}
        <div className="p-4 border-t border-charcoal-800">
          <div className="bg-charcoal-900 border border-charcoal-700/80 rounded-2xl p-3 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-brand-lime animate-ping"></span>
              <span className="text-[11px] font-semibold text-warm-100">Live AI Engine Active</span>
            </div>
            <p className="text-[10px] text-warm-400 leading-tight">
              Hybrid Scikit-Learn + Packaging Science Rule Orchestrator (v1.0)
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
