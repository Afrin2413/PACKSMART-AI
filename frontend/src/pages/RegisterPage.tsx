import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User as UserIcon, Mail, Lock, Building, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Farmer');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, role, organization || undefined);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center p-6 text-warm-100 selection:bg-brand-lime selection:text-charcoal-950">
      <div className="max-w-lg w-full">
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
          <h1 className="text-xl font-bold text-warm-100">Create Packaging Scientist Account</h1>
          <p className="text-xs text-warm-300 mt-1">Select your stakeholder profile for tailored recommendations</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-warm-200 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full lab-input pl-10 text-xs"
                    placeholder="Dr. Rajesh Kumar"
                  />
                </div>
              </div>

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
                    placeholder="rajesh@krishi.in"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-warm-200 mb-1.5">Primary Role</label>
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
                <label className="block text-xs font-medium text-warm-200 mb-1.5">Organization / Unit</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full lab-input pl-10 text-xs"
                    placeholder="AgriTech Labs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-warm-200 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full lab-input pl-10 text-xs"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-xs mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-xs text-warm-400">
          Already registered?{' '}
          <Link to="/login" className="text-brand-lime font-medium hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
