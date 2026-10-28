import React from 'react';
import { CompanyState } from '../../game/types';
import { playClickSound } from '../../game/audio';
import { Trophy, X, CheckCircle2, Lock, Sparkles } from 'lucide-react';

interface AchievementsModalProps {
  state: CompanyState;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ state, onClose }) => {
  const unlockedCount = state.achievements.filter(a => a.unlocked).length;
  const totalCount = state.achievements.length;
  const pct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-4 sm:p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-white">Founder Hall of Fame</h2>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                {unlockedCount} / {totalCount} Milestones Unlocked ({pct}%)
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close achievements modal"
            onClick={() => {
              playClickSound(state.settings.soundEnabled);
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 shrink-0">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Achievements List */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1">
          {state.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3 rounded-xl border flex items-start gap-3 transition ${
                ach.unlocked
                  ? 'bg-emerald-950/25 border-emerald-700/60'
                  : 'bg-slate-950/50 border-slate-800 opacity-65'
              }`}
            >
              <div className="text-2xl shrink-0 mt-0.5">{ach.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-white truncate">{ach.title}</span>
                  {ach.unlocked ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded font-mono flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> W{ach.unlockedWeek || state.week}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
