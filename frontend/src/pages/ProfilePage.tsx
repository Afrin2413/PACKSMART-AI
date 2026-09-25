import React, { useState } from 'react';
import {
  UserCheck, ShieldCheck, Mail, Building, Cpu, Check,
  Sparkles, Save, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, mode, setMode, logout } = useAuth();
  const [name, setName] = useState(user?.name || 'Anusri P');
  const [role, setRole] = useState<UserRole>(user?.role || 'Researcher');
  const [organization, setOrganization] = useState(user?.organization || 'National Institute of Food Technology');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-lime">
            ACCOUNT & LABORATORY PROFILE
          </span>
          <h1 className="text-2xl font-black text-warm-100 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-brand-lime" />
            Scientist Profile & Preferences
          </h1>
          <p className="text-xs text-warm-300 mt-0.5">
            Manage your researcher credentials, institutional affiliation, and experience mode.
          </p>
        </div>

        <button
          onClick={logout}
          className="btn-secondary text-xs py-2 px-4 text-red-400 border-red-900/40 hover:bg-red-950/40 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-brand-emerald/30 border border-brand-lime/40 text-brand-lightlime text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Profile configuration saved successfully.</span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <div className="lab-card p-6 sm:p-8 border-brand-lime/20 space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-warm-200 mb-1.5">Scientist Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full lab-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-warm-200 mb-1.5">Registered Email</label>
              <input
                type="email"
                disabled
                value={user?.email || 'anusri@packsmart.ai'}
                className="w-full lab-input text-xs opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-warm-200 mb-1.5">Primary Stakeholder Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full lab-input text-xs"
              >
                <option value="Farmer">Farmer / FPO Producer</option>
                <option value="Startup">Food Startup Innovator</option>
                <option value="Business">Food Processing Industry</option>
                <option value="Researcher">Packaging Scientist / Academic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-warm-200 mb-1.5">Institutional Unit / Affiliation</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full lab-input text-xs"
              />
            </div>
          </div>

          {/* Experience Mode Toggle */}
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-2">
            <label className="block text-xs font-semibold text-warm-200">
              Default Recommendation Experience Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('Beginner')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'Beginner'
                    ? 'bg-brand-emerald/30 border-brand-lime text-brand-lightlime'
                    : 'bg-charcoal-950 border-charcoal-700 text-warm-400'
                }`}
              >
                <div className="font-bold text-xs">Beginner Mode</div>
                <div className="text-[10px] text-warm-300 mt-0.5">
                  Visual explanations, simplified questions, and high-level summaries.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('Expert')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'Expert'
                    ? 'bg-amber-950/40 border-brand-amber text-brand-amber'
                    : 'bg-charcoal-950 border-charcoal-700 text-warm-400'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <Cpu className="w-3 h-3" />
                  Expert Mode
                </div>
                <div className="text-[10px] text-warm-300 mt-0.5">
                  Detailed OTR, WVTR, MAP gas ratios, thickness, and technical reasoning.
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="btn-primary text-xs py-2.5 px-6"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
