import React, { useState, useEffect } from 'react';
import {
  Activity, Thermometer, Droplets, Clock, AlertTriangle,
  RefreshCw, TrendingUp, ShieldCheck, Sparkles, HelpCircle, Info
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend
} from 'recharts';
import api from '../services/api';
import { SimulationResult } from '../types';

export const ShelfLifeSimulatorPage: React.FC = () => {
  const [commodityName, setCommodityName] = useState('Tomato (Fresh Cut)');
  const [temperature, setTemperature] = useState(10.0);
  const [humidity, setHumidity] = useState(85.0);
  const [targetDays, setTargetDays] = useState(14);
  const [respirationRate, setRespirationRate] = useState('High');
  const [fatPct, setFatPct] = useState(0.2);
  const [moisturePct, setMoisturePct] = useState(94.0);

  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(true);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.simulation.run({
        commodity_name: commodityName,
        temperature_c: temperature,
        humidity_pct: humidity,
        target_days: targetDays,
        moisture_pct: moisturePct,
        fat_pct: fatPct,
        respiration_rate: respirationRate
      });
      setSimulation(res);
    } catch (err) {
      console.error('Error running shelf-life simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [temperature, humidity, targetDays, respirationRate]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-amber">
              KINETIC SPOILAGE MODELLING
            </span>
          </div>
          <h1 className="text-2xl font-black text-warm-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand-amber" />
            Shelf-Life Degradation Simulator
          </h1>
          <p className="text-xs text-warm-300 mt-0.5">
            Simulate food quality decay kinetics and microbial growth across time under varying ambient variables.
          </p>
        </div>

        {/* Prominent Disclaimer Badge */}
        <div className="text-[11px] px-3 py-1.5 rounded-xl bg-amber-950/40 text-brand-amber border border-amber-800/60 flex items-center gap-2 font-mono">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>SIMULATED ESTIMATE (Not Lab Cert)</span>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="lab-card p-6 border-charcoal-700 space-y-5">
        <div className="text-xs font-bold text-warm-100 uppercase tracking-wider flex items-center gap-2">
          <span>Simulation Ambient Controls</span>
          <span className="text-warm-400 font-normal">(Drag sliders to watch curves update dynamically)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Temperature Slider */}
          <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-warm-200 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-red-400" />
                Storage Temp (°C)
              </label>
              <span className="text-xs font-mono font-bold text-warm-100">{temperature}°C</span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-red-400"
            />
            <div className="flex justify-between text-[9px] text-warm-400 mt-1 font-mono">
              <span>0°C (Deep Chill)</span>
              <span>25°C (Ambient)</span>
              <span>45°C (Extreme)</span>
            </div>
          </div>

          {/* Humidity Slider */}
          <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-warm-200 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                Storage Humidity (% RH)
              </label>
              <span className="text-xs font-mono font-bold text-blue-400">{humidity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="98"
              step="1"
              value={humidity}
              onChange={(e) => setHumidity(parseFloat(e.target.value))}
              className="w-full accent-blue-400"
            />
            <div className="flex justify-between text-[9px] text-warm-400 mt-1 font-mono">
              <span>20% (Dry)</span>
              <span>65% (Normal)</span>
              <span>98% (Saturated)</span>
            </div>
          </div>

          {/* Target Days Slider */}
          <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-warm-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-lime" />
                Target Horizon (Days)
              </label>
              <span className="text-xs font-mono font-bold text-brand-lime">{targetDays} Days</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={targetDays}
              onChange={(e) => setTargetDays(parseInt(e.target.value))}
              className="w-full accent-brand-lime"
            />
            <div className="flex justify-between text-[9px] text-warm-400 mt-1 font-mono">
              <span>5d</span>
              <span>30d</span>
              <span>60d</span>
            </div>
          </div>

          {/* Respiration Preset */}
          <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
            <label className="text-xs font-semibold text-warm-200 block mb-1.5">
              Crop Respiration Rate
            </label>
            <select
              value={respirationRate}
              onChange={(e) => setRespirationRate(e.target.value)}
              className="w-full lab-input text-xs py-1.5"
            >
              <option value="None">None (Processed / Baked)</option>
              <option value="Low">Low (Apples / Grapes)</option>
              <option value="High">High (Tomatoes / Berries)</option>
              <option value="Very High">Very High (Spinach / Mushrooms)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SIMULATION RESULTS & CHARTS */}
      {simulation && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Quality Curve Chart */}
          <div className="lg:col-span-8 lab-card p-6 border-brand-lime/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-charcoal-800">
              <div>
                <h3 className="text-sm font-bold text-warm-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-lime" />
                  Sensory Quality Index Degradation Curve
                </h3>
                <p className="text-[11px] text-warm-400">
                  Compares Baseline Monolayer vs Optimized High-Barrier Pack
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-3 h-0.5 bg-red-400"></span>
                  Baseline ({simulation.current_shelf_life_days}d)
                </span>
                <span className="flex items-center gap-1.5 text-brand-lime font-bold">
                  <span className="w-3 h-0.5 bg-brand-lime"></span>
                  Optimized ({simulation.recommended_shelf_life_days}d)
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulation.days}>
                  <XAxis dataKey="day" stroke="#3D5849" tick={{ fill: '#A8C66C', fontSize: 10 }} label={{ value: 'Days of Storage', position: 'insideBottomRight', offset: -5, fill: '#A8C66C', fontSize: 10 }} />
                  <YAxis domain={[0, 100]} stroke="#3D5849" tick={{ fill: '#A8C66C', fontSize: 10 }} label={{ value: 'Quality Index (%)', angle: -90, position: 'insideLeft', fill: '#A8C66C', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#17221C', borderColor: '#2E5B3D', borderRadius: '12px', color: '#F5F1E8', fontSize: '11px' }}
                    formatter={(value: any, name: any) => [
                      `${value}%`,
                      name === 'current_quality_pct' ? 'Baseline Film' : 'Optimized Packaging'
                    ]}
                  />
                  <ReferenceLine y={60} stroke="#D6A85F" strokeDasharray="3 3" label={{ value: 'Critical Spoilage Threshold (60%)', fill: '#D6A85F', fontSize: 10 }} />
                  <Line type="monotone" dataKey="current_quality_pct" stroke="#F87171" strokeWidth={2} dot={false} name="Baseline Film" />
                  <Line type="monotone" dataKey="recommended_quality_pct" stroke="#7FAF6A" strokeWidth={3} dot={false} name="Optimized Packaging" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diagnostic Metrics */}
          <div className="lg:col-span-4 space-y-4">
            {/* Shelf-life extension banner */}
            <div className="lab-card p-6 border-brand-lime/40 bg-gradient-to-br from-charcoal-900 to-charcoal-950 space-y-3 shadow-glow-lime">
              <span className="text-[10px] font-mono text-brand-lime uppercase tracking-wider">
                SIMULATED PREDICTION RESULT
              </span>
              <div className="text-3xl font-black text-warm-100">
                +{simulation.shelf_life_extension_pct}%{' '}
                <span className="text-xs font-normal text-brand-lightlime">Shelf-Life Gain</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-charcoal-800">
                <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-800">
                  <div className="text-warm-400 text-[10px]">Unprotected Pack</div>
                  <div className="font-bold text-red-400 text-sm mt-0.5">{simulation.current_shelf_life_days} Days</div>
                </div>
                <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-800">
                  <div className="text-warm-400 text-[10px]">PackSmart Solution</div>
                  <div className="font-bold text-brand-lime text-sm mt-0.5">{simulation.recommended_shelf_life_days} Days</div>
                </div>
              </div>
            </div>

            {/* Failure Mode Card */}
            <div className="lab-card p-6 border-charcoal-700 space-y-3">
              <div className="flex items-center gap-2 text-brand-amber text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                Primary Mode of Spoilage
              </div>
              <p className="text-xs text-warm-200 leading-relaxed font-medium">
                {simulation.primary_failure_mode}
              </p>
              <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-800 text-[11px] text-warm-400">
                {simulation.simulation_notes}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelfLifeSimulatorPage;
