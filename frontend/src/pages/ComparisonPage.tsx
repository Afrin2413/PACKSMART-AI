import React, { useState, useEffect } from 'react';
import {
  Scale, Check, RefreshCw, BarChart3, ShieldCheck, DollarSign,
  Leaf, Layers, ArrowRight, Activity
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend
} from 'recharts';
import api from '../services/api';
import { PackagingMaterial } from '../types';

export const ComparisonPage: React.FC = () => {
  const [allMaterials, setAllMaterials] = useState<PackagingMaterial[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2, 4]); // Defaults: Micro-perf, EVOH, BOPP Metallized
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInit = async () => {
      try {
        const mats = await api.materials.getAll();
        setAllMaterials(mats);
        if (mats.length >= 3) {
          const defaultIds = [mats[0].id, mats[1].id, mats[3]?.id || mats[2].id];
          setSelectedIds(defaultIds);
          const comp = await api.compare.runComparison(defaultIds);
          setComparisonData(comp);
        }
      } catch (err) {
        console.error('Error loading materials comparison:', err);
      } finally {
        setLoading(false);
      }
    };
    loadInit();
  }, []);

  const toggleMaterial = async (id: number) => {
    let newIds = [...selectedIds];
    if (newIds.includes(id)) {
      if (newIds.length <= 1) return; // Keep at least 1
      newIds = newIds.filter(x => x !== id);
    } else {
      if (newIds.length >= 4) newIds.shift(); // Max 4
      newIds.push(id);
    }
    setSelectedIds(newIds);
    setLoading(true);
    try {
      const comp = await api.compare.runComparison(newIds);
      setComparisonData(comp);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const RADAR_COLORS = ['#7FAF6A', '#D6A85F', '#A8C66C', '#3D5849'];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-lime">
            BENCHMARK & SENSITIVITY MATRIX
          </span>
          <h1 className="text-2xl font-black text-warm-100 flex items-center gap-2">
            <Scale className="w-6 h-6 text-brand-lime" />
            Packaging Material Comparison
          </h1>
          <p className="text-xs text-warm-300 mt-0.5">
            Compare barrier permeability, seal strength, cost index, and recyclability across flexible laminates.
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-charcoal-800 text-warm-300 border border-charcoal-700">
          Comparing {selectedIds.length} Materials
        </div>
      </div>

      {/* Material Selector Chips */}
      <div className="lab-card p-4 sm:p-5 border-charcoal-700">
        <div className="text-xs font-semibold text-warm-200 mb-3 flex items-center justify-between">
          <span>Select Materials to Compare (Select 2 to 4):</span>
          <span className="text-[11px] text-warm-400">Click to toggle</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {allMaterials.map((m) => {
            const isSelected = selectedIds.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleMaterial(m.id)}
                className={`text-xs px-3.5 py-2 rounded-xl font-medium border transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-brand-emerald text-warm-100 border-brand-lime shadow-sm'
                    : 'bg-charcoal-900 text-warm-400 border-charcoal-700 hover:text-warm-200'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] border ${
                  isSelected ? 'bg-brand-lime text-charcoal-950 border-brand-lime font-black' : 'border-charcoal-600'
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5" />}
                </div>
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-brand-lime animate-spin mx-auto" />
          <p className="text-xs text-warm-300 font-mono">Recalculating comparison vectors...</p>
        </div>
      ) : (
        <>
          {/* Visual Charts: Radar & Bar Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Multi-material Radar Chart */}
            <div className="lg:col-span-6 lab-card p-6 border-charcoal-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-warm-100">Multi-Vector Radar Comparison</h3>
                  <p className="text-[11px] text-warm-400">Barrier vs Economics vs Sustainability</p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={comparisonData?.radar_metrics || []}>
                    <PolarGrid stroke="#203128" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#A8C66C', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#2C4136" tick={{ fill: '#7FAF6A', fontSize: 9 }} />
                    {comparisonData?.materials?.map((m: any, idx: number) => {
                      const key = m.material.name.slice(0, 18);
                      const color = RADAR_COLORS[idx % RADAR_COLORS.length];
                      return (
                        <Radar
                          key={m.material.id}
                          name={m.material.name}
                          dataKey={key}
                          stroke={color}
                          fill={color}
                          fillOpacity={0.25}
                        />
                      );
                    })}
                    <Tooltip
                      contentStyle={{ backgroundColor: '#17221C', borderColor: '#2E5B3D', borderRadius: '8px', color: '#F5F1E8', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost & Barrier Bar Chart */}
            <div className="lg:col-span-6 lab-card p-6 border-charcoal-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-warm-100">Cost & Recyclability Benchmark</h3>
                  <p className="text-[11px] text-warm-400">Square meter raw cost (INR) & circularity %</p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData?.bar_chart_data || []}>
                    <XAxis dataKey="name" stroke="#3D5849" tick={{ fill: '#A8C66C', fontSize: 10 }} />
                    <YAxis stroke="#3D5849" tick={{ fill: '#A8C66C', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#17221C', borderColor: '#2E5B3D', borderRadius: '8px', color: '#F5F1E8', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="cost_sqm" name="Cost (₹/m²)" fill="#D6A85F" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="recyclability" name="Recyclability (%)" fill="#7FAF6A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Specification Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisonData?.materials?.map((c: any) => {
              const m = c.material;
              return (
                <div key={m.id} className="lab-card p-6 border-brand-lime/20 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 text-brand-lime border border-charcoal-700">
                        {m.category}
                      </span>
                      <span className="text-xs font-bold text-brand-amber">₹{m.cost_per_sqm_inr.toFixed(2)}/m²</span>
                    </div>

                    <h3 className="font-bold text-base text-warm-100 mb-1">{m.name}</h3>
                    <p className="text-xs text-warm-400 mb-4">{m.structure}</p>

                    <div className="space-y-2 text-xs divide-y divide-charcoal-800">
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-warm-400">Gauge Thickness:</span>
                        <span className="font-bold text-warm-100">{m.thickness_microns} μm</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-warm-400">Oxygen Transmission (OTR):</span>
                        <span className="font-bold text-warm-100">{m.otr_cc_m2_day_atm.toLocaleString()} cc/m²·d</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-warm-400">Moisture Transmission (WVTR):</span>
                        <span className="font-bold text-warm-100">{m.wvtr_g_m2_day} g/m²·d</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-warm-400">Seal Strength:</span>
                        <span className="font-bold text-brand-lime">{m.sealability}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-warm-400">MAP Qualified:</span>
                        <span className="font-bold text-warm-100">{m.map_suitability ? 'Yes (Modified Gas)' : 'No'}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-warm-400">Circularity Rating:</span>
                        <span className="font-bold text-emerald-400">{c.sustainability_rating} ({m.recyclability_pct}%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-800 text-[11px] text-warm-300">
                    <span className="font-semibold text-warm-100">Recommended For:</span> {m.ideal_for || m.key_features}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ComparisonPage;
