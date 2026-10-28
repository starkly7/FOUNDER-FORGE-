import React from 'react';
import { CompanyState, Employee, Candidate } from '../../game/types';
import { OFFICE_TIERS } from '../../game/constants';
import { playClickSound, playCashSound } from '../../game/audio';
import { 
  Users, Building2, UserPlus, Award, DollarSign, 
  ArrowUpCircle, Heart, UserMinus, ShieldAlert, Sparkles 
} from 'lucide-react';

interface StaffTabProps {
  state: CompanyState;
  onHireCandidate: (candidateId: string) => void;
  onFireEmployee: (employeeId: string) => void;
  onGiveRaise: (employeeId: string, pct: number) => void;
  onGiveBonus: (employeeId: string, amount: number) => void;
  onUpgradeOffice: () => void;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  state,
  onHireCandidate,
  onFireEmployee,
  onGiveRaise,
  onGiveBonus,
  onUpgradeOffice,
}) => {
  const currentOffice = OFFICE_TIERS[state.officeLevel] || OFFICE_TIERS[0];
  const nextOffice = OFFICE_TIERS[state.officeLevel + 1];

  const totalPayroll = state.staff.reduce((acc, e) => acc + e.salaryPerWeek, 0);
  const avgMorale = state.staff.length > 0 
    ? Math.round(state.staff.reduce((acc, e) => acc + e.morale, 0) / state.staff.length)
    : 0;

  const isAtCapacity = state.staff.length >= currentOffice.maxStaff;

  const getRoleBadge = (role: Employee['role']) => {
    switch (role) {
      case 'engineer': return { label: 'Engineer', color: 'bg-cyan-950 text-cyan-400 border-cyan-800' };
      case 'designer': return { label: 'Designer', color: 'bg-purple-950 text-purple-400 border-purple-800' };
      case 'marketer': return { label: 'Marketer', color: 'bg-emerald-950 text-emerald-400 border-emerald-800' };
      case 'sales_rep': return { label: 'Sales', color: 'bg-amber-950 text-amber-400 border-amber-800' };
      case 'qa_tester': return { label: 'QA Tester', color: 'bg-blue-950 text-blue-400 border-blue-800' };
      case 'executive': return { label: 'Executive', color: 'bg-rose-950 text-rose-400 border-rose-800' };
    }
  };

  return (
    <div className="space-y-3.5 pb-20">
      {/* Office HQ & Facilities Upgrade */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Headquarters & Facilities</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
            Tier {state.officeLevel + 1} / 5
          </span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-sm text-white">{currentOffice.name}</div>
              <p className="text-xs text-slate-400 mt-0.5">{currentOffice.description}</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-slate-300">
                ${currentOffice.weeklyRent.toLocaleString()}/wk
              </div>
              <div className="text-[10px] text-slate-400">Rent Expense</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
            <span className="text-slate-400">Staff Capacity</span>
            <span className={`font-mono font-bold ${isAtCapacity ? 'text-amber-400' : 'text-slate-200'}`}>
              {state.staff.length} / {currentOffice.maxStaff} Desks
            </span>
          </div>

          {/* Upgrade HQ Button */}
          {nextOffice && (
            <button
              type="button"
              disabled={state.cash < nextOffice.upgradeCost}
              onClick={() => {
                playCashSound(state.settings.soundEnabled);
                onUpgradeOffice();
              }}
              className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-xs py-2 px-3 rounded-lg shadow flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              <span>Relocate to {nextOffice.name} (${nextOffice.upgradeCost.toLocaleString()})</span>
            </button>
          )}
        </div>
      </div>

      {/* Team Metrics Summary */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl shadow-md">
          <div className="text-[10px] text-slate-400 uppercase font-medium">Weekly Payroll</div>
          <div className="text-base font-black text-rose-400 font-mono mt-0.5">
            ${totalPayroll.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">{state.staff.length} Employed</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl shadow-md">
          <div className="text-[10px] text-slate-400 uppercase font-medium">Team Morale</div>
          <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
            {avgMorale}%
          </div>
          <div className="text-[10px] text-slate-400">Peak Productivity</div>
        </div>
      </div>

      {/* Active Staff Roster */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Staff ({state.staff.length})</span>
        </div>

        {state.staff.map((emp) => {
          const badge = getRoleBadge(emp.role);
          return (
            <div
              key={emp.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2.5 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">{emp.name}</span>
                    <span className={`text-[10px] border px-1.5 py-0.2 rounded font-mono ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <span className="text-amber-400 font-medium">{emp.trait}:</span>
                    <span className="line-clamp-1">{emp.traitDescription}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-white">
                    ${emp.salaryPerWeek.toLocaleString()}/wk
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Skill: {emp.skill}/100</div>
                </div>
              </div>

              {/* Morale meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" /> Morale
                  </span>
                  <span>{emp.morale}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      emp.morale > 70 ? 'bg-emerald-500' : emp.morale > 40 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${emp.morale}%` }}
                  />
                </div>
              </div>

              {/* Staff Management Buttons */}
              <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      playCashSound(state.settings.soundEnabled);
                      onGiveRaise(emp.id, 10);
                    }}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium rounded-md border border-slate-700 transition"
                  >
                    +10% Raise
                  </button>
                  <button
                    type="button"
                    disabled={state.cash < 2500}
                    onClick={() => {
                      playCashSound(state.settings.soundEnabled);
                      onGiveBonus(emp.id, 2500);
                    }}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-[11px] font-medium rounded-md border border-slate-700 transition"
                  >
                    $2.5k Bonus
                  </button>
                </div>

                <button
                  type="button"
                  aria-label="Terminate employee"
                  onClick={() => {
                    playClickSound(state.settings.soundEnabled);
                    onFireEmployee(emp.id);
                  }}
                  className="px-2 py-1 text-slate-500 hover:text-rose-400 text-[11px] font-medium rounded-md transition"
                >
                  Fire (2w pay)
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Recruitment Pool */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Talent Pipeline ({state.candidatePool.length})</span>
          </div>
          {isAtCapacity && (
            <span className="text-[10px] text-amber-400 font-bold">Office Full</span>
          )}
        </div>

        {state.candidatePool.map((cand) => {
          const badge = getRoleBadge(cand.role);
          const canAfford = state.cash >= cand.signingBonus;

          return (
            <div
              key={cand.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">{cand.name}</span>
                    <span className={`text-[10px] border px-1.5 py-0.2 rounded font-mono ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <span className="text-amber-400 font-medium">{cand.trait}:</span>
                    <span className="line-clamp-1">{cand.traitDescription}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    Skill: {cand.skill}/100
                  </div>
                  <div className="text-[10px] text-slate-400">${cand.salaryPerWeek}/wk</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-xs text-slate-400">
                  Signing Bonus: <strong className="text-slate-200 font-mono">${cand.signingBonus.toLocaleString()}</strong>
                </span>

                <button
                  type="button"
                  disabled={!canAfford || isAtCapacity}
                  onClick={() => {
                    playCashSound(state.settings.soundEnabled);
                    onHireCandidate(cand.id);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition shadow-sm active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Hire Candidate</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
