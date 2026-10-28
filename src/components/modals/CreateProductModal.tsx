import React, { useState } from 'react';
import { CompanyState, Product } from '../../game/types';
import { playClickSound, playCashSound } from '../../game/audio';
import { Layers, X, Sparkles, Sliders, DollarSign, Check } from 'lucide-react';

interface CreateProductModalProps {
  state: CompanyState;
  onClose: () => void;
  onCreateProduct: (params: {
    name: string;
    type: string;
    pricingModel: Product['pricingModel'];
    pricePerMonth: number;
    features: Product['features'];
  }) => void;
}

const DEFAULT_NAMES = [
  'AuraCloud', 'QuantumAudit', 'PulseDesk', 'HyperSync', 'NovaFlow',
  'NexusBot', 'StreamlinePro', 'OmniPlatform', 'CobaltEngine'
];

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  state,
  onClose,
  onCreateProduct,
}) => {
  const [name, setName] = useState(DEFAULT_NAMES[Math.floor(Math.random() * DEFAULT_NAMES.length)]);
  const [type, setType] = useState('Enterprise Workflow Platform');
  const [pricingModel, setPricingModel] = useState<Product['pricingModel']>('subscription');
  const [pricePerMonth, setPricePerMonth] = useState(29);
  
  // Feature allocations (summing up to budget)
  const [techQuality, setTechQuality] = useState(70);
  const [userExperience, setUserExperience] = useState(75);
  const [security, setSecurity] = useState(70);
  const [serverCapacity, setServerCapacity] = useState(10000);

  const canAfford = state.cash >= 15000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAfford) return;

    playCashSound(state.settings.soundEnabled);
    onCreateProduct({
      name: name.trim() || 'NovaSync',
      type: type.trim() || 'Software Service',
      pricingModel,
      pricePerMonth,
      features: {
        techQuality,
        userExperience,
        security,
        serverCapacity,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-4 sm:p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-white">New Product R&D Sprint</h2>
              <span className="text-[10px] text-slate-400 font-mono">Sprint Setup Cost: $15,000</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close product modal"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name & Type */}
          <div>
            <label className="text-xs font-bold text-slate-300">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300">Category / Solution</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Pricing Model & Price */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-300">Monetization</label>
              <select
                value={pricingModel}
                onChange={(e) => setPricingModel(e.target.value as Product['pricingModel'])}
                className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="subscription">Subscription (MRR)</option>
                <option value="freemium">Freemium Ads</option>
                <option value="enterprise">Enterprise Seat</option>
                <option value="onetime">One-Time License</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Price / User / Mo ($)</label>
              <input
                type="number"
                min={1}
                max={500}
                value={pricePerMonth}
                onChange={(e) => setPricePerMonth(Number(e.target.value))}
                className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Feature Specs */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
              <span>Engineering Specifications</span>
              <span className="text-cyan-400 text-[10px]">Tuned for {state.industry.toUpperCase()}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Architecture & Tech Quality</span>
                <span className="font-mono text-white">{techQuality} pts</span>
              </div>
              <input
                type="range"
                min={40}
                max={95}
                value={techQuality}
                onChange={(e) => setTechQuality(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>UX Polish & Intuitive Design</span>
                <span className="font-mono text-white">{userExperience} pts</span>
              </div>
              <input
                type="range"
                min={40}
                max={95}
                value={userExperience}
                onChange={(e) => setUserExperience(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Security & Zero-Day Hardening</span>
                <span className="font-mono text-white">{security} pts</span>
              </div>
              <input
                type="range"
                min={40}
                max={95}
                value={security}
                onChange={(e) => setSecurity(Number(e.target.value))}
                className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canAfford}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-30 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMENCE SPRINT ($15,000)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
