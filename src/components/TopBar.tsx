import React, { useState } from 'react';
import { CompanyState } from '../game/types';
import { ECONOMIC_CYCLES } from '../game/constants';
import { playClickSound } from '../game/audio';
import { 
  Play, Pause, FastForward, Volume2, VolumeX, 
  Calendar, TrendingUp, TrendingDown, DollarSign, 
  Save, AlertTriangle, Check, Trophy
} from 'lucide-react';

interface TopBarProps {
  state: CompanyState;
  onAdvanceWeek: () => void;
  onToggleSound: () => void;
  onToggleAutoSpeed: (speed: 'pause' | 'normal' | 'fast') => void;
  onSaveGame: () => void;
  onOpenAchievements: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  state,
  onAdvanceWeek,
  onToggleSound,
  onToggleAutoSpeed,
  onSaveGame,
  onOpenAchievements,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute weekly burn and runway
  const latestFinancial = state.financialHistory[state.financialHistory.length - 1];
  const weeklyNet = latestFinancial ? latestFinancial.netIncome : 0;
  
  // Calculate runway in weeks if burning cash
  const isBurning = weeklyNet < 0;
  const runwayWeeks = isBurning ? Math.max(0, Math.floor(state.cash / Math.abs(weeklyNet))) : null;

  const currentYear = Math.floor((state.week - 1) / 52) + 1;
  const currentQuarter = Math.floor(((state.week - 1) % 52) / 13) + 1;
  const weekInQuarter = ((state.week - 1) % 13) + 1;

  const unlockedAchCount = state.achievements.filter(a => a.unlocked).length;
  const macro = ECONOMIC_CYCLES[state.economicCycle] || ECONOMIC_CYCLES.stable_growth;

  const handleSave = () => {
    playClickSound(state.settings.soundEnabled);
    onSaveGame();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const formatCurrency = (val: number) => {
    if (Math.abs(val) >= 1000000000) {
      return `$${(val / 1000000000).toFixed(2)}B`;
    }
    if (Math.abs(val) >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    if (Math.abs(val) >= 1000) {
      return `$${(val / 1000).toFixed(1)}k`;
    }
    return `$${val.toLocaleString()}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800/80 px-3 py-2.5 shadow-md">
      {/* Top row: Company Name, Macro Cycle, Date, Trophy, Sound & Save */}
      <div className="flex items-center justify-between mb-2 gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-black text-sm tracking-tight text-white truncate max-w-[115px]">
            {state.companyName}
          </span>
          {state.isPublic ? (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
              NASDAQ
            </span>
          ) : (
            <span className="bg-slate-900 text-slate-300 border border-slate-800 text-[9px] font-mono px-1.5 py-0.5 rounded truncate max-w-[105px]">
              {macro.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Calendar Date Tag */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-1.5 py-1 rounded-md text-[10px] font-mono text-slate-300">
            <Calendar className="w-3 h-3 text-cyan-400" />
            <span>Y{currentYear} Q{currentQuarter} W{weekInQuarter}</span>
          </div>

          {/* Achievements Trophy Button */}
          <button
            type="button"
            aria-label="Open Achievements Hall of Fame"
            onClick={() => {
              playClickSound(state.settings.soundEnabled);
              onOpenAchievements();
            }}
            className="px-1.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 transition flex items-center gap-1 text-[10px] font-mono font-bold"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{unlockedAchCount}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            aria-label={state.settings.soundEnabled ? 'Mute sound' : 'Unmute sound'}
            onClick={() => {
              playClickSound(!state.settings.soundEnabled);
              onToggleSound();
            }}
            className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            {state.settings.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {/* Save Button */}
          <button
            type="button"
            aria-label="Save game progress"
            onClick={handleSave}
            className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1"
          >
            {saveSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Save className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {/* Cash in Bank */}
        <div className={`p-1.5 rounded-lg border text-left flex flex-col justify-between ${
          state.cash < 0 
            ? 'bg-rose-950/40 border-rose-600/80 text-rose-300 animate-pulse'
            : state.cash < 15000
            ? 'bg-amber-950/30 border-amber-600/50 text-amber-300'
            : 'bg-slate-900/80 border-slate-800 text-slate-200'
        }`}>
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
            <span>Treasury</span>
            <DollarSign className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-sm font-black font-mono tracking-tight text-white">
            {formatCurrency(state.cash)}
          </div>
        </div>

        {/* Weekly Net Profit / Burn */}
        <div className="p-1.5 rounded-lg border bg-slate-900/80 border-slate-800 text-slate-200 flex flex-col justify-between">
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
            <span>Net / Wk</span>
            {weeklyNet >= 0 ? (
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-rose-400" />
            )}
          </div>
          <div className={`text-sm font-black font-mono tracking-tight ${
            weeklyNet >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {weeklyNet >= 0 ? `+${formatCurrency(weeklyNet)}` : `-${formatCurrency(Math.abs(weeklyNet))}`}
          </div>
        </div>

        {/* Valuation / Market Cap */}
        <div className="p-1.5 rounded-lg border bg-slate-900/80 border-slate-800 text-slate-200 flex flex-col justify-between">
          <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
            <span>Valuation</span>
            <span className="text-[9px] font-mono text-cyan-400">Equity {state.equityFounder}%</span>
          </div>
          <div className="text-sm font-black font-mono tracking-tight text-cyan-300">
            {formatCurrency(state.valuation)}
          </div>
        </div>
      </div>

      {/* Runway Alert if burning cash */}
      {isBurning && runwayWeeks !== null && runwayWeeks < 12 && (
        <div className="mb-2 px-2 py-1 bg-amber-950/60 border border-amber-600/60 rounded-md flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-1.5 font-bold text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Critical Runway Warning: {runwayWeeks} weeks left!</span>
          </div>
          <span className="text-[10px] text-amber-300 font-medium">Cut costs or raise VC</span>
        </div>
      )}

      {/* Primary Action & Time Control Bar */}
      <div className="flex items-center gap-2">
        {/* Speed Controls */}
        <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900 p-0.5">
          <button
            type="button"
            aria-label="Pause simulation"
            onClick={() => onToggleAutoSpeed('pause')}
            className={`p-1.5 rounded-md text-xs transition ${
              state.settings.autoPlaySpeed === 'pause'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Normal speed 1x"
            onClick={() => onToggleAutoSpeed('normal')}
            className={`p-1.5 rounded-md text-xs transition ${
              state.settings.autoPlaySpeed === 'normal'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Fast speed 2x"
            onClick={() => onToggleAutoSpeed('fast')}
            className={`p-1.5 rounded-md text-xs transition ${
              state.settings.autoPlaySpeed === 'fast'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Big Tactile "Next Week" Turn Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound(state.settings.soundEnabled);
            onAdvanceWeek();
          }}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-slate-950 font-black text-xs py-2 px-3 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>ADVANCE TO NEXT WEEK</span>
        </button>
      </div>
    </header>
  );
};
