import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Download, ArrowLeft, ShieldCheck, Clock, DollarSign, Leaf,
  Cpu, AlertTriangle, CheckCircle2, ChevronRight, Wind, Layers,
  Scale, Activity, HelpCircle, Sparkles, RefreshCw, BarChart3
} from 'lucide-react';
import api from '../services/api';
import { AnalysisDetail, Recommendation } from '../types';
import RiskBadge from '../components/RiskBadge';
import ScoreRadar from '../components/ScoreRadar';

export const AnalysisResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecIndex, setSelectedRecIndex] = useState(0);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.analyses.getById(parseInt(id));
        setAnalysis(data);
      } catch (err) {
        console.error('Failed to load analysis:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const handleDownloadPdf = async () => {
    if (!analysis) return;
    setDownloadingPdf(true);
    try {
      await api.analyses.downloadReportPdf(analysis.id, analysis.commodity_name);
    } catch (err) {
      console.error('Error downloading PDF report:', err);
      alert('Failed to generate PDF. Please ensure backend is running.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-brand-lime animate-spin" />
        <p className="text-xs text-warm-300 font-mono">Loading Packaging Intelligence Result #{id}...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="lab-card p-8 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-brand-amber mx-auto" />
        <h2 className="text-lg font-bold text-warm-100">Analysis #{id} Not Found</h2>
        <p className="text-xs text-warm-300">The requested packaging evaluation does not exist or was deleted.</p>
        <Link to="/new-analysis" className="btn-primary text-xs inline-flex">
          Run New Analysis
        </Link>
      </div>
    );
  }

  const activeRec: Recommendation = analysis.recommendations[selectedRecIndex] || analysis.recommendations[0];
  const resp = analysis.respiration_intelligence;
  const cost = analysis.cost_estimate;
  const sust = analysis.sustainability_score;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-charcoal-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/history" className="text-warm-400 hover:text-brand-lime text-xs flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Analyses</span>
            </Link>
            <span className="text-warm-600">/</span>
            <span className="text-xs font-mono text-brand-lime">AN-#{analysis.id}</span>
            <RiskBadge level={analysis.overall_risk_level} size="sm" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-100">
            {analysis.commodity_name}{' '}
            <span className="text-sm font-normal text-warm-400">({analysis.commodity_category})</span>
          </h1>
          <p className="text-xs text-warm-300 mt-0.5">
            Target Shelf Life: <span className="text-warm-100 font-semibold">{analysis.target_shelf_life_days} Days</span> | Storage: {analysis.storage_temp_c}°C ({analysis.storage_humidity_pct}% RH) | Transit: {analysis.transport_type}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="btn-primary text-xs py-2.5 px-4 shadow-glow-lime"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingPdf ? 'Building PDF...' : 'Download PDF Report'}</span>
          </button>

          <Link
            to="/compare"
            className="btn-secondary text-xs py-2.5 px-3.5"
          >
            <Scale className="w-3.5 h-3.5 text-brand-lime" />
            <span>Compare</span>
          </Link>

          <Link
            to="/simulator"
            className="btn-secondary text-xs py-2.5 px-3.5"
          >
            <Activity className="w-3.5 h-3.5 text-brand-amber" />
            <span>Simulate</span>
          </Link>
        </div>
      </div>

      {/* TOP 3 RECOMMENDATIONS TABS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-warm-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-lime" />
              Top 3 AI Packaging Recommendations
            </h2>
            <p className="text-xs text-warm-300">
              Ranked and differentiated by multi-objective optimization across performance, economics, and circularity.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 text-brand-lime border border-brand-lime/20">
            Backend Seed Matrix
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.recommendations.map((rec, index) => {
            const isSelected = selectedRecIndex === index;
            const rankTitle = index === 0
              ? 'RECOMMENDATION #1: Best Balanced'
              : index === 1
              ? 'RECOMMENDATION #2: Lower Cost'
              : 'RECOMMENDATION #3: Sustainable';

            return (
              <button
                key={rec.rank}
                type="button"
                onClick={() => setSelectedRecIndex(index)}
                className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-charcoal-800 border-brand-lime shadow-glow-lime ring-1 ring-brand-lime/40'
                    : 'bg-charcoal-900/90 border-charcoal-700 hover:border-brand-lime/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      index === 0
                        ? 'bg-brand-lime/20 text-brand-lime border border-brand-lime/40'
                        : index === 1
                        ? 'bg-brand-amber/20 text-brand-amber border border-brand-amber/40'
                        : 'bg-emerald-900/30 text-emerald-300 border border-emerald-700'
                    }`}>
                      {rankTitle}
                    </span>
                    <span className="text-xs font-mono font-black text-warm-100">
                      {rec.overall_score.toFixed(1)}/100
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-warm-100 mb-1">{rec.material_name}</h3>
                  <p className="text-[11px] text-warm-400 line-clamp-2">{rec.material_structure}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-charcoal-700/60 grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <div className="text-warm-400">Unit Cost</div>
                    <div className="font-bold text-brand-amber">₹{rec.estimated_cost_unit.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-warm-400">Protection</div>
                    <div className="font-bold text-brand-lime">{rec.protection_score.toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-warm-400">Circularity</div>
                    <div className="font-bold text-emerald-400">{rec.sustainability_score.toFixed(0)}%</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED RECOMMENDATION DEEP-DIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Technical Specification Matrix */}
        <div className="lg:col-span-7 lab-card p-6 sm:p-7 border-brand-lime/30 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
            <div>
              <span className="text-[10px] font-mono text-brand-lime uppercase tracking-wider">
                TECHNICAL SPECIFICATION PROFILE
              </span>
              <h3 className="text-lg font-bold text-warm-100">{activeRec.material_name}</h3>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-charcoal-900 text-brand-lime border border-brand-lime/30">
              Score: {activeRec.overall_score.toFixed(1)} / 100
            </span>
          </div>

          {/* Key Engineering Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-800">
              <div className="text-warm-400 text-[10px] uppercase font-mono">Film Thickness</div>
              <div className="font-bold text-warm-100 text-sm mt-0.5">{activeRec.thickness_microns} μm</div>
            </div>

            <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-800">
              <div className="text-warm-400 text-[10px] uppercase font-mono">OTR (Oxygen Barrier)</div>
              <div className="font-bold text-warm-100 text-sm mt-0.5">
                {activeRec.otr.toLocaleString()} <span className="text-[9px] font-normal text-warm-400">cc/m²·d</span>
              </div>
            </div>

            <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-800">
              <div className="text-warm-400 text-[10px] uppercase font-mono">WVTR (Moisture)</div>
              <div className="font-bold text-warm-100 text-sm mt-0.5">
                {activeRec.wvtr} <span className="text-[9px] font-normal text-warm-400">g/m²·d</span>
              </div>
            </div>

            <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-800">
              <div className="text-warm-400 text-[10px] uppercase font-mono">Thermal Sealability</div>
              <div className="font-bold text-brand-lime text-sm mt-0.5">{activeRec.sealability}</div>
            </div>

            <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-800">
              <div className="text-warm-400 text-[10px] uppercase font-mono">Gas Permeability</div>
              <div className="font-bold text-warm-100 text-sm mt-0.5">{activeRec.gas_permeability}</div>
            </div>

            <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-800">
              <div className="text-warm-400 text-[10px] uppercase font-mono">MAP Compatibility</div>
              <div className="font-bold text-brand-lightlime text-sm mt-0.5">
                {activeRec.map_suitability ? '✓ Qualified' : 'Standard Flush'}
              </div>
            </div>
          </div>

          {/* Subscores breakdown bar */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-warm-200">Scoring Breakdown:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-800">
                <div className="text-[10px] text-warm-400">Protection</div>
                <div className="font-bold text-brand-lime">{activeRec.protection_score.toFixed(1)}%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-800">
                <div className="text-[10px] text-warm-400">Shelf Life</div>
                <div className="font-bold text-brand-lightlime">{activeRec.shelf_life_score.toFixed(1)}%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-800">
                <div className="text-[10px] text-warm-400">Cost Economy</div>
                <div className="font-bold text-brand-amber">{activeRec.estimated_cost_unit ? (100 - activeRec.estimated_cost_unit * 5).toFixed(1) : '85'}%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-800">
                <div className="text-[10px] text-warm-400">Circularity</div>
                <div className="font-bold text-emerald-400">{activeRec.sustainability_score.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Performance Radar Chart */}
        <div className="lg:col-span-5 lab-card p-6 border-charcoal-700 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-warm-100 mb-1">Performance Polygon Index</h3>
            <p className="text-[11px] text-warm-400">Multi-attribute scoring distribution</p>
          </div>

          <ScoreRadar
            scores={{
              protection: activeRec.protection_score,
              shelf_life: activeRec.shelf_life_score,
              cost: activeRec.estimated_cost_unit ? 100 - activeRec.estimated_cost_unit * 5 : 85,
              sustainability: activeRec.sustainability_score,
              compatibility: activeRec.compatibility_score
            }}
            materialName={activeRec.material_name}
          />

          <div className="text-[10px] text-center text-warm-400 font-mono">
            Empirical Utility Weighting Applied
          </div>
        </div>
      </div>

      {/* EXPLAINABLE AI (XAI) PANEL */}
      <div className="lab-card p-6 sm:p-7 border-brand-lime/30 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-charcoal-800">
          <Cpu className="w-5 h-5 text-brand-lime" />
          <div>
            <h3 className="text-base font-bold text-warm-100">Explainable AI (XAI) Rationale</h3>
            <p className="text-xs text-warm-300">Transparent scientific justification for material selection</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Why this material */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-lime uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Why This Material Was Selected
            </h4>
            <div className="space-y-2">
              {activeRec.why_points.map((pt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-800 text-xs text-warm-200 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-lime shrink-0 mt-1.5"></span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What would change this recommendation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-amber uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Sensitivity Triggers (What Would Change This?)
            </h4>
            <div className="space-y-2">
              {activeRec.what_would_change.map((trg, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-800 text-xs text-warm-300 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-amber shrink-0 mt-1.5"></span>
                  <span>{trg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RESPIRATION-AWARE MODE (If Produce) */}
      {resp && (
        <div className="lab-card p-6 sm:p-7 border-emerald-800/40 bg-gradient-to-r from-charcoal-900 to-charcoal-950 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-brand-lightlime" />
              <div>
                <h3 className="text-base font-bold text-warm-100">Respiration-Aware Intelligence</h3>
                <p className="text-xs text-warm-300">Post-harvest physiology & equilibrium MAP formulation</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-brand-emerald/30 text-brand-lightlime border border-brand-emerald/50">
              Active Produce Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-charcoal-900/90 p-4 rounded-xl border border-charcoal-800">
              <div className="text-warm-400 text-[10px]">Target Gas Equilibrium</div>
              <div className="font-bold text-brand-lime text-sm mt-1">
                {resp.map_gas_mix.o2_pct}% O₂ / {resp.map_gas_mix.co2_pct}% CO₂ / {resp.map_gas_mix.n2_pct}% N₂
              </div>
            </div>

            <div className="bg-charcoal-900/90 p-4 rounded-xl border border-charcoal-800">
              <div className="text-warm-400 text-[10px]">Micro-Perforation Protocol</div>
              <div className="font-bold text-warm-100 text-xs mt-1">
                {resp.micro_perforation_spec || 'Standard film'}
              </div>
            </div>

            <div className="bg-charcoal-900/90 p-4 rounded-xl border border-charcoal-800">
              <div className="text-warm-400 text-[10px]">Condensation & Anti-Fog</div>
              <div className="font-bold text-blue-400 text-xs mt-1">
                {resp.anti_fog_recommended ? 'Anti-fog surfactant coating required' : 'Standard surface'}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-800 text-xs text-warm-300">
            <span className="font-semibold text-warm-100">Post-Harvest Advisory:</span> {resp.advisory_notes}
          </div>
        </div>
      )}

      {/* PACKAGING RISK MATRIX */}
      <div className="lab-card p-6 sm:p-7 border-charcoal-700 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-brand-amber" />
            <div>
              <h3 className="text-base font-bold text-warm-100">Packaging Risk Analysis</h3>
              <p className="text-xs text-warm-300">Potential quality failure modes and verified engineering mitigations</p>
            </div>
          </div>
          <RiskBadge level={analysis.overall_risk_level} size="md" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal-900 text-warm-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Identified Risk</th>
                <th className="p-3">Severity & Prob.</th>
                <th className="p-3">Root Cause Reason</th>
                <th className="p-3 rounded-r-xl">Engineering Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-800">
              {activeRec.risks.map((rk, idx) => (
                <tr key={idx} className="hover:bg-charcoal-800/40">
                  <td className="p-3 font-semibold text-warm-100">{rk.risk}</td>
                  <td className="p-3">
                    <RiskBadge level={rk.level} size="sm" />
                    <span className="text-[10px] text-warm-400 ml-1 font-mono">({rk.probability_pct}%)</span>
                  </td>
                  <td className="p-3 text-warm-300 max-w-xs">{rk.reason}</td>
                  <td className="p-3 text-brand-lime max-w-xs font-medium">{rk.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ECONOMIC & SUSTAINABILITY IMPACT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost Savings Card */}
        {cost && (
          <div className="lab-card p-6 border-charcoal-700 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-warm-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-amber" />
                Batch Economic Summary
              </h3>
              <span className="text-[10px] font-mono text-warm-400">{cost.quantity.toLocaleString()} Pouches</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-800">
                <div className="text-warm-400 text-[10px]">Traditional Packaging Cost</div>
                <div className="font-bold text-warm-300 text-sm mt-0.5">₹{cost.total_cost_current.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-800">
                <div className="text-warm-400 text-[10px]">Recommended Packaging Cost</div>
                <div className="font-bold text-brand-amber text-sm mt-0.5">₹{cost.total_cost_recommended.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-brand-amber font-semibold flex items-center justify-between">
              <span>Potential Batch Cost Reduction:</span>
              <span>{cost.cost_savings_pct}% Saved</span>
            </div>
          </div>
        )}

        {/* Sustainability Impact Card */}
        {sust && (
          <div className="lab-card p-6 border-charcoal-700 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-warm-100 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-brand-lime" />
                Sustainability Impact
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-emerald/30 text-brand-lightlime">
                Rating {sust.environmental_rating}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-800">
                <div className="text-warm-400 text-[10px]">Material Recyclability</div>
                <div className="font-bold text-brand-lime text-sm mt-0.5">{sust.recyclability_pct}% Circular</div>
              </div>
              <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-800">
                <div className="text-warm-400 text-[10px]">Carbon Footprint Avoided</div>
                <div className="font-bold text-emerald-400 text-sm mt-0.5">{sust.carbon_saved_kg} kg CO₂e</div>
              </div>
            </div>

            <p className="text-[11px] text-warm-400">{sust.material_impact_notes}</p>
          </div>
        )}
      </div>

      {/* Scientific Disclaimer */}
      <div className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 text-[11px] text-warm-400 text-center leading-relaxed">
        <span className="font-bold text-warm-300">SCIENTIFIC DECISION-SUPPORT DISCLAIMER:</span> Results are decision-support estimates based on provided inputs and the system's empirical knowledge base. Laboratory validation and regulatory assessment (FSSAI / FDA) are recommended before large-scale commercial packaging deployment.
      </div>
    </div>
  );
};

export default AnalysisResultPage;
