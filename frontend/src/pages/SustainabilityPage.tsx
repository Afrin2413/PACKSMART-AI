import React, { useState } from 'react';
import {
  Leaf, RefreshCw, ShieldCheck, ArrowRight, AlertTriangle,
  Layers, CheckCircle2, TrendingDown, Sparkles
} from 'lucide-react';

export const SustainabilityPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'Produce' | 'Dry' | 'Meat'>('Produce');

  const sustainabilityScenarios = {
    Produce: {
      title: 'Fresh Produce (Tomatoes & Berries)',
      traditional: {
        name: 'Heavy PVC Clamshell + Unperforated PE Film',
        weightGrams: 28.5,
        carbonKg: 3.8,
        recyclability: '15% (Hard-to-recycle rigid composite)',
        fossilResinPct: '100%',
        endOfLife: 'Landfill / Microplastics generation'
      },
      sustainable: {
        name: 'Laser Micro-Perforated Monomaterial Polyolefin + Bio-Trays',
        weightGrams: 8.2,
        carbonKg: 1.4,
        recyclability: '88% (Monolayer circular soft plastics)',
        fossilResinPct: '30% (PCR & Bio-blend)',
        endOfLife: 'Standard mechanical recycling stream'
      },
      plasticReductionPct: 71.2,
      carbonReductionPct: 63.1,
      sustainabilityScore: 89,
      tradeOffNotes: 'Provides lower estimated material carbon impact and significant plastic mass reduction while ensuring respiration equilibrium.'
    },
    Dry: {
      title: 'Dry Snacks & Biscuits',
      traditional: {
        name: 'PET (12μ) / AluFoil (7μ) / PE (50μ) Tri-Laminate',
        weightGrams: 14.2,
        carbonKg: 5.4,
        recyclability: '5% (Non-separable multi-layer composite)',
        fossilResinPct: '95%',
        endOfLife: 'Incineration / Landfill'
      },
      sustainable: {
        name: 'FSC Kraft Paper / Water-based Barrier / Bio-PE Sealant',
        weightGrams: 9.8,
        carbonKg: 1.6,
        recyclability: '82% (Repulpable in standard paper stream)',
        fossilResinPct: '15%',
        endOfLife: 'Industrial composting & curbside paper recycling'
      },
      plasticReductionPct: 68.5,
      carbonReductionPct: 70.3,
      sustainabilityScore: 86,
      tradeOffNotes: 'High barrier performance achieved through water-based dispersion coatings with 82% renewable fiber circularity.'
    },
    Meat: {
      title: 'Chilled Protein & Fresh Meat',
      traditional: {
        name: 'Non-Recyclable Multilayer High-Barrier Tray (PP/PVDC/PE)',
        weightGrams: 32.0,
        carbonKg: 4.6,
        recyclability: '0% (Halogenated PVDC layer prevents recycling)',
        fossilResinPct: '100%',
        endOfLife: 'Hazardous incineration / landfill'
      },
      sustainable: {
        name: 'Mono-material PP Thermoformed Tray + EVOH Recyclable Top Web',
        weightGrams: 18.5,
        carbonKg: 2.2,
        recyclability: '75% (Mono-PP collection stream)',
        fossilResinPct: '60%',
        endOfLife: 'Closed-loop polymer reclamation'
      },
      plasticReductionPct: 42.1,
      carbonReductionPct: 52.1,
      sustainabilityScore: 78,
      tradeOffNotes: 'Halogen-free barrier structure qualifies for circular polypropylene recycling streams without sacrificing gas barrier integrity.'
    }
  };

  const active = sustainabilityScenarios[selectedCategory];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            CIRCULAR ECONOMY & ECO-METRICS
          </span>
          <h1 className="text-2xl font-black text-warm-100 flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            Sustainability & Circularity Engine
          </h1>
          <p className="text-xs text-warm-300 mt-0.5">
            Evaluate plastic mass reduction, carbon footprint lifecycle, and mono-material recyclability index.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 bg-charcoal-800 p-1.5 rounded-2xl border border-charcoal-700">
          {(['Produce', 'Dry', 'Meat'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-emerald text-warm-100 shadow-sm'
                  : 'text-warm-400 hover:text-warm-200'
              }`}
            >
              {cat === 'Produce' ? 'Fresh Produce' : cat === 'Dry' ? 'Dry Bakery & Snacks' : 'Chilled Protein'}
            </button>
          ))}
        </div>
      </div>

      {/* Sustainability Index Score Banner */}
      <div className="lab-card p-6 sm:p-8 border-brand-lime/30 bg-gradient-to-r from-charcoal-900 via-charcoal-950 to-charcoal-900 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-2xl">
        <div className="md:col-span-8 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-brand-lime font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-brand-lime" />
            Circular Packaging Rating
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-warm-100">{active.title}</h2>
          <p className="text-xs text-warm-300 leading-relaxed max-w-xl">
            {active.tradeOffNotes}
          </p>
        </div>

        <div className="md:col-span-4 text-center p-6 rounded-2xl bg-charcoal-900 border border-brand-lime/40 shadow-glow-lime">
          <div className="text-4xl font-black text-brand-lime">{active.sustainabilityScore}<span className="text-lg text-warm-400 font-normal">/100</span></div>
          <div className="text-xs font-semibold text-warm-100 mt-1">Sustainability Index</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Grade A Recyclable Monomaterial</div>
        </div>
      </div>

      {/* Side-by-Side Comparison: Traditional vs Sustainable */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional Option */}
        <div className="lab-card p-6 border-red-900/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono">
              CONVENTIONAL PACKAGING
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800">
              Linear Economy
            </span>
          </div>

          <h3 className="font-bold text-base text-warm-100">{active.traditional.name}</h3>

          <div className="space-y-2 text-xs divide-y divide-charcoal-800">
            <div className="flex justify-between pt-2">
              <span className="text-warm-400">Package Weight / Pouch:</span>
              <span className="font-bold text-warm-100">{active.traditional.weightGrams} g</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-warm-400">Carbon Footprint:</span>
              <span className="font-bold text-red-400">{active.traditional.carbonKg} kg CO₂e / kg</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-warm-400">Recyclability Stream:</span>
              <span className="text-warm-300">{active.traditional.recyclability}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-warm-400">Virgin Fossil Resin:</span>
              <span className="text-warm-200">{active.traditional.fossilResinPct}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-warm-400">End-of-Life Reality:</span>
              <span className="text-red-400 font-medium">{active.traditional.endOfLife}</span>
            </div>
          </div>
        </div>

        {/* Sustainable Option */}
        <div className="lab-card p-6 border-brand-lime/40 bg-gradient-to-b from-charcoal-900 to-charcoal-950 space-y-4 shadow-glow-lime">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-lime uppercase tracking-wider font-mono">
              CIRCULAR ALTERNATIVE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-brand-lime/20 text-brand-lime border border-brand-lime/40 font-bold">
              -{active.plasticReductionPct}% Plastic Mass
            </span>
          </div>

          <h3 className="font-bold text-base text-warm-100">{active.sustainable.name}</h3>

          <div className="space-y-2 text-xs divide-y divide-charcoal-800">
            <div className="flex justify-between pt-2">
              <span className="text-warm-400">Package Weight / Pouch:</span>
              <span className="font-bold text-brand-lime">{active.sustainable.weightGrams} g</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-warm-400">Carbon Footprint:</span>
              <span className="font-bold text-emerald-400">{active.sustainable.carbonKg} kg CO₂e / kg</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-warm-400">Recyclability Stream:</span>
              <span className="text-brand-lightlime font-bold">{active.sustainable.recyclability}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-warm-400">Fossil Resin Content:</span>
              <span className="text-warm-200">{active.sustainable.fossilResinPct}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-warm-400">End-of-Life Reality:</span>
              <span className="text-emerald-400 font-medium">{active.sustainable.endOfLife}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Honest Scientific Principles */}
      <div className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 text-xs text-warm-300 space-y-2">
        <div className="font-bold text-warm-100 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand-lime" />
          Honest Trade-off Transparency Policy
        </div>
        <p className="text-[11px] text-warm-400 leading-relaxed">
          PackSmart AI avoids greenwashing. No packaging material is universally "eco-friendly" across all supply chains. Biodegradable polymers (PLA) require industrial composting facilities (&gt;58°C) to break down, while mono-material polyolefins excel in standard mechanical municipal recycling infrastructure. Recommendations indicate <em>lower estimated material impact under this specific scenario</em>.
        </p>
      </div>
    </div>
  );
};

export default SustainabilityPage;
