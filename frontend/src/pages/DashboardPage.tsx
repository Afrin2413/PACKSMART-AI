import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle, TrendingUp, ShieldCheck, Leaf, DollarSign,
  Activity, AlertTriangle, ArrowRight, Download, FileText,
  Clock, CheckCircle, RefreshCw, BarChart2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import api from '../services/api';
import { DashboardSummary } from '../types';
import { useAuth } from '../context/AuthContext';
import RiskBadge from '../components/RiskBadge';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await api.dashboard.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const PIE_COLORS = ['#7FAF6A', '#D6A85F', '#2E5B3D', '#A8C66C', '#3D5849'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-charcoal-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-lime">
              PACKAGING DECISION COMMAND
            </span>
            <span className="text-[10px] bg-brand-emerald/30 text-brand-lightlime px-2 py-0.5 rounded-full border border-brand-emerald/40">
              Role: {user?.role || 'Researcher'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-100">
            Welcome back, {user?.name || 'Packaging Specialist'}
          </h1>
          <p className="text-xs text-warm-300 mt-1">
            {user?.organization || 'National Institute of Food Technology'} — System Status: Operational
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-charcoal-800 border border-charcoal-700 text-warm-300 hover:text-brand-lime hover:border-brand-lime/40 transition-all"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-lime' : ''}`} />
          </button>
          <Link
            to="/new-analysis"
            className="btn-primary text-xs py-2.5 px-4 shadow-glow-lime"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ New Packaging Analysis</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Analyses Completed */}
        <div className="lab-card p-5 border-charcoal-700">
          <div className="flex items-center justify-between text-warm-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Analyses Completed</span>
            <div className="w-8 h-8 rounded-lg bg-charcoal-800 flex items-center justify-center text-brand-lime">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-warm-100">
            {summary?.analyses_completed ?? 4}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-brand-lime mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active database repository</span>
          </div>
        </div>

        {/* Card 2: Shelf-Life Improvement */}
        <div className="lab-card p-5 border-charcoal-700">
          <div className="flex items-center justify-between text-warm-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avg. Shelf-Life Gain</span>
            <div className="w-8 h-8 rounded-lg bg-brand-emerald/20 flex items-center justify-center text-brand-lightlime">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-warm-100">
            +{summary?.avg_shelf_life_improvement_pct ?? 42.5}%
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-warm-300 mt-2">
            <span>Delays post-harvest spoilage</span>
          </div>
        </div>

        {/* Card 3: Potential Cost Savings */}
        <div className="lab-card p-5 border-charcoal-700">
          <div className="flex items-center justify-between text-warm-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Potential Cost Savings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/40 flex items-center justify-center text-brand-amber">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-brand-amber">
            ₹{(summary?.potential_cost_saving_inr ?? 26400).toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-warm-300 mt-2">
            <span>Batch unit optimization</span>
          </div>
        </div>

        {/* Card 4: Sustainability Score */}
        <div className="lab-card p-5 border-charcoal-700">
          <div className="flex items-center justify-between text-warm-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Sustainability Index</span>
            <div className="w-8 h-8 rounded-lg bg-brand-lime/10 flex items-center justify-center text-brand-lime">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-brand-lime">
            {summary?.avg_sustainability_score ?? 76.5}<span className="text-base text-warm-400 font-normal">/100</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-brand-lime mt-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>High circularity rating</span>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-8 lab-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-warm-100 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-brand-lime" />
                Packaging Analyses & Cost Optimization Trajectory
              </h3>
              <p className="text-[11px] text-warm-400">Monthly volume of decision evaluations and cumulative savings</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 text-warm-300 border border-charcoal-700">
              Live Aggregate
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary?.monthly_trend || []}>
                <defs>
                  <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7FAF6A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7FAF6A" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#3D5849" tick={{ fill: '#A8C66C', fontSize: 10 }} />
                <YAxis stroke="#3D5849" tick={{ fill: '#A8C66C', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#17221C', borderColor: '#2E5B3D', borderRadius: '12px', color: '#F5F1E8', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="analyses" stroke="#7FAF6A" strokeWidth={2} fillOpacity={1} fill="url(#colorAnalyses)" name="Analyses Run" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commodity Distribution Donut */}
        <div className="lg:col-span-4 lab-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-warm-100">Commodity Matrix Mix</h3>
              <p className="text-[11px] text-warm-400">Categorical distribution</p>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary?.category_distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(summary?.category_distribution || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#17221C', borderColor: '#2E5B3D', borderRadius: '8px', color: '#F5F1E8', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] mt-2">
            {(summary?.category_distribution || []).slice(0, 4).map((c, idx) => (
              <div key={c.name} className="flex items-center gap-1.5 text-warm-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                <span className="truncate">{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Packaging Risk Alerts */}
      <div className="lab-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-charcoal-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-brand-amber" />
            <h3 className="text-sm font-bold text-warm-100">Active Packaging Risk Alerts</h3>
          </div>
          <span className="text-[11px] text-warm-400">Automated quality monitor</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(summary?.active_risk_alerts || []).map((alert) => (
            <div key={alert.id} className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-700/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-warm-300 uppercase tracking-wider">
                    {alert.commodity}
                  </span>
                  <RiskBadge level={alert.severity} size="sm" />
                </div>
                <div className="text-xs font-semibold text-warm-100 mb-1">{alert.risk_type}</div>
                <p className="text-[11px] text-warm-400 leading-relaxed mb-3">{alert.message}</p>
              </div>

              <div className="text-[10px] p-2 rounded bg-charcoal-950 border border-charcoal-800 text-brand-lime">
                <span className="font-semibold text-warm-200">Mitigation:</span> {alert.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="lab-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-charcoal-800">
          <div>
            <h3 className="text-sm font-bold text-warm-100">Recent Packaging Analyses</h3>
            <p className="text-[11px] text-warm-400">Evaluations stored in database</p>
          </div>
          <Link
            to="/history"
            className="text-xs text-brand-lime hover:underline flex items-center gap-1"
          >
            <span>View All Analyses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal-900 text-warm-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Commodity</th>
                <th className="p-3">Category</th>
                <th className="p-3">Recommended Material</th>
                <th className="p-3">Target Shelf Life</th>
                <th className="p-3">Est. Unit Cost</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-800">
              {(summary?.recent_analyses || []).map((item) => (
                <tr key={item.id} className="hover:bg-charcoal-800/40 transition-colors">
                  <td className="p-3 font-semibold text-warm-100">{item.commodity}</td>
                  <td className="p-3 text-warm-300">{item.category}</td>
                  <td className="p-3 font-medium text-brand-lightlime">{item.recommended_material}</td>
                  <td className="p-3 text-warm-300">{item.shelf_life_days} Days</td>
                  <td className="p-3 text-brand-amber font-mono">₹{item.cost_inr.toFixed(2)}</td>
                  <td className="p-3">
                    <RiskBadge level={item.risk_level} size="sm" />
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      to={`/analysis/${item.id}`}
                      className="px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-warm-200 border border-charcoal-700 text-[11px] inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3 text-brand-lime" />
                      <span>View</span>
                    </Link>
                    <button
                      onClick={() => api.analyses.downloadReportPdf(item.id, item.commodity)}
                      className="px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-brand-lime border border-charcoal-700 text-[11px] inline-flex items-center gap-1"
                      title="Download PDF"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
