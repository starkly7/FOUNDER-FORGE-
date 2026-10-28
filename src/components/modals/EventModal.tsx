import React from 'react';
import { GameEvent, GameEventChoice } from '../../game/types';
import { playClickSound, playCashSound } from '../../game/audio';
import { AlertCircle, AlertTriangle, ArrowRight, X } from 'lucide-react';

interface EventModalProps {
  event: GameEvent;
  onSelectChoice: (choiceIndex: number) => void;
  onClose: () => void;
  soundEnabled: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  onSelectChoice,
  onClose,
  soundEnabled,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-4 sm:p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {event.category.toUpperCase()} DILEMMA
              </span>
              <h2 className="text-base font-black text-white">{event.title}</h2>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          {event.description}
        </p>

        {/* Choices */}
        <div className="space-y-2">
          {event.choices.map((choice, idx) => {
            const hasCash = choice.effects.cashDelta !== undefined;
            const hasRep = choice.effects.reputationDelta !== undefined;
            const hasMorale = choice.effects.moraleDelta !== undefined;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  playCashSound(soundEnabled);
                  onSelectChoice(idx);
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-850 hover:border-emerald-500/60 transition group active:scale-[0.99] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white group-hover:text-emerald-400 transition">
                    {choice.text}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-[11px] text-slate-400">{choice.description}</p>

                {/* Effect Preview Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono">
                  {hasCash && (
                    <span className={choice.effects.cashDelta! >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {choice.effects.cashDelta! >= 0 ? `+$${choice.effects.cashDelta!.toLocaleString()}` : `-$${Math.abs(choice.effects.cashDelta!).toLocaleString()}`}
                    </span>
                  )}
                  {hasRep && (
                    <span className={choice.effects.reputationDelta! >= 0 ? 'text-cyan-400' : 'text-amber-400'}>
                      {choice.effects.reputationDelta! >= 0 ? `+${choice.effects.reputationDelta} Rep` : `${choice.effects.reputationDelta} Rep`}
                    </span>
                  )}
                  {hasMorale && (
                    <span className={choice.effects.moraleDelta! >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {choice.effects.moraleDelta! >= 0 ? `+${choice.effects.moraleDelta}% Morale` : `${choice.effects.moraleDelta}% Morale`}
                    </span>
                  )}
                  {choice.effects.riskOfBackfire && (
                    <span className="text-amber-400 font-bold">
                      ⚠️ {Math.round(choice.effects.riskOfBackfire * 100)}% Backfire Risk
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
