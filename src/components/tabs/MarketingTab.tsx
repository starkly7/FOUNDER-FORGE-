import React, { useState } from 'react';
import { CompanyState, MarketingCampaign } from '../../game/types';
import { playClickSound, playCashSound, playSuccessSound } from '../../game/audio';
import { 
  Rocket, Megaphone, FileText, Target, Globe2, CheckCircle2
} from 'lucide-react';

interface MarketingTabProps {
  state: CompanyState;
  onLaunchCampaign: (channel: MarketingCampaign['channel'], weeklyBudget: number) => void;
  onAcceptContract: (contractId: string) => void;
  onUnlockRegion: (regionId: string) => void;
}

export const MarketingTab: React.FC<MarketingTabProps> = ({
  state,
  onLaunchCampaign,
  onAcceptContract,
  onUnlockRegion,
}) => {
  const [subView, setSubView] = useState<'campaigns' | 'global'>('campaigns');

  const totalCampaignSpend = state.activeCampaigns.reduce((acc, c) => acc + c.weeklyCost, 0);
  const unlockedRegionsCount = state.regions.filter(r => r.unlocked).length;

  const availableCampaigns: {
    channel: MarketingCampaign['channel'];
    title: string;
    description: string;
    cost: number;
    weeks: number;
    efficiencyLabel: string;
    icon: string;
  }[] = [
    {
      channel: 'social_ads',
      title: 'Targeted Social Media Ads',
      description: 'Performance video ads across TikTok, Meta, and X algorithms.',
      cost: 2500,
      weeks: 4,
      efficiencyLabel: 'Moderate Yield · 4 Weeks',
      icon: '📱',
    },
    {
      channel: 'influencer',
      title: 'Tech Creator Sponsorships',
      description: 'High-converting endorsements on top business and developer podcasts.',
      cost: 6000,
      weeks: 3,
      efficiencyLabel: 'High Conversion · 3 Weeks',
      icon: '🎙️',
    },
    {
      channel: 'seo_content',
      title: 'Inbound SEO Content Engine',
      description: 'Evergreen editorial articles, documentation guides, and comparison pages.',
      cost: 1800,
      weeks: 8,
      efficiencyLabel: 'Long-Tail Compounding · 8 Weeks',
      icon: '🔍',
    },
    {
      channel: 'cold_calling',
      title: 'Enterprise SDR Cold Calling',
      description: 'Dedicated outbound sales representatives booking high-ticket discovery calls.',
      cost: 3500,
      weeks: 6,
      efficiencyLabel: 'B2B Accounts · 6 Weeks',
      icon: '📞',
    },
    {
      channel: 'pr_stunt',
      title: 'Viral Guerilla PR Stunt',
      description: 'Bold controversial marketing blitz that captivates tech press and Reddit.',
      cost: 9500,
      weeks: 2,
      efficiencyLabel: 'Explosive Reach · 2 Weeks',
      icon: '💣',
    },
    {
      channel: 'superbowl',
      title: 'Times Square & Super Bowl Blitz',
      description: 'Massive mainstream consumer awareness campaign seen by millions.',
      cost: 45000,
      weeks: 2,
      efficiencyLabel: 'Maximum Brand Awareness · 2 Weeks',
      icon: '🏟️',
    },
  ];

  return (
    <div className="space-y-3.5 pb-20">
      {/* Subview Toggle */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => {
            playClickSound(state.settings.soundEnabled);
            setSubView('campaigns');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            subView === 'campaigns'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>Campaigns & B2B Deals</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound(state.settings.soundEnabled);
            setSubView('global');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            subView === 'global'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>Global Expansion ({unlockedRegionsCount}/{state.regions.length})</span>
        </button>
      </div>

      {/* Growth Summary Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Rocket className="w-3.5 h-3.5 text-emerald-400" />
            <span>Growth & User Acquisition</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded border border-slate-700">
            Brand Awareness: {state.brandAwareness}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Active Ad Spend</div>
            <div className="text-base font-black text-rose-400 font-mono mt-0.5">
              ${totalCampaignSpend.toLocaleString()}/wk
            </div>
            <div className="text-[10px] text-slate-400">{state.activeCampaigns.length} Active Channels</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Active Enterprise Deals</div>
            <div className="text-base font-black text-cyan-400 font-mono mt-0.5">
              {state.activeContracts.length} In Progress
            </div>
            <div className="text-[10px] text-slate-400">{state.availableContracts.length} Ready to Sign</div>
          </div>
        </div>
      </div>

      {subView === 'campaigns' ? (
        <>
          {/* Active Marketing Campaigns */}
          {state.activeCampaigns.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Active Growth Campaigns ({state.activeCampaigns.length})</span>
              </div>

              {state.activeCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2 shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">{camp.name}</div>
                      <div className="text-xs text-emerald-400 font-mono mt-0.5">
                        ${camp.weeklyCost.toLocaleString()}/wk
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-cyan-400">
                        {camp.weeksRemaining} wks left
                      </div>
                      <div className="text-[10px] text-slate-400">Campaign Flight</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Available Marketing Campaigns to Launch */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch Marketing Flight</span>
            </div>

            <div className="space-y-2">
              {availableCampaigns.map((c) => {
                const canAfford = state.cash >= c.cost;
                const isAlreadyActive = state.activeCampaigns.some(ac => ac.channel === c.channel);

                return (
                  <div
                    key={c.channel}
                    className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2 shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{c.icon}</span>
                        <div>
                          <div className="font-bold text-sm text-white">{c.title}</div>
                          <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                          <div className="text-[10px] text-cyan-400 font-mono mt-1">{c.efficiencyLabel}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">
                          ${c.cost.toLocaleString()}/wk
                        </div>
                        <div className="text-[10px] text-slate-400">{c.weeks} weeks</div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1 border-t border-slate-800/80">
                      <button
                        type="button"
                        disabled={!canAfford || isAlreadyActive}
                        onClick={() => {
                          playCashSound(state.settings.soundEnabled);
                          onLaunchCampaign(c.channel, c.cost);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition shadow-sm active:scale-95"
                      >
                        <Rocket className="w-3.5 h-3.5" />
                        <span>{isAlreadyActive ? 'Running' : `Launch ($${c.cost.toLocaleString()}/wk)`}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enterprise B2B Contracts Board */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Enterprise B2B Client Contracts</span>
            </div>

            {state.activeContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-slate-900/90 border border-cyan-800/60 rounded-xl p-3.5 space-y-2.5 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white">{contract.clientName}</span>
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.2 rounded font-mono">
                        Active Delivery
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{contract.scopeDescription}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      ${contract.payout.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">{contract.weeksRemaining} wks remaining</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Milestone Progress</span>
                    <span className="font-mono text-cyan-400 font-bold">{Math.round(contract.progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all"
                      style={{ width: `${contract.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {state.availableContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-sm text-white">{contract.clientName}</div>
                    <p className="text-xs text-slate-400 mt-0.5">{contract.scopeDescription}</p>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      Req Skill: {contract.requiredEngineeringSkill} · Delivery Window: {contract.weeksToComplete} wks
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      +${contract.payout.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-rose-400 font-mono">Penalty: -${contract.penaltyOnFailure.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex justify-end pt-1 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      playCashSound(state.settings.soundEnabled);
                      onAcceptContract(contract.id);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg border border-slate-700 flex items-center gap-1 transition shadow-sm active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sign Deal (${contract.payout.toLocaleString()})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Global Market Expansion View */
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Global Territories & Localization</span>
          </div>

          {state.regions.map((reg) => {
            const canAfford = state.cash >= reg.unlockCost;
            return (
              <div
                key={reg.id}
                className={`border rounded-xl p-3.5 space-y-2 shadow-md transition ${
                  reg.unlocked
                    ? 'bg-emerald-950/20 border-emerald-800/60'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <span className="text-2xl">{reg.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white">{reg.name}</span>
                        {reg.unlocked && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{reg.description}</p>
                      {reg.unlockCost > 0 && (
                        <div className="text-[10px] text-cyan-400 font-mono mt-1">
                          +{Math.round(reg.userMultiplier * 100)}% User Growth · +{Math.round(reg.revenueMultiplier * 100)}% Global Revenue
                        </div>
                      )}
                    </div>
                  </div>
                  {!reg.unlocked && (
                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-white">
                        ${reg.unlockCost.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">Setup Fee</div>
                    </div>
                  )}
                </div>

                {!reg.unlocked && (
                  <div className="flex justify-end pt-1 border-t border-slate-800/80">
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => {
                        playSuccessSound(state.settings.soundEnabled);
                        onUnlockRegion(reg.id);
                      }}
                      className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition shadow-sm active:scale-95"
                    >
                      <Globe2 className="w-3.5 h-3.5" />
                      <span>Expand into {reg.name} (${reg.unlockCost.toLocaleString()})</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
