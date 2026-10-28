import React from 'react';
import { CompanyState } from '../../game/types';
import { playClickSound, playCashSound } from '../../game/audio';
import { Skull, Trophy, RotateCcw, Award, Calendar, DollarSign, Users, Layers } from 'lucide-react';

interface GameOverModalProps {
  state: CompanyState;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ state, onRestart }) => {
  const isVictory = state.isVictory || (state.isPublic && state.valuation >= 1000000000);
  const totalRevenueEver = state.products.reduce((acc, p) => acc + p.totalRevenue, 0);
  const liveCount = state.products.filter(p => p.status === 'live').length;
  const unlockedAch = state.achievements.filter(a => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="inline-flex p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
          {isVictory ? (
            <Trophy className="w-10 h-10 text-amber-400" />
          ) : (
            <Skull className="w-10 h-10 text-rose-500" />
          )}
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            {isVictory ? 'VENTURE GLORY' : 'POST-MORTEM REPORT'}
          </span>
          <h2 className="text-xl font-black text-white mt-0.5">
            {isVictory ? 'TITAN OF INDUSTRY' : 'CHAPTER 7 BANKRUPTCY'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
            {state.gameOverReason || 'Your company ceased operations following financial insolvency.'}
          </p>
        </div>

        {/* Operational Statistics Card */}
        <div className="grid grid-cols-2 gap-2 text-left bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <div className="p-1.5">
            <div className="text-[10px] text-slate-400 uppercase">Weeks Survived</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              {state.week} Weeks
            </div>
          </div>
          <div className="p-1.5">
            <div className="text-[10px] text-slate-400 uppercase">Peak Valuation</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              ${state.valuation.toLocaleString()}
            </div>
          </div>
          <div className="p-1.5">
            <div className="text-[10px] text-slate-400 uppercase">Lifetime Product Rev</div>
            <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
              ${totalRevenueEver.toLocaleString()}
            </div>
          </div>
          <div className="p-1.5">
            <div className="text-[10px] text-slate-400 uppercase">Achievements</div>
            <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
              {unlockedAch} / {state.achievements.length}
            </div>
          </div>
        </div>

        <button
          data-start="true"
          type="button"
          onClick={() => {
            playCashSound(state.settings.soundEnabled);
            onRestart();
          }}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>START A NEW VENTURE</span>
        </button>
      </div>
    </div>
  );
};
