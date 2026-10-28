import React, { useState, useEffect } from 'react';
import { IndustryType, FounderTrait, CompanyState } from '../game/types';
import { INDUSTRIES, FOUNDER_TRAITS } from '../game/constants';
import { playClickSound, playCashSound } from '../game/audio';
import { Dice5, Play, RotateCcw, Sparkles, Building2, User, Award, ArrowRight } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: (params: {
    companyName: string;
    founderName: string;
    founderTrait: FounderTrait;
    industry: IndustryType;
  }) => void;
  savedState: CompanyState | null;
  onLoadSavedGame: () => void;
  soundEnabled: boolean;
}

const RANDOM_FOUNDERS = [
  'Alex Chen', 'Elena Vance', 'Marcus Mercer', 'Samantha Lind', 'David Patel',
  'Priya Nair', 'Julian Sterling', 'Maya Rios', 'Lucas Tanaka', 'Freya O’Connor'
];

const RANDOM_COMPANIES = [
  'Apex Systems', 'Synthetix AI', 'NovaFlux Digital', 'OmniScale Corp',
  'AeroMetrics', 'QuantumVanguard', 'Hyperion Dynamics', 'Cobalt Labs'
];

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  savedState,
  onLoadSavedGame,
  soundEnabled,
}) => {
  const [founderName, setFounderName] = useState(RANDOM_FOUNDERS[0]);
  const [companyName, setCompanyName] = useState(RANDOM_COMPANIES[0]);
  const [industry, setIndustry] = useState<IndustryType>('saas');
  const [founderTrait, setFounderTrait] = useState<FounderTrait>('code_wizard');
  const [step, setStep] = useState<'welcome' | 'create'>('welcome');

  // Keyboard shortcut: Space or Enter starts game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && step === 'welcome') {
        if (savedState) {
          onLoadSavedGame();
        } else {
          setStep('create');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, savedState, onLoadSavedGame]);

  const randomizeFounder = () => {
    playClickSound(soundEnabled);
    const pick = RANDOM_FOUNDERS[Math.floor(Math.random() * RANDOM_FOUNDERS.length)];
    setFounderName(pick);
  };

  const randomizeCompany = () => {
    playClickSound(soundEnabled);
    const pick = RANDOM_COMPANIES[Math.floor(Math.random() * RANDOM_COMPANIES.length)];
    setCompanyName(pick);
  };

  const handleStart = () => {
    playCashSound(soundEnabled);
    onStartGame({
      founderName: founderName.trim() || 'Alex Chen',
      companyName: companyName.trim() || 'NovaForge Inc',
      founderTrait,
      industry,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto relative overflow-hidden font-sans border-x border-slate-800/80 shadow-2xl">
      {/* Background subtle mesh grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header Emblem */}
      <div className="relative z-10 pt-4 text-center">
        <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent border border-emerald-500/30 mb-3 shadow-inner">
          <svg className="w-10 h-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
          FOUNDER<span className="text-emerald-400">FORGE</span>
        </h1>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-1">
          2D Mobile Startup & Company Tycoon
        </p>
      </div>

      {step === 'welcome' ? (
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-4 my-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Full-Depth Text Simulation</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Build a billion-dollar empire from a suburban garage. Manage staff, R&D tech trees, marketing campaigns, hostile takeovers, and take your company public via IPO on Wall Street!
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <div className="text-emerald-400 font-bold text-sm">6</div>
                <div className="text-[10px] text-slate-400 font-medium">Industries</div>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <div className="text-cyan-400 font-bold text-sm">35+</div>
                <div className="text-[10px] text-slate-400 font-medium">Text Crises</div>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <div className="text-amber-400 font-bold text-sm">IPO</div>
                <div className="text-[10px] text-slate-400 font-medium">Wall Street</div>
              </div>
            </div>
          </div>

          {savedState && (
            <button
              onClick={() => {
                playClickSound(soundEnabled);
                onLoadSavedGame();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 rounded-xl py-3 px-4 flex items-center justify-between text-left transition group active:scale-[0.98]"
            >
              <div>
                <div className="text-xs text-slate-400 font-medium">Resume Active Run</div>
                <div className="font-bold text-sm text-white">{savedState.companyName}</div>
                <div className="text-[11px] text-slate-400">Week {savedState.week} · ${savedState.cash.toLocaleString()} Cash</div>
              </div>
              <RotateCcw className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform" />
            </button>
          )}

          <button
            data-start="true"
            onClick={() => {
              playClickSound(soundEnabled);
              setStep('create');
            }}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>{savedState ? 'NEW VENTURE' : 'FOUND A COMPANY'}</span>
          </button>
        </div>
      ) : (
        <div className="relative z-10 flex-1 overflow-y-auto pr-1 my-3 space-y-4 max-h-[70vh]">
          {/* Founder Profile */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Founder Identity
              </label>
              <button
                type="button"
                onClick={randomizeFounder}
                className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
              >
                <Dice5 className="w-3 h-3" /> Randomize
              </button>
            </div>
            <input
              type="text"
              value={founderName}
              onChange={(e) => setFounderName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
              placeholder="Founder full name"
            />

            {/* Founder Trait Picker */}
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider pt-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Founder Advantage
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {FOUNDER_TRAITS.map((t) => {
                const isSelected = founderTrait === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      playClickSound(soundEnabled);
                      setFounderTrait(t.id);
                    }}
                    className={`p-2 rounded-lg text-left border transition text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span>{t.icon}</span>
                      <span className="truncate">{t.name}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium mt-1 truncate">{t.tag}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Startup Name
              </label>
              <button
                type="button"
                onClick={randomizeCompany}
                className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition"
              >
                <Dice5 className="w-3 h-3" /> Randomize
              </button>
            </div>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-medium"
              placeholder="e.g. Apex Dynamics Inc."
            />

            {/* Industry Selector */}
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider pt-1">
              Select Market Sector
            </label>
            <div className="space-y-1.5">
              {(Object.keys(INDUSTRIES) as IndustryType[]).map((indKey) => {
                const ind = INDUSTRIES[indKey];
                const isSelected = industry === indKey;
                return (
                  <button
                    key={indKey}
                    type="button"
                    onClick={() => {
                      playClickSound(soundEnabled);
                      setIndustry(indKey);
                    }}
                    className={`w-full p-2.5 rounded-lg text-left border transition flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-lg">{ind.badge.slice(0, 2)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs truncate text-white">{ind.name}</div>
                        <div className="text-[10px] text-cyan-400 font-mono">x{ind.marginMultiplier} Margin</div>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ind.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                setStep('welcome');
              }}
              className="w-1/3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs py-3 rounded-xl border border-slate-700 transition"
            >
              Back
            </button>
            <button
              data-start="true"
              type="button"
              onClick={handleStart}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <span>INCORPORATE NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer / Control Hint */}
      <div className="relative z-10 text-center py-2 border-t border-slate-800/80">
        <div className="text-[11px] text-slate-500 font-mono">
          Enter or Tap to Begin · Mobile & Tablet Optimized
        </div>
      </div>
    </div>
  );
};
