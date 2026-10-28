import React, { useState } from 'react';
import { CompanyState } from '../../game/types';
import { playClickSound, playCashSound, playSuccessSound } from '../../game/audio';
import { 
  DollarSign, Landmark, PieChart, Bell, Sparkles, RefreshCw 
} from 'lucide-react';

interface FinanceTabProps {
  state: CompanyState;
  onRaiseFunding: (roundName: string, equityPct: number, valuation: number) => void;
  onBuybackShares: (equityPct: number) => void;
  onTakeLoan: (amount: number) => void;
  onRepayLoan: (amount: number) => void;
  onLaunchIPO: () => void;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({
  state,
  onRaiseFunding,
  onBuybackShares,
  onTakeLoan,
  onRepayLoan,
  onLaunchIPO,
}) => {
  const [selectedEquity, setSelectedEquity] = useState(15);

  const latest = state.financialHistory[state.financialHistory.length - 1];
  const rev = latest ? latest.revenue : 0;
  const exp = latest ? latest.expenses : { payroll: 0, servers: 0, marketing: 0, office: 0, loanInterest: 0, taxes: 0 };
  const totalExp = exp.payroll + exp.servers + exp.marketing + exp.office + exp.loanInterest + exp.taxes;
  const net = rev - totalExp;

  // Max loan capacity based on valuation
  const maxLoanCapacity = Math.max(50000, Math.round(state.valuation * 0.3));

  // Determine current eligible funding round
  const getEligibleRound = () => {
    if (state.valuation < 1500000) {
      return { name: 'Angel & Friends Round', baseVal: Math.max(state.valuation, 1000000) };
    }
    if (state.valuation < 6000000) {
      return { name: 'Seed Capital Round', baseVal: Math.max(state.valuation, 3500000) };
    }
    if (state.valuation < 25000000) {
      return { name: 'Series A Venture Round', baseVal: Math.max(state.valuation, 12000000) };
    }
    return { name: 'Series B Mega-Round', baseVal: Math.max(state.valuation, 40000000) };
  };

  const eligibleRound = getEligibleRound();
  const projectedCashInjection = Math.round(eligibleRound.baseVal * (selectedEquity / 100));

  const buybackCost5Pct = Math.round(state.valuation * 0.05 * 1.05);
  const canBuyback = state.equityFounder <= 95 && state.cash >= buybackCost5Pct;

  const canIPO = !state.isPublic && state.valuation >= 30000000;

  return (
    <div className="space-y-3.5 pb-20">
      {/* Financial Health Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Corporate Income Statement (Weekly)</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
            Equity: {state.equityFounder}%
          </span>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Gross Weekly Revenue</span>
            <span className="font-mono text-emerald-400 font-bold">+${rev.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400 pl-2">
            <span>· Team Payroll</span>
            <span className="font-mono text-rose-400">-${exp.payroll.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400 pl-2">
            <span>· Server Infrastructure</span>
            <span className="font-mono text-rose-400">-${exp.servers.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400 pl-2">
            <span>· Marketing Campaigns</span>
            <span className="font-mono text-rose-400">-${exp.marketing.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400 pl-2">
            <span>· Headquarters & Perks</span>
            <span className="font-mono text-rose-400">-${exp.office.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400 pl-2">
            <span>· Debt Service Interest</span>
            <span className="font-mono text-rose-400">-${exp.loanInterest.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400 pl-2">
            <span>· Corporate Taxes</span>
            <span className="font-mono text-rose-400">-${exp.taxes.toLocaleString()}</span>
          </div>

          <div className="flex justify-between font-bold pt-2 border-t border-slate-800 text-sm">
            <span className="text-white">Net Weekly Income</span>
            <span className={`font-mono ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {net >= 0 ? `+$${net.toLocaleString()}` : `-$${Math.abs(net).toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>

      {/* Venture Capital Investment Deck */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <PieChart className="w-3.5 h-3.5 text-cyan-400" />
            <span>Venture Capital & Equity</span>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-mono">
            {eligibleRound.name}
          </span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Offering Valuation</span>
            <span className="font-mono font-bold text-white">${eligibleRound.baseVal.toLocaleString()}</span>
          </div>

          {/* Equity Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Dilute Founder Equity</span>
              <span className="font-bold font-mono text-cyan-400">{selectedEquity}%</span>
            </div>
            <div className="flex gap-2">
              {[10, 15, 20, 25].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    playClickSound(state.settings.soundEnabled);
                    setSelectedEquity(pct);
                  }}
                  className={`flex-1 py-1 rounded text-xs font-mono font-bold border transition ${
                    selectedEquity === pct
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
            <span className="text-slate-400">Capital to Inject</span>
            <span className="font-mono font-black text-emerald-400 text-sm">
              +${projectedCashInjection.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            disabled={state.equityFounder < selectedEquity}
            onClick={() => {
              playCashSound(state.settings.soundEnabled);
              onRaiseFunding(eligibleRound.name, selectedEquity, eligibleRound.baseVal);
            }}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 font-black text-xs py-2 px-3 rounded-lg shadow flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sign Term Sheet & Close Round</span>
          </button>

          {/* Share Buyback Program */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-white">Share Buyback (5% Equity)</div>
              <div className="text-[10px] text-slate-400 font-mono">
                Cost: ${buybackCost5Pct.toLocaleString()} · Reclaim Ownership
              </div>
            </div>
            <button
              type="button"
              disabled={!canBuyback}
              onClick={() => {
                playSuccessSound(state.settings.soundEnabled);
                onBuybackShares(5);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-400 font-bold text-xs rounded-lg border border-slate-700 flex items-center gap-1 transition shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Buyback 5%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Commercial Credit & Debt Facility */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Commercial Banking & Debt</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Outstanding Debt: <strong className="text-rose-400">${state.debt.toLocaleString()}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={state.debt + 25000 > maxLoanCapacity}
            onClick={() => {
              playCashSound(state.settings.soundEnabled);
              onTakeLoan(25000);
            }}
            className="p-2.5 bg-slate-950/70 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-lg text-left transition active:scale-95"
          >
            <div className="text-xs font-bold text-white">Draw Credit Line</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">+$25,000 Cash</div>
            <div className="text-[9px] text-slate-400 mt-1">~0.4%/wk interest</div>
          </button>

          <button
            type="button"
            disabled={state.debt === 0 || state.cash < 25000}
            onClick={() => {
              playCashSound(state.settings.soundEnabled);
              onRepayLoan(25000);
            }}
            className="p-2.5 bg-slate-950/70 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-lg text-left transition active:scale-95"
          >
            <div className="text-xs font-bold text-white">Repay Debt</div>
            <div className="text-[10px] text-rose-400 font-mono mt-0.5">-$25,000 Cash</div>
            <div className="text-[9px] text-slate-400 mt-1">Lowers weekly interest</div>
          </button>
        </div>
      </div>

      {/* Stock Exchange / Public IPO Terminal */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Wall Street & Public Markets</span>
          </div>
          {state.isPublic ? (
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
              LISTED (TICKER: FF)
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-mono">
              Req: $30M Valuation
            </span>
          )}
        </div>

        {state.isPublic ? (
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Share Price</div>
                <div className="text-lg font-black text-emerald-400 font-mono">
                  ${state.sharePrice.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Market Capitalization</div>
                <div className="text-base font-bold text-white font-mono">
                  ${state.valuation.toLocaleString()}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              Your shares are traded dynamically every week by global institutional investors based on revenue growth and profitability!
            </p>
          </div>
        ) : (
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2 text-center">
            <p className="text-xs text-slate-300">
              Take {state.companyName} public on NASDAQ! Ring the opening bell and raise hundreds of millions from retail and institutional markets.
            </p>
            <button
              type="button"
              disabled={!canIPO}
              onClick={() => {
                playSuccessSound(state.settings.soundEnabled);
                onLaunchIPO();
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-30 text-slate-950 font-black text-xs py-2.5 px-3 rounded-lg shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
            >
              <Bell className="w-4 h-4" />
              <span>LAUNCH INITIAL PUBLIC OFFERING (IPO)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
