import React, { useState } from 'react';
import { CompanyState, Competitor, TechNode } from '../../game/types';
import { TECH_TREE } from '../../game/techTree';
import { playClickSound, playCashSound, playSuccessSound } from '../../game/audio';
import { 
  Globe2, Cpu, ShieldCheck, CheckCircle2, 
  Lock, ArrowRight, TrendingUp, AlertTriangle, Sparkles 
} from 'lucide-react';

interface RivalsTabProps {
  state: CompanyState;
  onStartResearch: (techId: string) => void;
  onBuyoutCompetitor: (competitorId: string) => void;
}

export const RivalsTab: React.FC<RivalsTabProps> = ({
  state,
  onStartResearch,
  onBuyoutCompetitor,
}) => {
  const [subView, setSubView] = useState<'rivals' | 'tech'>('rivals');

  // Calculate company market share
  const competitorTotalVal = state.competitors.reduce((acc, c) => acc + (c.health !== 'acquired' ? c.valuation : 0), 0);
  const totalMarketVal = competitorTotalVal + state.valuation;
  const companyMarketShare = Math.min(99, Math.max(1, Math.round((state.valuation / totalMarketVal) * 100)));

  return (
    <div className="space-y-3.5 pb-20">
      {/* Subview Toggle Switch */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => {
            playClickSound(state.settings.soundEnabled);
            setSubView('rivals');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            subView === 'rivals'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>Market Intelligence & M&A</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound(state.settings.soundEnabled);
            setSubView('tech');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            subView === 'tech'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>R&D Tech Tree ({state.unlockedTechIds.length}/{TECH_TREE.length})</span>
        </button>
      </div>

      {subView === 'rivals' ? (
        <>
          {/* Market Share Overview */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sector Dominance & Market Share</span>
              </div>
              <span className="text-xs font-black font-mono text-emerald-400">
                You: {companyMarketShare}%
              </span>
            </div>

            {/* Market Share Bar */}
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 flex">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${companyMarketShare}%` }}
                title={`Your Share: ${companyMarketShare}%`}
              />
              {state.competitors.map((comp, idx) => {
                if (comp.health === 'acquired') return null;
                const colors = ['bg-blue-600', 'bg-purple-600', 'bg-amber-600', 'bg-rose-600'];
                const compShare = Math.round((comp.valuation / totalMarketVal) * 100);
                return (
                  <div
                    key={comp.id}
                    className={`${colors[idx % colors.length]} h-full opacity-80`}
                    style={{ width: `${compShare}%` }}
                    title={`${comp.name}: ${compShare}%`}
                  />
                );
              })}
            </div>
          </div>

          {/* Competitor List & M&A Buyouts */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Rival Corporations & M&A Targets
            </div>

            {state.competitors.map((comp) => {
              const isAcquired = comp.health === 'acquired';
              const canBuyout = !isAcquired && state.cash >= comp.buyoutCost;

              return (
                <div
                  key={comp.id}
                  className={`border rounded-xl p-3.5 space-y-2.5 shadow-md ${
                    isAcquired
                      ? 'bg-slate-950/40 border-slate-800/40 opacity-60'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white">{comp.name}</span>
                        {isAcquired ? (
                          <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-1.5 py-0.2 rounded">
                            ACQUIRED
                          </span>
                        ) : (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono uppercase ${
                            comp.health === 'surging'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : comp.health === 'struggling'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {comp.health}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        CEO: <strong className="text-slate-300">{comp.ceoName}</strong> · {comp.productCount} Products
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-white">
                        ${comp.valuation.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">Valuation</div>
                    </div>
                  </div>

                  {/* Wire headline */}
                  <div className="text-[11px] text-slate-300 italic bg-slate-950/60 p-2 rounded border border-slate-800">
                    "{comp.headline}"
                  </div>

                  {!isAcquired && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span className="text-xs text-slate-400 font-mono">
                        Buyout Price: <strong className="text-amber-400">${comp.buyoutCost.toLocaleString()}</strong>
                      </span>

                      <button
                        type="button"
                        disabled={!canBuyout}
                        onClick={() => {
                          playSuccessSound(state.settings.soundEnabled);
                          onBuyoutCompetitor(comp.id);
                        }}
                        className="bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition shadow-sm active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Acquire Company</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* R&D Tech Tree */
        <div className="space-y-3">
          {/* Active Research Progress Banner */}
          {state.activeResearch && (
            <div className="bg-cyan-950/40 border border-cyan-800 rounded-xl p-3.5 space-y-2 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300">Active R&D Laboratory Sprint</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {Math.round((state.activeResearch.progressHours / state.activeResearch.targetHours) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (state.activeResearch.progressHours / state.activeResearch.targetHours) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Tech Nodes by Tier */}
          {[1, 2, 3, 4].map((tierNum) => {
            const tierNodes = TECH_TREE.filter(t => t.tier === tierNum);
            return (
              <div key={tierNum} className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tier {tierNum} Breakthroughs
                </div>

                <div className="space-y-2">
                  {tierNodes.map((tech) => {
                    const isUnlocked = state.unlockedTechIds.includes(tech.id);
                    const isResearching = state.activeResearch?.techId === tech.id;
                    const prereqsMet = tech.requires.every(r => state.unlockedTechIds.includes(r));
                    const canAfford = state.cash >= tech.cost;
                    const canStart = !isUnlocked && !isResearching && prereqsMet && canAfford && !state.activeResearch;

                    return (
                      <div
                        key={tech.id}
                        className={`border rounded-xl p-3 space-y-2 shadow-md ${
                          isUnlocked
                            ? 'bg-emerald-950/20 border-emerald-800/60'
                            : isResearching
                            ? 'bg-cyan-950/30 border-cyan-700'
                            : !prereqsMet
                            ? 'bg-slate-950/40 border-slate-800 opacity-60'
                            : 'bg-slate-900/90 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-white">{tech.name}</span>
                              {isUnlocked && (
                                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-mono">
                                  PATENTED
                                </span>
                              )}
                              {isResearching && (
                                <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.2 rounded font-mono">
                                  IN SPRINT
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{tech.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-white">
                              ${tech.cost.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400">{tech.requiredDevHours} dev hrs</div>
                          </div>
                        </div>

                        {!isUnlocked && !isResearching && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                            <div className="text-[10px] text-slate-400 font-mono">
                              {!prereqsMet ? 'Locked: Requires previous tier tech' : `Cost: $${tech.cost.toLocaleString()}`}
                            </div>

                            <button
                              type="button"
                              disabled={!canStart}
                              onClick={() => {
                                playCashSound(state.settings.soundEnabled);
                                onStartResearch(tech.id);
                              }}
                              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition shadow-sm active:scale-95"
                            >
                              <Cpu className="w-3.5 h-3.5" />
                              <span>Commit R&D</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
