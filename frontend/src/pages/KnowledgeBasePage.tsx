import React, { useState, useEffect } from 'react';
import {
  BookOpen, Layers, Apple, ShieldCheck, Plus, Search,
  RefreshCw, Check, AlertCircle, Edit2, Trash2, X
} from 'lucide-react';
import api from '../services/api';
import { PackagingMaterial, Commodity } from '../types';

export const KnowledgeBasePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'commodities' | 'rules'>('materials');
  const [materials, setMaterials] = useState<PackagingMaterial[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add Material Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMat, setNewMat] = useState({
    name: '',
    structure: '',
    category: 'High Barrier Coex',
    thickness_microns: 50,
    otr_cc_m2_day_atm: 15.0,
    wvtr_g_m2_day: 2.0,
    gas_permeability_category: 'Low',
    sealability: 'Good',
    puncture_resistance: 'Good',
    map_suitability: true,
    recyclability_pct: 75.0,
    carbon_footprint_kg_co2_per_kg: 2.2,
    cost_per_sqm_inr: 8.50,
    key_features: '',
    ideal_for: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mats, comms] = await Promise.all([
        api.materials.getAll(),
        api.commodities.getAll()
      ]);
      setMaterials(mats);
      setCommodities(comms);
    } catch (err) {
      console.error('Failed to load knowledge base data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.materials.create(newMat);
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to add material');
    }
  };

  const handleDeleteMaterial = async (id: number) => {
    if (window.confirm('Delete this packaging material from knowledge base?')) {
      try {
        await api.materials.delete(id);
        setMaterials(prev => prev.filter(m => m.id !== id));
      } catch (err) {
        alert('Failed to delete material');
      }
    }
  };

  const packagingRules = [
    {
      id: 1,
      rule: 'High Moisture Food Rule (>70% Moisture)',
      condition: 'Moisture content > 70% in non-respiring food matrix (fresh meat, wet dairy)',
      action: 'Enforce high water vapour barrier (WVTR < 3.0 g/m²·day) to prevent product weight loss and syneresis dehydration.'
    },
    {
      id: 2,
      rule: 'Crisp Dry Food Barrier Rule (<10% Moisture)',
      condition: 'Moisture content < 10% (biscuits, wafers, dry crackers)',
      action: 'Prioritize metallized BOPP or aluminum foil laminate (WVTR < 1.0 g/m²·day) to stop ambient moisture absorption and sogginess.'
    },
    {
      id: 3,
      rule: 'Lipid Auto-Oxidation Rule (>15% Fat)',
      condition: 'Lipid/fat content > 15% (chips, roasted nuts, coffee, full-cream powders)',
      action: 'Require strict oxygen barrier (OTR < 20 cc/m²·day) and UV light block to prevent free-radical peroxide rancidity.'
    },
    {
      id: 4,
      rule: 'Produce Respiration Asphyxiation Rule',
      condition: 'Produce respiration rate = High or Very High (tomatoes, spinach, mushrooms)',
      action: 'Prohibit impermeable barrier films; enforce laser micro-perforations (100-200μm) or high gas transmission polymers to stop anaerobic off-odours.'
    },
    {
      id: 5,
      rule: 'Deep Cold Chain Flex-Crack Rule (<0°C Storage)',
      condition: 'Storage temperature < 0°C',
      action: 'Select frost-resistant nylon/metallocene LLDPE copolymer with glass transition temperature below -20°C.'
    },
    {
      id: 6,
      rule: 'Extended Supply Chain Mechanical Stress Rule (>5 Transit Days)',
      condition: 'Transport duration >= 5 days or Road/Rough logistics',
      action: 'Increase minimum film thickness by 20% and verify biaxial orientation for flex-crack and puncture resistance.'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-lime">
            SCIENTIFIC REPOSITORY & KNOWLEDGE GRAPH
          </span>
          <h1 className="text-2xl font-black text-warm-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-lime" />
            Knowledge Base & Material Manager
          </h1>
          <p className="text-xs text-warm-300 mt-0.5">
            Curated packaging polymer datasheets, food chemistry baselines, and empirical decision rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'materials' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary text-xs py-2 px-3.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Material</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-charcoal-800 pb-2">
        <button
          onClick={() => setActiveTab('materials')}
          className={`text-xs px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
            activeTab === 'materials'
              ? 'bg-brand-emerald text-warm-100 border border-brand-lime shadow-sm'
              : 'text-warm-400 hover:text-warm-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Packaging Materials ({materials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('commodities')}
          className={`text-xs px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
            activeTab === 'commodities'
              ? 'bg-brand-emerald text-warm-100 border border-brand-lime shadow-sm'
              : 'text-warm-400 hover:text-warm-200'
          }`}
        >
          <Apple className="w-4 h-4" />
          <span>Food Commodities ({commodities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`text-xs px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
            activeTab === 'rules'
              ? 'bg-brand-emerald text-warm-100 border border-brand-lime shadow-sm'
              : 'text-warm-400 hover:text-warm-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Packaging Science Rules ({packagingRules.length})</span>
        </button>
      </div>

      {/* TAB 1: MATERIALS */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((m) => (
              <div key={m.id} className="lab-card p-5 border-charcoal-700 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-900 text-brand-lime border border-charcoal-800">
                      {m.category}
                    </span>
                    <span className="text-xs font-bold text-brand-amber font-mono">
                      ₹{m.cost_per_sqm_inr.toFixed(2)}/m²
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-warm-100">{m.name}</h3>
                  <p className="text-[11px] text-warm-400 line-clamp-2">{m.structure}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] mt-3 pt-2 border-t border-charcoal-800">
                    <div>
                      <span className="text-warm-400">OTR:</span>{' '}
                      <span className="font-bold text-warm-100">{m.otr_cc_m2_day_atm.toLocaleString()} cc</span>
                    </div>
                    <div>
                      <span className="text-warm-400">WVTR:</span>{' '}
                      <span className="font-bold text-warm-100">{m.wvtr_g_m2_day} g</span>
                    </div>
                    <div>
                      <span className="text-warm-400">Gauge:</span>{' '}
                      <span className="font-bold text-warm-100">{m.thickness_microns} μm</span>
                    </div>
                    <div>
                      <span className="text-warm-400">Recycle:</span>{' '}
                      <span className="font-bold text-emerald-400">{m.recyclability_pct}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-charcoal-800 flex items-center justify-between">
                  <span className="text-[10px] text-warm-400 font-mono">
                    Seal: {m.sealability} | MAP: {m.map_suitability ? 'Yes' : 'No'}
                  </span>
                  <button
                    onClick={() => handleDeleteMaterial(m.id)}
                    className="p-1 text-warm-500 hover:text-red-400"
                    title="Delete Material"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COMMODITIES */}
      {activeTab === 'commodities' && (
        <div className="lab-card p-6 border-charcoal-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-900 text-warm-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">Commodity Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Moisture %</th>
                  <th className="p-3">Fat %</th>
                  <th className="p-3">pH</th>
                  <th className="p-3">Respiration</th>
                  <th className="p-3">Ideal Temp</th>
                  <th className="p-3 rounded-r-xl">Typical Shelf Life</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800">
                {commodities.map((c) => (
                  <tr key={c.id} className="hover:bg-charcoal-800/40">
                    <td className="p-3 font-bold text-warm-100">{c.name}</td>
                    <td className="p-3 text-warm-300">{c.category}</td>
                    <td className="p-3 font-mono text-brand-lime">{c.moisture_pct}%</td>
                    <td className="p-3 font-mono text-brand-amber">{c.fat_pct}%</td>
                    <td className="p-3 font-mono text-warm-200">pH {c.ph}</td>
                    <td className="p-3 font-semibold text-brand-lightlime">{c.respiration_rate}</td>
                    <td className="p-3 text-warm-300">{c.ideal_temp_c}°C ({c.ideal_humidity_pct}%)</td>
                    <td className="p-3 font-bold text-warm-100">{c.typical_shelf_life_days} Days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RULES */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {packagingRules.map((r) => (
            <div key={r.id} className="lab-card p-5 border-charcoal-700 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-lime"></span>
                <h3 className="font-bold text-sm text-warm-100">{r.rule}</h3>
              </div>
              <div className="text-xs text-warm-300 bg-charcoal-900 p-3 rounded-xl border border-charcoal-800">
                <span className="font-semibold text-brand-amber">Trigger Condition:</span> {r.condition}
              </div>
              <div className="text-xs text-brand-lime bg-charcoal-950 p-3 rounded-xl border border-charcoal-800">
                <span className="font-semibold text-warm-100">Prescribed Engineering Action:</span> {r.action}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MATERIAL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="lab-card p-6 sm:p-8 max-w-lg w-full border-brand-lime/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
              <h3 className="text-base font-bold text-warm-100">Add New Packaging Material</h3>
              <button onClick={() => setShowAddModal(false)} className="text-warm-400 hover:text-warm-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="space-y-3 text-xs">
              <div>
                <label className="block text-warm-300 mb-1">Material Trade Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BOPP / AlOx High-Clear Barrier"
                  value={newMat.name}
                  onChange={(e) => setNewMat({ ...newMat, name: e.target.value })}
                  className="w-full lab-input text-xs"
                />
              </div>

              <div>
                <label className="block text-warm-300 mb-1">Layer Structure</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BOPP (20μ) / AlOx / PE (30μ)"
                  value={newMat.structure}
                  onChange={(e) => setNewMat({ ...newMat, structure: e.target.value })}
                  className="w-full lab-input text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-warm-300 mb-1">OTR (cc/m²·d)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMat.otr_cc_m2_day_atm}
                    onChange={(e) => setNewMat({ ...newMat, otr_cc_m2_day_atm: parseFloat(e.target.value) || 10 })}
                    className="w-full lab-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-warm-300 mb-1">WVTR (g/m²·d)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMat.wvtr_g_m2_day}
                    onChange={(e) => setNewMat({ ...newMat, wvtr_g_m2_day: parseFloat(e.target.value) || 2 })}
                    className="w-full lab-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-warm-300 mb-1">Cost (₹/m²)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMat.cost_per_sqm_inr}
                    onChange={(e) => setNewMat({ ...newMat, cost_per_sqm_inr: parseFloat(e.target.value) || 8 })}
                    className="w-full lab-input text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-charcoal-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBasePage;
