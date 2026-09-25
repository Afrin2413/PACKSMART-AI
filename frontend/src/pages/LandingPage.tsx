import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, ArrowRight, Sparkles, Cpu, Layers, Leaf, TrendingUp,
  Activity, AlertTriangle, CheckCircle2, ChevronRight, BarChart3,
  Box, Droplets, Flame, RefreshCw, Zap, Wind
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../components/DemoScenarioSelector';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeDemoTab, setActiveDemoTab] = useState(0);

  const illustrativeDemos = [
    {
      commodity: 'Tomato (Fresh Harvest)',
      moisture: '94%',
      respiration: 'High (32 mg CO₂/kg·h)',
      temp: '8°C',
      humidity: '85% RH',
      shelfLife: '7 Days',
      recommended: 'Laser Micro-perforated Breathable Film (PP/LDPE 30μm)',
      otr: '8,500 cc/m²·day',
      wvtr: '22 g/m²·day',
      cost: '₹4.50 / m²',
      sustainability: 'Grade A (85% Circularity)',
      xai: 'Regulated micro-perforations maintain oxygen equilibrium above 2% while dissipating excess respired moisture to stop Botrytis grey mould.'
    },
    {
      commodity: 'Crispy Biscuits & Cookies',
      moisture: '3%',
      respiration: 'None',
      temp: '22°C',
      humidity: '50% RH',
      shelfLife: '180 Days',
      recommended: 'BOPP Metallized High-Barrier Laminate (60μm)',
      otr: '18 cc/m²·day',
      wvtr: '0.8 g/m²·day',
      cost: '₹8.20 / m²',
      sustainability: 'Grade B (60% Recyclability)',
      xai: 'Ultra-low moisture permeability prevents water uptake and sogginess while metallic vacuum layer stops light-triggered lipid rancidity.'
    },
    {
      commodity: 'Organic Leafy Greens (Spinach)',
      moisture: '92%',
      respiration: 'Very High (65 mg CO₂/kg·h)',
      temp: '4°C',
      humidity: '95% RH',
      shelfLife: '5 Days',
      recommended: 'Anti-Fog Micro-perforated Bio-Polymer (35μm)',
      otr: '9,200 cc/m²·day',
      wvtr: '24 g/m²·day',
      cost: '₹5.80 / m²',
      sustainability: 'Grade A+ (Compostable ASTM D6400)',
      xai: 'High gas transmission prevents anaerobic yellowing and off-odour fermentation in wet cold chain transit.'
    }
  ];

  return (
    <div className="min-h-screen bg-charcoal-900 text-warm-100 flex flex-col selection:bg-brand-lime selection:text-charcoal-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-charcoal-950/90 backdrop-blur-md border-b border-brand-lime/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-emerald to-brand-lime p-0.5 shadow-glow-lime">
              <div className="w-full h-full bg-charcoal-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand-lime" />
              </div>
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-warm-100">
                PACKSMART <span className="text-brand-lime">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-charcoal-800 text-brand-lime border border-brand-lime/20">
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs text-warm-300 font-medium">
            <a href="#how-it-works" className="hover:text-brand-lime transition-colors">How It Works</a>
            <a href="#problem" className="hover:text-brand-lime transition-colors">The Challenge</a>
            <a href="#intelligence" className="hover:text-brand-lime transition-colors">Intelligence Engine</a>
            <a href="#demo" className="hover:text-brand-lime transition-colors">Live Demo</a>
            <a href="#users" className="hover:text-brand-lime transition-colors">Target Roles</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-xs text-warm-200 hover:text-warm-100 px-3 py-2 rounded-xl bg-charcoal-800 border border-charcoal-700 hover:border-brand-lime/30 transition-all font-medium"
            >
              Enter Dashboard
            </Link>
            <Link
              to="/new-analysis"
              className="btn-primary text-xs"
            >
              <span>Run Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-lime/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-charcoal-800/90 border border-brand-lime/30 text-xs text-brand-lightlime mb-6 shadow-glow-lime">
            <Sparkles className="w-3.5 h-3.5 text-brand-lime animate-pulse" />
            <span>Intelligent Food Packaging Decision Support</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-warm-100 max-w-4xl mx-auto leading-[1.1] mb-6">
            Intelligent Packaging Decisions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime via-brand-lightlime to-brand-amber">Better Food</span>.
          </h1>

          <p className="text-base sm:text-lg text-warm-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Analyze food characteristics, storage conditions and transport requirements to discover
            packaging solutions optimized for protection, shelf life, cost and sustainability.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              to="/new-analysis"
              className="btn-primary text-sm px-7 py-3.5 shadow-glow-lime"
            >
              <Cpu className="w-4 h-4" />
              <span>Start Packaging Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="btn-secondary text-sm px-7 py-3.5"
            >
              <span>Explore How It Works</span>
            </a>
          </div>

          {/* Interactive Packaging Intelligence Visualization Flow */}
          <div id="how-it-works" className="scroll-mt-24 bg-charcoal-950/80 border border-brand-lime/20 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md max-w-5xl mx-auto">
            <div className="text-xs font-mono uppercase tracking-widest text-brand-lime mb-6 text-left flex items-center justify-between border-b border-charcoal-800 pb-3">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-lime" />
                Automated Decision Architecture Flow
              </span>
              <span className="text-warm-400 font-normal">Hybrid Physics-Informed ML Engine</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
              <div className="bg-charcoal-800/90 border border-charcoal-700 p-4 rounded-2xl">
                <div className="text-[10px] font-mono text-warm-400 mb-1">01. INPUT</div>
                <div className="font-bold text-xs text-warm-100">Food Commodity</div>
                <div className="text-[11px] text-brand-lime mt-1">Matrix Category</div>
              </div>

              <div className="bg-charcoal-800/90 border border-charcoal-700 p-4 rounded-2xl">
                <div className="text-[10px] font-mono text-warm-400 mb-1">02. MATRIX</div>
                <div className="font-bold text-xs text-warm-100">Food Properties</div>
                <div className="text-[11px] text-warm-300 mt-1">Moisture, Fat, pH, Resp.</div>
              </div>

              <div className="bg-charcoal-800/90 border border-charcoal-700 p-4 rounded-2xl">
                <div className="text-[10px] font-mono text-warm-400 mb-1">03. VECTOR</div>
                <div className="font-bold text-xs text-warm-100">Storage & Transit</div>
                <div className="text-[11px] text-warm-300 mt-1">Temp, RH, Days, Cold Chain</div>
              </div>

              <div className="bg-charcoal-800/90 border border-brand-lime/40 p-4 rounded-2xl bg-brand-emerald/10 shadow-glow-lime">
                <div className="text-[10px] font-mono text-brand-lime mb-1">04. HYBRID AI</div>
                <div className="font-bold text-xs text-brand-lightlime">Rule + ML Engine</div>
                <div className="text-[11px] text-warm-200 mt-1">Scikit-Learn + Rules</div>
              </div>

              <div className="bg-charcoal-800/90 border border-charcoal-700 p-4 rounded-2xl">
                <div className="text-[10px] font-mono text-warm-400 mb-1">05. OBJECTIVE</div>
                <div className="font-bold text-xs text-warm-100">Multi-Opt Scoring</div>
                <div className="text-[11px] text-brand-amber mt-1">Cost / Eco / Protection</div>
              </div>

              <div className="bg-charcoal-800/90 border border-brand-lime/60 p-4 rounded-2xl bg-charcoal-700">
                <div className="text-[10px] font-mono text-brand-lime mb-1">06. OUTPUT</div>
                <div className="font-bold text-xs text-warm-100">Top 3 Solutions</div>
                <div className="text-[11px] text-brand-lime mt-1">Full Explainable AI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE CORE PROBLEM */}
      <section id="problem" className="py-20 px-6 bg-charcoal-950/60 border-y border-charcoal-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-amber block mb-2">
              The Real-World Crisis
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-warm-100">
              Why Food Packaging Selection Fails Today
            </h2>
            <p className="text-sm text-warm-300 mt-3">
              Packaging decisions are frequently made through trial-and-error or legacy vendor suggestions,
              triggering massive financial waste and spoilage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="lab-card p-6 border-red-900/30">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 text-red-400 flex items-center justify-center mb-4 border border-red-800/40">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-warm-100 mb-2">Moisture & Texture Loss</h3>
              <p className="text-xs text-warm-300 leading-relaxed">
                Incorrect Water Vapor Transmission Rate (WVTR) causes dry snacks to turn soggy or fresh cuts to dehydrate and lose market weight.
              </p>
            </div>

            <div className="lab-card p-6 border-amber-900/30">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-brand-amber flex items-center justify-center mb-4 border border-amber-800/40">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-warm-100 mb-2">Lipid Oxidation & Rancidity</h3>
              <p className="text-xs text-warm-300 leading-relaxed">
                High-fat foods (biscuits, crisps, nuts) deteriorate rapidly when packed in high Oxygen Transmission Rate (OTR) films lacking UV barriers.
              </p>
            </div>

            <div className="lab-card p-6 border-brand-emerald/30">
              <div className="w-10 h-10 rounded-xl bg-brand-emerald/20 text-brand-lime flex items-center justify-center mb-4 border border-brand-emerald/40">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-warm-100 mb-2">Respiration Asphyxiation</h3>
              <p className="text-xs text-warm-300 leading-relaxed">
                Fresh fruits respire post-harvest. Trapping them in airtight films suffocates produce, creating sour anaerobic fermentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LIVE ILLUSTRATIVE DEMO */}
      <section id="demo" className="py-20 px-6 bg-charcoal-900">
        <div className="max-w-6xl mx-auto">
          <div id="intelligence" className="scroll-mt-24 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-lime mb-2">
                <Zap className="w-3.5 h-3.5" />
                Live Illustrative Demonstration
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-warm-100">
                Witness PackSmart AI in Action
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-charcoal-950 p-1.5 rounded-2xl border border-charcoal-700">
              {illustrativeDemos.map((demo, idx) => (
                <button
                  key={demo.commodity}
                  onClick={() => setActiveDemoTab(idx)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                    activeDemoTab === idx
                      ? 'bg-brand-emerald text-warm-100 shadow-sm'
                      : 'text-warm-400 hover:text-warm-200'
                  }`}
                >
                  {demo.commodity.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Demo Panel */}
          {(() => {
            const currentDemo = illustrativeDemos[activeDemoTab];
            return (
              <div className="lab-card p-6 sm:p-8 border-brand-lime/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Input Matrix */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-warm-400 flex items-center gap-2">
                    <span>Input Food Matrix</span>
                    <span className="w-2 h-2 rounded-full bg-brand-amber"></span>
                  </div>

                  <h3 className="text-2xl font-black text-warm-100">{currentDemo.commodity}</h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-700">
                      <div className="text-warm-400 text-[10px]">Moisture</div>
                      <div className="font-bold text-warm-100 text-sm mt-0.5">{currentDemo.moisture}</div>
                    </div>
                    <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-700">
                      <div className="text-warm-400 text-[10px]">Respiration</div>
                      <div className="font-bold text-brand-lime text-xs mt-0.5">{currentDemo.respiration}</div>
                    </div>
                    <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-700">
                      <div className="text-warm-400 text-[10px]">Storage Condition</div>
                      <div className="font-bold text-warm-100 text-xs mt-0.5">{currentDemo.temp} | {currentDemo.humidity}</div>
                    </div>
                    <div className="bg-charcoal-900 p-3 rounded-xl border border-charcoal-700">
                      <div className="text-warm-400 text-[10px]">Target Shelf Life</div>
                      <div className="font-bold text-warm-100 text-xs mt-0.5">{currentDemo.shelfLife}</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-charcoal-950 border border-charcoal-800 text-xs text-warm-300">
                    <span className="font-semibold text-warm-100">Live AI Reasoning:</span> {currentDemo.xai}
                  </div>
                </div>

                {/* Right: AI Output Recommendation */}
                <div className="lg:col-span-7 bg-charcoal-950 p-6 rounded-2xl border border-brand-lime/40 shadow-glow-lime">
                  <div className="flex items-center justify-between pb-3 border-b border-charcoal-800 mb-4">
                    <span className="text-xs font-bold text-brand-lime uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Recommended Solution (#1)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-lime/20 text-brand-lime font-mono">
                      Best Balanced
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-warm-100 mb-3">{currentDemo.recommended}</h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-5">
                    <div className="bg-charcoal-900 p-2.5 rounded-xl border border-charcoal-800">
                      <div className="text-warm-400 text-[10px]">OTR Gas Barrier</div>
                      <div className="font-semibold text-warm-100">{currentDemo.otr}</div>
                    </div>
                    <div className="bg-charcoal-900 p-2.5 rounded-xl border border-charcoal-800">
                      <div className="text-warm-400 text-[10px]">WVTR Moisture</div>
                      <div className="font-semibold text-warm-100">{currentDemo.wvtr}</div>
                    </div>
                    <div className="bg-charcoal-900 p-2.5 rounded-xl border border-charcoal-800">
                      <div className="text-warm-400 text-[10px]">Est. Cost / m²</div>
                      <div className="font-semibold text-brand-amber">{currentDemo.cost}</div>
                    </div>
                    <div className="bg-charcoal-900 p-2.5 rounded-xl border border-charcoal-800">
                      <div className="text-warm-400 text-[10px]">Eco Rating</div>
                      <div className="font-semibold text-brand-lime">{currentDemo.sustainability}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-charcoal-800">
                    <span className="text-xs text-warm-400">Ready to test your custom commodity?</span>
                    <Link
                      to="/new-analysis"
                      className="btn-primary text-xs py-2 px-4"
                    >
                      <span>Launch Wizard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* SECTION 3: WHO CAN USE IT */}
      <section id="users" className="py-20 px-6 bg-charcoal-950/40 border-t border-charcoal-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-lime block mb-2">
              Role-Aware Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-warm-100">
              Built for Every Stakeholder in Food Value Chain
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            <div className="lab-card p-6">
              <div className="font-bold text-sm text-warm-100 mb-1">1. Farmers & FPOs</div>
              <div className="text-brand-lime font-mono text-[10px] mb-3">Beginner Mode</div>
              <p className="text-warm-300 leading-relaxed">
                Simple questions on crop type, harvest date, and local transport. Delivers straightforward advice to minimize post-harvest rots.
              </p>
            </div>

            <div className="lab-card p-6">
              <div className="font-bold text-sm text-warm-100 mb-1">2. Food Startups</div>
              <div className="text-brand-amber font-mono text-[10px] mb-3">Commercial Scalability</div>
              <p className="text-warm-300 leading-relaxed">
                Unit pouch cost calculations, shelf-life extension projections, and batch budgeting for retail launch.
              </p>
            </div>

            <div className="lab-card p-6">
              <div className="font-bold text-sm text-warm-100 mb-1">3. Food Processors</div>
              <div className="text-brand-lime font-mono text-[10px] mb-3">Industrial Optimization</div>
              <p className="text-warm-300 leading-relaxed">
                MAP gas mix formulations, sealability integrity under high-speed lines, and packaging risk matrix.
              </p>
            </div>

            <div className="lab-card p-6">
              <div className="font-bold text-sm text-warm-100 mb-1">4. Packaging Researchers</div>
              <div className="text-brand-lightlime font-mono text-[10px] mb-3">Expert Mode</div>
              <p className="text-warm-300 leading-relaxed">
                In-depth OTR, WVTR permeability metrics, sensitivity trigger analysis, and downloadable technical PDF reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-charcoal-900 to-charcoal-950 text-center relative">
        <div className="max-w-4xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-brand-emerald/30 border border-brand-lime/40 flex items-center justify-center mx-auto mb-6 shadow-glow-lime text-brand-lime">
            <Sparkles className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-warm-100 mb-4">
            Ready to Optimize Your Food Packaging?
          </h2>
          <p className="text-sm sm:text-base text-warm-300 max-w-xl mx-auto mb-8">
            Experience the AI packaging decision-support engine. Run instant simulations and generate technical reports.
          </p>

          <Link
            to="/new-analysis"
            className="btn-primary text-sm px-8 py-4 shadow-glow-lime"
          >
            <span>Launch PackSmart AI Wizard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
