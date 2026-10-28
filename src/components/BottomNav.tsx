import React from 'react';
import { LayoutDashboard, Layers, Users, Rocket, DollarSign, Globe2 } from 'lucide-react';
import { playClickSound } from '../game/audio';

export type ActiveTab = 'overview' | 'products' | 'staff' | 'marketing' | 'finance' | 'market';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingEventCount: number;
  soundEnabled: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  pendingEventCount,
  soundEnabled,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Layers },
    { id: 'staff', label: 'Team', icon: Users },
    { id: 'marketing', label: 'Growth', icon: Rocket },
    { id: 'finance', label: 'Treasury', icon: DollarSign },
    { id: 'market', label: 'Market', icon: Globe2 },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-slate-950/95 border-t border-slate-800/80 px-1 py-1.5 shadow-2xl backdrop-blur-sm">
      <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-label={`Open ${tab.label} section`}
              onClick={() => {
                playClickSound(soundEnabled);
                onSelectTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition active:scale-95 ${
                isActive
                  ? 'text-emerald-400 font-bold bg-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>

              {/* Red badge if pending event and on overview */}
              {tab.id === 'overview' && pendingEventCount > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
