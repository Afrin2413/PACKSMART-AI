import React, { useState, useEffect } from 'react';
import {
  Calculator, DollarSign, TrendingDown, Layers, Box,
  ArrowRight, ShieldCheck, RefreshCw, Sparkles, CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import { PackagingMaterial } from '../types';

export const CostCalculatorPage: React.FC = () => {
  const [quantity, setQuantity] = useState(25000);
  const [widthCm, setWidthCm] = useState(15.0);
  const [lengthCm, setLengthCm] = useState(22.0);
  const [heightCm, setHeightCm] = useState(4.0);
  
  const [materials, setMaterials] = useState<PackagingMaterial[]>([]);
  const [currentMatId, setCurrentMatId] = useState<number | undefined>(undefined);
  const [recMatId, setRecMatId] = useState<number | undefined>(undefined);

  const [costResult, setCostResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const data = await api.materials.getAll();
        setMaterials(data);
        if (data.length >= 2) {
          setCurrentMatId(data[1].id); // e.g. EVOH / Foil
          setRecMatId(data[3]?.id || data[0].id); // e.g. BOPP / Micro-perf
        }
      } catch (err) {
        console.error('Error fetching materials:', err);
      }
    };
    loadMaterials();
  }, []);

  const calculateCost = async () => {
    setLoading(true);
    try {
      const res = await api.cost.calculate({
        quantity,
        package_width_cm: widthCm,
        package_length_cm: lengthCm,
        package_height_cm: heightCm,
        current_material_id: currentMatId,
        recommended_material_id: recMatId
      });
      setCostResult(res);
    } catch (err) {
      console.error('Error calculating cost:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateCost();
  }, [quantity, widthCm, lengthCm, heightCm, currentMatId, recMatId]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-amber">
            COMMERCIAL & BATCH BUDGETING
          </span>
          <h1 className="text-2xl font-black text-warm-100 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-brand-amber" />
            Packaging Cost & ROI Calculator
          </h1>
          <p className="text-xs text-warm-300 mt-0.5">
            Evaluate unit packaging expenditure, converting margins, and bulk batch savings.
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-charcoal-800 text-brand-amber border border-charcoal-700">
          Batch: {quantity.toLocaleString()} Pouches
        </div>
      </div>

      {/* Interactive Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dimension & Batch Controls */}
        <div className="lg:col-span-6 lab-card p-6 border-charcoal-700 space-y-5">
          <h2 className="text-sm font-bold text-warm-100 uppercase tracking-wider flex items-center gap-2">
            <Box className="w-4 h-4 text-brand-lime" />
            Package Dimensions & Production Batch
          </h2>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-warm-300 mb-1">Width (cm)</label>
              <input
                type="number"
                min="2"
                max="100"
                value={widthCm}
                onChange={(e) => setWidthCm(parseFloat(e.target.value) || 2)}
                className="w-full lab-input text-xs"
              />
            </div>
            <div>
              <label className="block text-warm-300 mb-1">Length (cm)</label>
              <input
                type="number"
                min="2"
                max="100"
                value={lengthCm}
                onChange={(e) => setLengthCm(parseFloat(e.target.value) || 2)}
                className="w-full lab-input text-xs"
              />
            </div>
            <div>
              <label className="block text-warm-300 mb-1">Gusset / Height (cm)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={heightCm}
                onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                className="w-full lab-input text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <label className="font-semibold text-warm-200">Production Batch Size (Units)</label>
              <span className="font-mono font-bold text-brand-amber">{quantity.toLocaleString()} Pouches</span>
            </div>
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full accent-brand-amber"
            />
            <div className="flex justify-between text-[10px] text-warm-400 mt-1 font-mono">
              <span>1k (Pilot)</span>
              <span>50k (Commercial)</span>
              <span>200k (Industrial)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-800 text-[11px] text-warm-300 flex items-center justify-between">
            <span>Calculated Pouch Surface Area (with 15% seam scrap):</span>
            <span className="font-bold text-brand-lime font-mono">
              {costResult?.package_dimensions?.surface_area_sqm_unit || '0.075'} m²/unit
            </span>
          </div>
        </div>

        {/* Right: Material Selectors */}
        <div className="lg:col-span-6 lab-card p-6 border-charcoal-700 space-y-5">
          <h2 className="text-sm font-bold text-warm-100 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-lime" />
            Comparison Materials Formulation
          </h2>

          <div>
            <label className="block text-xs font-semibold text-warm-200 mb-1.5">
              Current / Traditional Packaging Material
            </label>
            <select
              value={currentMatId}
              onChange={(e) => setCurrentMatId(parseInt(e.target.value))}
              className="w-full lab-input text-xs"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (₹{m.cost_per_sqm_inr.toFixed(2)}/m²)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-warm-200 mb-1.5">
              Recommended Optimized Packaging Material
            </label>
            <select
              value={recMatId}
              onChange={(e) => setRecMatId(parseInt(e.target.value))}
              className="w-full lab-input text-xs"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (₹{m.cost_per_sqm_inr.toFixed(2)}/m²)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* COST COMPARISON SUMMARY CARDS */}
      {costResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Packaging Card */}
            <div className="lab-card p-6 border-charcoal-700 space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-warm-400">
                CURRENT BASELINE
              </div>
              <h3 className="font-bold text-base text-warm-100">{costResult.current_packaging.name}</h3>

              <div className="space-y-2 text-xs divide-y divide-charcoal-800">
                <div className="flex justify-between pt-2">
                  <span className="text-warm-400">Raw Material:</span>
                  <span className="text-warm-200">₹{costResult.current_packaging.cost_per_sqm_inr.toFixed(2)} / m²</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-warm-400">Unit Pouch Cost:</span>
                  <span className="font-bold text-warm-100">₹{costResult.current_packaging.unit_cost_inr.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-warm-400">Total Batch Cost:</span>
                  <span className="font-bold text-warm-100 text-sm">₹{costResult.current_packaging.total_cost_inr.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Recommended Packaging Card */}
            <div className="lab-card p-6 border-brand-lime/40 bg-gradient-to-b from-charcoal-900 to-charcoal-950 space-y-4 shadow-glow-lime">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-lime font-bold">
                  OPTIMIZED SOLUTION
                </span>
                <span className="text-[10px] bg-brand-lime/20 text-brand-lime px-2 py-0.5 rounded-full font-bold">
                  -{costResult.savings_analysis.savings_percentage}% Cost
                </span>
              </div>
              <h3 className="font-bold text-base text-warm-100">{costResult.recommended_packaging.name}</h3>

              <div className="space-y-2 text-xs divide-y divide-charcoal-800">
                <div className="flex justify-between pt-2">
                  <span className="text-warm-400">Raw Material:</span>
                  <span className="text-brand-lime">₹{costResult.recommended_packaging.cost_per_sqm_inr.toFixed(2)} / m²</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-warm-400">Unit Pouch Cost:</span>
                  <span className="font-bold text-brand-amber">₹{costResult.recommended_packaging.unit_cost_inr.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-warm-400">Total Batch Cost:</span>
                  <span className="font-bold text-brand-amber text-sm">₹{costResult.recommended_packaging.total_cost_inr.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Eco Alternative Card */}
            <div className="lab-card p-6 border-charcoal-700 space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                CIRCULAR ECO-ALTERNATIVE
              </div>
              <h3 className="font-bold text-base text-warm-100">{costResult.eco_alternative.name}</h3>

              <div className="space-y-2 text-xs divide-y divide-charcoal-800">
                <div className="flex justify-between pt-2">
                  <span className="text-warm-400">Raw Material:</span>
                  <span className="text-warm-200">₹{costResult.eco_alternative.cost_per_sqm_inr.toFixed(2)} / m²</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-warm-400">Unit Pouch Cost:</span>
                  <span className="font-bold text-warm-100">₹{costResult.eco_alternative.unit_cost_inr.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-warm-400">Total Batch Cost:</span>
                  <span className="font-bold text-warm-100 text-sm">₹{costResult.eco_alternative.total_cost_inr.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ROI & Savings Callout */}
          <div className="lab-card p-6 border-brand-amber/40 bg-charcoal-950 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-amber text-xs font-bold uppercase tracking-wider">
                <TrendingDown className="w-4 h-4" />
                Economic Savings Analysis
              </div>
              <div className="text-2xl font-black text-warm-100">
                ₹{costResult.savings_analysis.batch_savings_inr.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-warm-400">Saved per {quantity.toLocaleString()} unit batch</span>
              </div>
              <p className="text-xs text-warm-300 max-w-xl leading-relaxed">
                {costResult.savings_analysis.cost_reduction_notes}
              </p>
            </div>

            <div className="text-right p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 shrink-0">
              <div className="text-[10px] font-mono text-warm-400 uppercase">Annualized Projected ROI (12 Runs)</div>
              <div className="text-xl font-bold text-brand-lime mt-1 font-mono">
                ₹{costResult.savings_analysis.annualized_projected_savings_inr.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostCalculatorPage;
