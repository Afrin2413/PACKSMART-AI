import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('anusri@packsmart.ai');
  const [password, setPassword] = useState('packsmart2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center p-6 text-warm-100 selection:bg-brand-lime selection:text-charcoal-950">
      <div className="max-w-md w-full">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-emerald to-brand-lime p-0.5 shadow-glow-lime">
              <div className="w-full h-full bg-charcoal-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand-lime" />
              </div>
            </div>
            <span className="font-black text-xl tracking-wider text-warm-100">
              PACKSMART <span className="text-brand-lime">AI</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-warm-100">Sign In to Packaging Laboratory</h1>
          <p className="text-xs text-warm-300 mt-1">Access AI decision engine, analyses history & reports</p>
        </div>

        {/* Card Form */}
        <div className="lab-card p-6 sm:p-8 border-brand-lime/20 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-warm-200 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full lab-input pl-10 text-xs"
                  placeholder="name@organization.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-warm-200">Password</label>
                <button
                  type="button"
                  onClick={() => alert("For demo purposes, you can use pre-seeded accounts: anusri@packsmart.ai (packsmart2026), farmer.rajesh@agrifarm.in (farmer123), etc.")}
                  className="text-[11px] text-brand-lime hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full lab-input pl-10 text-xs"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-xs mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-charcoal-700/60">
            <div className="text-[11px] font-semibold text-warm-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
              Quick Demo Accounts:
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('anusri@packsmart.ai', 'packsmart2026')}
                className="p-2 rounded-lg bg-charcoal-900 border border-charcoal-700 hover:border-brand-lime text-left text-warm-200"
              >
                <div className="font-bold text-brand-lime">Researcher</div>
                <div className="text-warm-400 truncate">anusri@packsmart.ai</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer.rajesh@agrifarm.in', 'farmer123')}
                className="p-2 rounded-lg bg-charcoal-900 border border-charcoal-700 hover:border-brand-lime text-left text-warm-200"
              >
                <div className="font-bold text-brand-amber">Farmer FPO</div>
                <div className="text-warm-400 truncate">farmer.rajesh@...</div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-warm-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-lime font-medium hover:underline">
            Register for PackSmart AI
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
