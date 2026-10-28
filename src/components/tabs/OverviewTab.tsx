import React, { useState } from 'react';
import { CompanyState } from '../../game/types';
import { OFFICE_TIERS, INDUSTRIES, FOUNDER_TRAITS, ECONOMIC_CYCLES } from '../../game/constants';
import { playClickSound, playCashSound, playSuccessSound } from '../../game/audio';
import { 
  AlertCircle, Activity, Zap, Mic, ShieldCheck, Globe2
} from 'lucide-react';

interface OverviewTabProps {
  state: CompanyState;
  onOpenEventModal: () => void;
  onQuickAction: (actionType: 'pizza_party' | 'hackathon' | 'security_audit') => void;
  onHostEarningsCall: (strategy: 'conservative' | 'balanced' | 'audacious') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  state,
  onOpenEventModal,
  onQuickAction,
  onHostEarningsCall,
}) => {
  const [logFilter, setLogFilter] = useState<'all' | 'warning' | 'success'>('all');

  const office = OFFICE_TIERS[state.officeLevel] || OFFICE_TIERS[0];
  const industry = INDUSTRIES[state.industry];
  const founderTrait = FOUNDER_TRAITS.find(t => t.id === state.founderTrait);
  const macro = ECONOMIC_CYCLES[state.economicCycle] || ECONOMIC_CYCLES.stable_growth;

  const canHostEarnings = state.lastEarningsCallWeek === 0 || (state.week - state.lastEarningsCallWeek >= 6);
  const cooldownWeeks = Math.max(0, 6 - (state.week - state.lastEarningsCallWeek));

  // Financial history for sparkline
  const history = state.financialHistory.slice(-16);
  const maxRevenue = Math.max(1000, ...history.map(h => h.revenue));
  const maxCash = Math.max(1000, ...history.map(h => Math.max(0, h.cash)));

  const filteredLogs = state.logs.filter(log => {
    if (logFilter === 'all') return true;
    if (logFilter === 'warning') return log.type === 'warning' || log.type === 'danger';
    if (logFilter === 'success') return log.type === 'success';
    return true;
  });

  const unlockedRegionsCount = state.regions.filter(r => r.unlocked).length;

  return (
    <div className="space-y-3.5 pb-20">
      {/* Pending Crisis / Decision Banner */}
      {state.pendingEvent && (
        <div className="bg-gradient-to-r from-rose-950/80 to-amber-950/60 border border-rose-500/70 rounded-xl p-3.5 shadow-lg shadow-rose-950/20 animate-pulse">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                Urgent Corporate Dilemma
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {state.pendingEvent.title}
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                {state.pendingEvent.description}
              </p>
              <button
                type="button"
                onClick={() => {
                  playClickSound(state.settings.soundEnabled);
                  onOpenEventModal();
                }}
                className="mt-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow transition"
              >
                Convene Board & Decide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Founder & Corporate Dossier Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base text-white">{state.companyName}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-medium px-1.5 py-0.5 rounded border border-slate-700">
                {industry.name}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <span>CEO: <strong className="text-slate-200">{state.founderName}</strong></span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">{founderTrait?.name}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase text-slate-400 font-bold">Reputation</div>
            <div className="text-sm font-black text-emerald-400 font-mono">
              {state.reputation}/100
            </div>
          </div>
        </div>

        {/* Board Confidence & Macro Climate Bar */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Board Confidence
            </span>
            <span className="font-mono font-bold text-cyan-400">{state.boardConfidence}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all ${
                state.boardConfidence >= 70 ? 'bg-emerald-500' : state.boardConfidence >= 40 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${state.boardConfidence}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span>Macro Climate: <strong className="text-slate-200">{macro.name}</strong></span>
            <span className="font-mono text-emerald-400">Regions: {unlockedRegionsCount}/6</span>
          </div>
        </div>

        {/* Vital Gauges */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Headquarters</div>
            <div className="text-xs font-bold text-white truncate mt-0.5">{office.name}</div>
            <div className="text-[9px] text-slate-400">{state.staff.length}/{office.maxStaff} Team</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Brand Power</div>
            <div className="text-xs font-bold text-cyan-400 mt-0.5">{state.brandAwareness}%</div>
            <div className="text-[9px] text-slate-400">Market Reach</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Active Products</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5">
              {state.products.filter(p => p.status === 'live').length} Live
            </div>
            <div className="text-[9px] text-slate-400">{state.products.filter(p => p.status === 'development').length} in R&D</div>
          </div>
        </div>
      </div>

      {/* Financial Trajectory Graph (SVG Sparkline) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Weekly Performance Trajectory</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Revenue
            </span>
            <span className="flex items-center gap-1 text-cyan-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> Treasury
            </span>
          </div>
        </div>

        {history.length > 2 ? (
          <div className="h-24 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
              <line x1="0" y1="12" x2="100" y2="12" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />
              <line x1="0" y1="38" x2="100" y2="38" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />

              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={history
                  .map((h, idx) => {
                    const x = (idx / (history.length - 1)) * 100;
                    const y = 48 - (h.revenue / maxRevenue) * 44;
                    return `${x},${isNaN(y) ? 48 : y}`;
                  })
                  .join(' ')}
              />

              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.8"
                strokeDasharray="3 2"
                strokeLinecap="round"
                points={history
                  .map((h, idx) => {
                    const x = (idx / (history.length - 1)) * 100;
                    const y = 48 - (Math.max(0, h.cash) / maxCash) * 44;
                    return `${x},${isNaN(y) ? 48 : y}`;
                  })
                  .join(' ')}
              />
            </svg>
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center text-xs text-slate-500 font-mono">
            Advance turns to populate financial chart telemetry...
          </div>
        )}
      </div>

      {/* Investor Relations & Quarterly Keynote */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>Investor Relations & Guidance Call</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {canHostEarnings ? 'Ready to Broadcast' : `Cooldown: ${cooldownWeeks}w`}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            disabled={!canHostEarnings}
            onClick={() => {
              playSuccessSound(state.settings.soundEnabled);
              onHostEarningsCall('conservative');
            }}
            className="p-2 bg-slate-950/80 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-lg text-left transition active:scale-95"
          >
            <div className="text-xs font-bold text-white">Disciplined</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">+5% Val · +8 Board</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Safe & Steady</div>
          </button>

          <button
            type="button"
            disabled={!canHostEarnings}
            onClick={() => {
              playSuccessSound(state.settings.soundEnabled);
              onHostEarningsCall('balanced');
            }}
            className="p-2 bg-slate-950/80 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-lg text-left transition active:scale-95"
          >
            <div className="text-xs font-bold text-white">Growth Keynote</div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">+12% Val · +8 Brand</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Product Roadmap</div>
          </button>

          <button
            type="button"
            disabled={!canHostEarnings}
            onClick={() => {
              playSuccessSound(state.settings.soundEnabled);
              onHostEarningsCall('audacious');
            }}
            className="p-2 bg-slate-950/80 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-lg text-left transition active:scale-95"
          >
            <div className="text-xs font-bold text-white">Moonshot Hype</div>
            <div className="text-[10px] text-amber-400 font-mono mt-0.5">+25% Val (Req 55 Rep)</div>
            <div className="text-[9px] text-slate-400 mt-0.5">High Stakes</div>
          </button>
        </div>
      </div>

      {/* Quick Executive Operations */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2 shadow-md">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Executive Actions</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => {
              playCashSound(state.settings.soundEnabled);
              onQuickAction('pizza_party');
            }}
            className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-lg text-left transition active:scale-95"
          >
            <div className="text-base mb-1">🍕</div>
            <div className="text-xs font-bold text-white">All-Hands Pizza</div>
            <div className="text-[10px] text-emerald-400 font-mono">-$1,500 · +15 Morale</div>
          </button>

          <button
            type="button"
            onClick={() => {
              playCashSound(state.settings.soundEnabled);
              onQuickAction('hackathon');
            }}
            className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-lg text-left transition active:scale-95"
          >
            <div className="text-base mb-1">⚡</div>
            <div className="text-xs font-bold text-white">48hr Hackathon</div>
            <div className="text-[10px] text-cyan-400 font-mono">-$4,000 · +Dev Speed</div>
          </button>

          <button
            type="button"
            onClick={() => {
              playCashSound(state.settings.soundEnabled);
              onQuickAction('security_audit');
            }}
            className="p-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-lg text-left transition active:scale-95"
          >
            <div className="text-base mb-1">🛡️</div>
            <div className="text-xs font-bold text-white">Security Audit</div>
            <div className="text-[10px] text-amber-400 font-mono">-$5,000 · -Bugs</div>
          </button>
        </div>
      </div>

      {/* Live Operational Feed / Logs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Corporate Chronicle & Feed</span>
          </div>
          <div className="flex gap-1">
            {(['all', 'warning', 'success'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setLogFilter(filter)}
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded transition ${
                  logFilter === filter
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {filteredLogs.slice(0, 15).map((log) => {
            const isDanger = log.type === 'danger';
            const isWarning = log.type === 'warning';
            const isSuccess = log.type === 'success';

            return (
              <div
                key={log.id}
                className={`p-2 rounded-lg text-xs border flex items-start gap-2 ${
                  isDanger
                    ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                    : isSuccess
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                    : 'bg-slate-950/50 border-slate-800/60 text-slate-300'
                }`}
              >
                <span className="font-mono text-[10px] text-slate-400 shrink-0 mt-0.5">
                  W{log.week}
                </span>
                <span className="leading-snug">{log.message}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
