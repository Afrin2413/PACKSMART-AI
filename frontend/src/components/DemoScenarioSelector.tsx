import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Wind, Leaf } from 'lucide-react';

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: any;
  payload: {
    commodity_name: string;
    commodity_category: string;
    moisture_pct: number;
    fat_pct: number;
    ph: number;
    respiration_rate: string;
    target_shelf_life_days: number;
    storage_temp_c: number;
    storage_humidity_pct: number;
    transport_duration_days: number;
    transport_type: string;
    transport_condition: string;
    priority_protection: number;
    priority_shelf_life: number;
    priority_cost: number;
    priority_sustainability: number;
    mode: string;
  };
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo-tomato',
    title: 'Demo 1: Fresh Tomato',
    subtitle: 'High respiration & condensation risk',
    badge: 'Scenario 1',
    badgeColor: 'bg-red-950/60 text-red-300 border-red-800',
    icon: Wind,
    payload: {
      commodity_name: 'Tomato',
      commodity_category: 'Fruits',
      moisture_pct: 94.0,
      fat_pct: 0.2,
      ph: 4.3,
      respiration_rate: 'High',
      target_shelf_life_days: 7,
      storage_temp_c: 8.0,
      storage_humidity_pct: 85.0,
      transport_duration_days: 2,
      transport_type: 'Cold Chain',
      transport_condition: 'Refrigerated',
      priority_protection: 0.35,
      priority_shelf_life: 0.25,
      priority_cost: 0.20,
      priority_sustainability: 0.20,
      mode: 'Beginner'
    }
  },
  {
    id: 'demo-biscuits',
    title: 'Demo 2: Biscuits & Cookies',
    subtitle: 'Crispness loss & lipid oxidation',
    badge: 'Scenario 2',
    badgeColor: 'bg-amber-950/60 text-brand-amber border-amber-800',
    icon: ShieldCheck,
    payload: {
      commodity_name: 'Biscuits & Cookies',
      commodity_category: 'Bakery',
      moisture_pct: 3.0,
      fat_pct: 18.0,
      ph: 6.5,
      respiration_rate: 'None',
      target_shelf_life_days: 180,
      storage_temp_c: 22.0,
      storage_humidity_pct: 50.0,
      transport_duration_days: 7,
      transport_type: 'Long Distance',
      transport_condition: 'Normal',
      priority_protection: 0.40,
      priority_shelf_life: 0.30,
      priority_cost: 0.15,
      priority_sustainability: 0.15,
      mode: 'Beginner'
    }
  },
  {
    id: 'demo-spinach',
    title: 'Demo 3: Leafy Greens (Spinach)',
    subtitle: 'Very high respiration & anaerobic risk',
    badge: 'Scenario 3',
    badgeColor: 'bg-brand-emerald/40 text-brand-lightlime border-brand-emerald',
    icon: Leaf,
    payload: {
      commodity_name: 'Fresh Leafy Greens (Spinach)',
      commodity_category: 'Vegetables',
      moisture_pct: 92.0,
      fat_pct: 0.4,
      ph: 6.2,
      respiration_rate: 'Very High',
      target_shelf_life_days: 5,
      storage_temp_c: 4.0,
      storage_humidity_pct: 95.0,
      transport_duration_days: 1,
      transport_type: 'Cold Chain',
      transport_condition: 'Refrigerated',
      priority_protection: 0.30,
      priority_shelf_life: 0.25,
      priority_cost: 0.20,
      priority_sustainability: 0.25,
      mode: 'Beginner'
    }
  }
];

interface DemoScenarioSelectorProps {
  onSelect: (scenario: DemoScenario) => void;
  selectedId?: string;
}

export const DemoScenarioSelector: React.FC<DemoScenarioSelectorProps> = ({ onSelect, selectedId }) => {
  return (
    <div className="bg-charcoal-800/80 border border-brand-lime/20 rounded-2xl p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-lime/10 flex items-center justify-center text-brand-lime">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-warm-100 flex items-center gap-2">
              Live Demo Scenarios
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-lime/20 text-brand-lime">
                1-Click Populate
              </span>
            </h3>
            <p className="text-xs text-warm-300">
              Select a benchmark food scenario to auto-populate test matrix parameters and run live AI inference.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {DEMO_SCENARIOS.map((sc) => {
          const isSelected = selectedId === sc.id;
          const Icon = sc.icon;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onSelect(sc)}
              className={`text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                isSelected
                  ? 'bg-charcoal-700 border-brand-lime shadow-glow-lime'
                  : 'bg-charcoal-900/90 border-charcoal-600 hover:border-brand-lime/50 hover:bg-charcoal-700/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${sc.badgeColor}`}>
                    {sc.badge}
                  </span>
                  <Icon className="w-4 h-4 text-brand-lime" />
                </div>
                <div className="font-semibold text-sm text-warm-100 mb-0.5">{sc.title}</div>
                <div className="text-warm-400 text-[11px] line-clamp-1">{sc.subtitle}</div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-charcoal-700/60 flex items-center justify-between text-brand-lime font-medium">
                <span>Load Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DemoScenarioSelector;
