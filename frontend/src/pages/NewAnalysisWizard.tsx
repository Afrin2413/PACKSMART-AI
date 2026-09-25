import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ArrowLeft, Cpu, Check, ShieldCheck,
  Droplets, Flame, Wind, Clock, Thermometer, Truck, Sliders,
  HelpCircle, AlertCircle, Info, RefreshCw, Leaf
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { Commodity } from '../types';
import { useAuth } from '../context/AuthContext';
import DemoScenarioSelector, { DemoScenario } from '../components/DemoScenarioSelector';

export const NewAnalysisWizard: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('');
  const [isCustomCommodity, setIsCustomCommodity] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    commodity_name: 'Tomato',
    commodity_category: 'Fruits',
    moisture_pct: 94.0,
    fat_pct: 0.2,
    ph: 4.3,
    respiration_rate: 'High',
    target_shelf_life_days: 10,
    storage_temp_c: 10.0,
    storage_humidity_pct: 85.0,
    transport_duration_days: 2,
    transport_type: 'Road',
    transport_condition: 'Refrigerated',
    priority_protection: 0.35,
    priority_shelf_life: 0.25,
    priority_cost: 0.20,
    priority_sustainability: 0.20,
    mode: mode
  });

  // Processing Animation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [selectedDemoId, setSelectedDemoId] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState('');

  const processingSteps = [
    'Analyzing food properties & moisture matrix...',
    'Checking biochemical compatibility rules...',
    'Evaluating barrier requirements (OTR, WVTR)...',
    'Calculating multi-objective packaging performance...',
    'Optimizing cost and sustainability trade-offs...',
    'Synthesizing Explainable AI recommendations...'
  ];

  useEffect(() => {
    const loadCommodities = async () => {
      try {
        const data = await api.commodities.getAll();
        setCommodities(data);
      } catch (err) {
        console.error('Failed to load commodities:', err);
      }
    };
    loadCommodities();
  }, []);

  const handleCommoditySelect = (commName: string) => {
    if (commName === 'CUSTOM') {
      setIsCustomCommodity(true);
      setSelectedCommodityId('CUSTOM');
      return;
    }
    setIsCustomCommodity(false);
    setSelectedCommodityId(commName);
    const found = commodities.find(c => c.name === commName);
    if (found) {
      setFormData(prev => ({
        ...prev,
        commodity_name: found.name,
        commodity_category: found.category,
        moisture_pct: found.moisture_pct,
        fat_pct: found.fat_pct,
        ph: found.ph,
        respiration_rate: found.respiration_rate,
        target_shelf_life_days: found.typical_shelf_life_days,
        storage_temp_c: found.ideal_temp_c,
        storage_humidity_pct: found.ideal_humidity_pct
      }));
    }
  };

  const handleSelectDemo = (scenario: DemoScenario) => {
    setSelectedDemoId(scenario.id);
    setIsCustomCommodity(false);
    setSelectedCommodityId(scenario.payload.commodity_name);
    setFormData(prev => ({
      ...prev,
      ...scenario.payload,
      mode: mode
    }));
  };

  const runAnalysis = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    setProcessingStage(0);

    // Run visual stages
    const interval = setInterval(() => {
      setProcessingStage(prev => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      const response = await api.analyses.create(formData);
      clearInterval(interval);
      setProcessingStage(processingSteps.length - 1);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore in non-browser env
      }

      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/analysis/${response.id}`);
      }, 700);
    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setErrorMessage(err.response?.data?.detail || 'Failed to generate recommendation. Please check inputs.');
    }
  };

  const categories = ['Fruits', 'Vegetables', 'Grains', 'Bakery', 'Dairy', 'Meat', 'Snacks', 'Processed Food', 'Other'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal-800 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-lime">
            INTELLIGENT DECISION WIZARD
          </span>
          <h1 className="text-2xl font-black text-warm-100">
            Packaging Intelligence Analysis
          </h1>
          <p className="text-xs text-warm-300 mt-0.5">
            Configure food matrix specifications, storage logistics, and optimization weights.
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-charcoal-800 text-brand-lightlime border border-brand-lime/20 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-brand-lime" />
          <span>Active: {mode} Mode</span>
        </div>
      </div>

      {/* Demo Scenario 1-Click Selector */}
      <DemoScenarioSelector onSelect={handleSelectDemo} selectedId={selectedDemoId} />

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Multi-Step Wizard Progress Bar */}
      <div className="lab-card p-4 sm:p-5 border-charcoal-700">
        <div className="flex items-center justify-between relative mb-2">
          {[1, 2, 3, 4, 5].map((step) => {
            const isCompleted = currentStep > step;
            const isCurrent = currentStep === step;
            const stepLabels = ['Commodity', 'Properties', 'Storage', 'Transport', 'Priorities'];

            return (
              <div key={step} className="flex flex-col items-center z-10">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-brand-emerald text-warm-100 border border-brand-lime shadow-sm'
                      : isCurrent
                      ? 'bg-brand-lime text-charcoal-950 shadow-glow-lime scale-110 font-black'
                      : 'bg-charcoal-800 text-warm-400 border border-charcoal-700 hover:border-warm-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step}
                </button>
                <span className={`text-[10px] mt-1.5 font-medium hidden sm:block ${isCurrent ? 'text-brand-lime' : 'text-warm-400'}`}>
                  {stepLabels[step - 1]}
                </span>
              </div>
            );
          })}

          {/* Progress Bar Background Line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-charcoal-800 -z-0">
            <div
              className="h-full bg-brand-lime transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Contents */}
      <div className="lab-card p-6 sm:p-8 border-brand-lime/20 min-h-[380px] flex flex-col justify-between shadow-2xl">
        {/* STEP 1: COMMODITY */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-warm-100">Step 1: Select Food Commodity</h2>
              <p className="text-xs text-warm-300 mt-1">
                Choose a baseline crop from our science database or enter a custom food commodity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-warm-200 mb-1.5">
                  Database Commodity Preset
                </label>
                <select
                  value={isCustomCommodity ? 'CUSTOM' : formData.commodity_name}
                  onChange={(e) => handleCommoditySelect(e.target.value)}
                  className="w-full lab-input text-xs"
                >
                  {commodities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                  <option value="CUSTOM">+ Enter Custom Commodity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-warm-200 mb-1.5">
                  Commodity Category
                </label>
                <select
                  value={formData.commodity_category}
                  onChange={(e) => setFormData({ ...formData, commodity_category: e.target.value })}
                  className="w-full lab-input text-xs"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {isCustomCommodity && (
              <div>
                <label className="block text-xs font-semibold text-warm-200 mb-1.5">
                  Custom Commodity Name
                </label>
                <input
                  type="text"
                  value={formData.commodity_name}
                  onChange={(e) => setFormData({ ...formData, commodity_name: e.target.value })}
                  placeholder="e.g. Fresh Cut Dragonfruit"
                  className="w-full lab-input text-xs"
                />
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-xs text-warm-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
              <span>
                Selecting a commodity automatically pre-populates baseline moisture, lipid content, pH, and respiration rates from empirical laboratory datasets.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: FOOD PROPERTIES */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-warm-100">Step 2: Food Matrix Chemical Properties</h2>
              <p className="text-xs text-warm-300 mt-1">
                Calibrate biochemical sensitivity parameters influencing barrier degradation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Moisture */}
              <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-warm-200 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    Moisture Content (%)
                  </label>
                  <span className="text-xs font-mono font-bold text-brand-lime">{formData.moisture_pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.moisture_pct}
                  onChange={(e) => setFormData({ ...formData, moisture_pct: parseFloat(e.target.value) })}
                  className="w-full accent-brand-lime"
                />
                <span className="text-[10px] text-warm-400 block mt-1">
                  High moisture (&gt;70%) requires condensation and WVTR regulation.
                </span>
              </div>

              {/* Fat */}
              <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-warm-200 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-brand-amber" />
                    Fat / Lipid Content (%)
                  </label>
                  <span className="text-xs font-mono font-bold text-brand-amber">{formData.fat_pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.fat_pct}
                  onChange={(e) => setFormData({ ...formData, fat_pct: parseFloat(e.target.value) })}
                  className="w-full accent-brand-amber"
                />
                <span className="text-[10px] text-warm-400 block mt-1">
                  High fat (&gt;15%) necessitates high OTR oxygen barrier.
                </span>
              </div>

              {/* pH */}
              <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-warm-200">
                    Matrix Acidity (pH)
                  </label>
                  <span className="text-xs font-mono font-bold text-warm-100">pH {formData.ph}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => setFormData({ ...formData, ph: parseFloat(e.target.value) })}
                  className="w-full accent-brand-lime"
                />
                <span className="text-[10px] text-warm-400 block mt-1">
                  Low pH (&lt;4.5) inhibits botulism; higher pH is susceptible to bacterial spoilage.
                </span>
              </div>

              {/* Respiration Rate */}
              <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
                <label className="text-xs font-semibold text-warm-200 block mb-1.5 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-brand-lightlime" />
                  Post-Harvest Respiration Rate
                </label>
                <select
                  value={formData.respiration_rate}
                  onChange={(e) => setFormData({ ...formData, respiration_rate: e.target.value })}
                  className="w-full lab-input text-xs"
                >
                  <option value="None">None (Processed / Dry / Meat)</option>
                  <option value="Low">Low (Apples, Grapes, Citrus)</option>
                  <option value="Medium">Medium (Mango, Bananas, Stone Fruit)</option>
                  <option value="High">High (Tomatoes, Strawberries, Cauliflower)</option>
                  <option value="Very High">Very High (Spinach, Mushrooms, Asparagus)</option>
                </select>
                <span className="text-[10px] text-warm-400 block mt-1">
                  High respiration activates Respiration-Aware MAP mode.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SHELF LIFE & STORAGE */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-warm-100">Step 3: Shelf Life Target & Storage Ambient</h2>
              <p className="text-xs text-warm-300 mt-1">
                Define required shelf-life duration and ambient temperature/humidity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-warm-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-lime" />
                    Target Shelf Life
                  </label>
                  <span className="text-xs font-mono font-bold text-brand-lime">{formData.target_shelf_life_days} Days</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.target_shelf_life_days}
                  onChange={(e) => setFormData({ ...formData, target_shelf_life_days: parseInt(e.target.value) || 1 })}
                  className="w-full lab-input text-xs"
                />
              </div>

              <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-warm-200 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-red-400" />
                    Storage Temp (°C)
                  </label>
                  <span className="text-xs font-mono font-bold text-warm-100">{formData.storage_temp_c}°C</span>
                </div>
                <input
                  type="number"
                  min="-30"
                  max="60"
                  step="0.5"
                  value={formData.storage_temp_c}
                  onChange={(e) => setFormData({ ...formData, storage_temp_c: parseFloat(e.target.value) || 0 })}
                  className="w-full lab-input text-xs"
                />
              </div>

              <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-warm-200 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    Relative Humidity (%)
                  </label>
                  <span className="text-xs font-mono font-bold text-warm-100">{formData.storage_humidity_pct}% RH</span>
                </div>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={formData.storage_humidity_pct}
                  onChange={(e) => setFormData({ ...formData, storage_humidity_pct: parseFloat(e.target.value) || 50 })}
                  className="w-full lab-input text-xs"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-xs text-warm-300">
              <span className="font-semibold text-warm-100">Arrhenius Temperature Kinetic Rule:</span> Every 10°C rise in storage temperature roughly doubles biochemical degradation rates, requiring stricter material barrier properties.
            </div>
          </div>
        )}

        {/* STEP 4: TRANSPORT */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-warm-100">Step 4: Transit & Supply Chain Logistics</h2>
              <p className="text-xs text-warm-300 mt-1">
                Evaluates vibration, mechanical puncture stress, and cold chain continuity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-warm-200 mb-1.5">
                  Transit Duration (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.transport_duration_days}
                  onChange={(e) => setFormData({ ...formData, transport_duration_days: parseInt(e.target.value) || 0 })}
                  className="w-full lab-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-warm-200 mb-1.5">
                  Logistics Channel
                </label>
                <select
                  value={formData.transport_type}
                  onChange={(e) => setFormData({ ...formData, transport_type: e.target.value })}
                  className="w-full lab-input text-xs"
                >
                  <option value="Local">Local (Intra-City Delivery)</option>
                  <option value="Road">Road Transit (Inter-District)</option>
                  <option value="Cold Chain">Dedicated Cold Chain Fleet</option>
                  <option value="Long Distance">Long Distance / Export Freight</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-warm-200 mb-1.5">
                  Transit Environment
                </label>
                <select
                  value={formData.transport_condition}
                  onChange={(e) => setFormData({ ...formData, transport_condition: e.target.value })}
                  className="w-full lab-input text-xs"
                >
                  <option value="Normal">Normal Ambient (22-25°C)</option>
                  <option value="Humid">Humid Tropical Climate</option>
                  <option value="High Temperature">High Temperature Summer Transit (&gt;35°C)</option>
                  <option value="Refrigerated">Refrigerated (2-8°C)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: PACKAGING PRIORITIES */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-warm-100">Step 5: Multi-Objective Optimization Weights</h2>
              <p className="text-xs text-warm-300 mt-1">
                Customize your decision weights across protection, shelf-life longevity, economics, and sustainability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Protection */}
              <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-warm-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-lime" />
                    Protection Weight
                  </label>
                  <span className="text-xs font-mono font-bold text-brand-lime">
                    {Math.round(formData.priority_protection * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={formData.priority_protection}
                  onChange={(e) => setFormData({ ...formData, priority_protection: parseFloat(e.target.value) })}
                  className="w-full accent-brand-lime"
                />
              </div>

              {/* Shelf Life */}
              <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-warm-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-lightlime" />
                    Shelf Life Weight
                  </label>
                  <span className="text-xs font-mono font-bold text-brand-lightlime">
                    {Math.round(formData.priority_shelf_life * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={formData.priority_shelf_life}
                  onChange={(e) => setFormData({ ...formData, priority_shelf_life: parseFloat(e.target.value) })}
                  className="w-full accent-brand-lightlime"
                />
              </div>

              {/* Cost */}
              <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-warm-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-brand-amber" />
                    Cost Affordability Weight
                  </label>
                  <span className="text-xs font-mono font-bold text-brand-amber">
                    {Math.round(formData.priority_cost * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={formData.priority_cost}
                  onChange={(e) => setFormData({ ...formData, priority_cost: parseFloat(e.target.value) })}
                  className="w-full accent-brand-amber"
                />
              </div>

              {/* Sustainability */}
              <div className="bg-charcoal-900 p-4 rounded-xl border border-charcoal-700">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-warm-200 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    Sustainability Weight
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {Math.round(formData.priority_sustainability * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={formData.priority_sustainability}
                  onChange={(e) => setFormData({ ...formData, priority_sustainability: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-charcoal-800 mt-6">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="btn-secondary text-xs disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="btn-primary text-xs"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={runAnalysis}
              className="btn-primary text-xs py-3 px-6 shadow-glow-lime bg-gradient-to-r from-brand-lime to-brand-emerald text-charcoal-950 font-black"
            >
              <Sparkles className="w-4 h-4 text-charcoal-950 animate-spin" />
              <span>RUN PACKAGING INTELLIGENCE</span>
            </button>
          )}
        </div>
      </div>

      {/* AI PROCESSING MODAL OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="lab-card p-8 max-w-md w-full border-brand-lime/40 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-emerald to-brand-lime p-1 mx-auto shadow-glow-lime animate-pulse">
              <div className="w-full h-full bg-charcoal-900 rounded-xl flex items-center justify-center">
                <Cpu className="w-8 h-8 text-brand-lime animate-bounce" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-warm-100">Processing Packaging Intelligence</h3>
              <p className="text-xs text-brand-lightlime font-mono mt-1 animate-pulse">
                {processingSteps[processingStage]}
              </p>
            </div>

            <div className="w-full bg-charcoal-900 h-2 rounded-full overflow-hidden border border-charcoal-700">
              <div
                className="h-full bg-gradient-to-r from-brand-emerald via-brand-lime to-brand-amber transition-all duration-300"
                style={{ width: `${((processingStage + 1) / processingSteps.length) * 100}%` }}
              />
            </div>

            <div className="text-[11px] text-warm-400 font-mono">
              ML Inference Engine + Multi-Objective Optimization
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewAnalysisWizard;
