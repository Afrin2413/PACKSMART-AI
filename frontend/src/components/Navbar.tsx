import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, Search, User as UserIcon, LogOut, Sparkles, ChevronDown,
  Layers, ShieldAlert, Cpu, Check, HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout, mode, setMode } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'High Moisture Alert', text: 'Tomato condensation threshold exceeded in ambient storage.', time: '10m ago' },
    { id: 2, title: 'Cost Optimization', text: 'Switching to BOPP reduced biscuit unit cost by 18.5%.', time: '1h ago' },
    { id: 3, title: 'Report Generated', text: 'PDF analysis report AN-1004 is ready for download.', time: '2h ago' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-charcoal-950/80 backdrop-blur-md border-b border-brand-lime/10 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Global Search */}
        <div className="flex items-center gap-4 flex-1 max-w-lg">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-charcoal-800 text-warm-200 hover:text-brand-lime border border-brand-lime/20"
            aria-label="Toggle Navigation"
          >
            <Layers className="w-5 h-5" />
          </button>

          <div className="relative w-full hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
            <input
              type="text"
              placeholder="Search food commodities, materials (e.g. EVOH, Tomato, OTR)..."
              className="w-full bg-charcoal-900 border border-charcoal-700 text-warm-100 text-xs rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-brand-lime transition-all"
            />
          </div>
        </div>

        {/* Right Side: Mode Switcher, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Beginner / Expert Mode Toggle */}
          <div className="hidden md:flex items-center bg-charcoal-900 border border-charcoal-700 rounded-xl p-1 text-xs">
            <button
              onClick={() => setMode('Beginner')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                mode === 'Beginner'
                  ? 'bg-brand-emerald text-warm-100 shadow-sm'
                  : 'text-warm-400 hover:text-warm-200'
              }`}
            >
              Beginner Mode
            </button>
            <button
              onClick={() => setMode('Expert')}
              className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                mode === 'Expert'
                  ? 'bg-brand-amber/20 text-brand-amber border border-brand-amber/40 shadow-sm'
                  : 'text-warm-400 hover:text-warm-200'
              }`}
            >
              <Cpu className="w-3 h-3" />
              Expert Mode
            </button>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-charcoal-800 border border-charcoal-700 text-warm-300 hover:text-brand-lime hover:border-brand-lime/40 transition-all"
              aria-label="View Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-lime animate-pulse"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-charcoal-800 border border-charcoal-700 rounded-2xl shadow-xl p-4 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-charcoal-700">
                  <h4 className="text-xs font-semibold text-warm-100 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-brand-amber" />
                    Packaging Intelligence Alerts
                  </h4>
                  <span className="text-[10px] bg-brand-emerald/40 text-brand-lime px-2 py-0.5 rounded-full">
                    3 New
                  </span>
                </div>

                <div className="divide-y divide-charcoal-700/50 mt-2 space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="pt-2 text-xs">
                      <div className="font-medium text-warm-100">{n.title}</div>
                      <p className="text-[11px] text-warm-400 mt-0.5">{n.text}</p>
                      <span className="text-[10px] text-brand-lime/80 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-charcoal-800 border border-charcoal-700 hover:border-brand-lime/40 transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-emerald to-brand-lime flex items-center justify-center text-charcoal-950 font-bold text-xs">
                {user?.name ? user.name.charAt(0) : 'P'}
              </div>
              <div className="hidden sm:block text-left pr-1">
                <div className="text-xs font-semibold text-warm-100 leading-tight">
                  {user?.name || 'Researcher'}
                </div>
                <div className="text-[10px] text-brand-lime leading-tight">
                  {user?.role || 'Packaging Specialist'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-warm-400" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-charcoal-800 border border-charcoal-700 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-charcoal-700">
                  <div className="text-xs font-semibold text-warm-100">{user?.name}</div>
                  <div className="text-[11px] text-warm-400">{user?.email}</div>
                  <span className="mt-1.5 inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-brand-emerald/40 text-brand-lightlime border border-brand-emerald/50">
                    Role: {user?.role}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-warm-200 hover:bg-charcoal-700 rounded-xl transition-all"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-brand-lime" />
                    Profile & Lab Organization
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-charcoal-700 rounded-xl transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
