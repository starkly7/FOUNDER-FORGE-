import React from 'react';
import { CompanyState, Product } from '../../game/types';
import { playClickSound, playCashSound } from '../../game/audio';
import { 
  Layers, Plus, Bug, Server, Users, Sparkles, 
  Trash2, ShieldCheck, Zap, DollarSign, Activity 
} from 'lucide-react';

interface ProductsTabProps {
  state: CompanyState;
  onOpenCreateProduct: () => void;
  onFixBugs: (productId: string) => void;
  onScaleServers: (productId: string) => void;
  onSunsetProduct: (productId: string) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  state,
  onOpenCreateProduct,
  onFixBugs,
  onScaleServers,
  onSunsetProduct,
}) => {
  const liveProducts = state.products.filter(p => p.status === 'live');
  const devProducts = state.products.filter(p => p.status === 'development');

  const totalUsers = liveProducts.reduce((acc, p) => acc + p.activeUsers, 0);
  const totalWeeklyRev = liveProducts.reduce((acc, p) => acc + p.weeklyRevenue, 0);

  return (
    <div className="space-y-3.5 pb-20">
      {/* Portfolio Header Metric Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Product & R&D Engine</span>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound(state.settings.soundEnabled);
              onOpenCreateProduct();
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New R&D Sprint</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Total Active Users</div>
            <div className="text-base font-black text-white font-mono mt-0.5">
              {totalUsers.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">Across {liveProducts.length} Live Offerings</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Weekly Product Rev</div>
            <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
              ${totalWeeklyRev.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">~${(totalWeeklyRev * 4.3).toLocaleString()}/mo</div>
          </div>
        </div>
      </div>

      {/* In-Development Products */}
      {devProducts.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Development Sprints ({devProducts.length})</span>
          </div>
          {devProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">{prod.name}</span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-1.5 py-0.5 rounded font-mono">
                      {prod.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{prod.description}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-cyan-400">
                    {Math.round(prod.developmentProgress)}%
                  </span>
                </div>
              </div>

              {/* Sprint Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, prod.developmentProgress)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1 border-t border-slate-800/70 font-mono text-slate-400">
                <div>Tech Quality: <strong className="text-slate-200">{prod.features.techQuality}</strong></div>
                <div>UX Polish: <strong className="text-slate-200">{prod.features.userExperience}</strong></div>
                <div>Sec Rating: <strong className="text-slate-200">{prod.features.security}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Commercial Products */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Commercial Products ({liveProducts.length})</span>
        </div>

        {liveProducts.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
            <p className="text-xs">No live products currently on the market.</p>
            <p className="text-[11px] text-slate-500 mt-1">Finish your active R&D sprint or launch a new product to start earning recurring revenue.</p>
          </div>
        ) : (
          liveProducts.map((prod) => {
            const capacityRatio = prod.activeUsers / prod.features.serverCapacity;
            const isNearCapacity = capacityRatio > 0.85;

            return (
              <div
                key={prod.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white">{prod.name}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.5 rounded font-mono uppercase">
                        {prod.pricingModel}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      ${prod.pricePerUserPerMonth}/mo per seat · Satisfaction: <strong className="text-emerald-400">{prod.satisfactionScore}%</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400 font-mono">
                      +${prod.weeklyRevenue.toLocaleString()}/wk
                    </div>
                    <div className="text-[10px] text-slate-400">Total: ${prod.totalRevenue.toLocaleString()}</div>
                  </div>
                </div>

                {/* Live Telemetry Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Paying Users</div>
                    <div className="text-xs font-bold text-white font-mono mt-0.5">
                      {prod.activeUsers.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Weekly Churn</div>
                    <div className="text-xs font-bold text-slate-300 font-mono mt-0.5">
                      {(prod.churnRate * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Active Bugs</div>
                    <div className={`text-xs font-bold font-mono mt-0.5 ${prod.bugsCount > 4 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {prod.bugsCount} issues
                    </div>
                  </div>
                </div>

                {/* Server Load Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Server className="w-3 h-3 text-cyan-400" />
                      Server Fleet Load
                    </span>
                    <span className={isNearCapacity ? 'text-amber-400 font-bold' : ''}>
                      {prod.activeUsers.toLocaleString()} / {prod.features.serverCapacity.toLocaleString()} cap
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isNearCapacity ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, capacityRatio * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    {/* Fix Bugs Button */}
                    <button
                      type="button"
                      disabled={prod.bugsCount === 0 || state.cash < 3000}
                      onClick={() => {
                        playCashSound(state.settings.soundEnabled);
                        onFixBugs(prod.id);
                      }}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1 transition"
                    >
                      <Bug className="w-3 h-3 text-rose-400" />
                      <span>Patch Bugs ($3k)</span>
                    </button>

                    {/* Scale Capacity */}
                    <button
                      type="button"
                      disabled={state.cash < 8000}
                      onClick={() => {
                        playCashSound(state.settings.soundEnabled);
                        onScaleServers(prod.id);
                      }}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1 transition"
                    >
                      <Server className="w-3 h-3 text-cyan-400" />
                      <span>Expand Nodes ($8k)</span>
                    </button>
                  </div>

                  {/* Sunset Product */}
                  <button
                    type="button"
                    aria-label="Sunset product"
                    onClick={() => {
                      playClickSound(state.settings.soundEnabled);
                      onSunsetProduct(prod.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
