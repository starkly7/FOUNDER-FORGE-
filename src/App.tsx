/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CompanyState, IndustryType, FounderTrait } from './game/types';
import { 
  createInitialCompany, advanceWeek, hireEmployee, fireEmployee, 
  giveRaise, giveBonus, trainEmployee, toggleOfficePerk, unlockRegion,
  createProduct, fixBugs, deprecateProduct, 
  startResearch, launchCampaign, acceptContract, raiseFunding, 
  buybackShares, hostEarningsCall,
  takeLoan, repayLoan, upgradeOffice, launchIPO, resolveEvent, 
  buyoutCompetitor, sabotageCompetitor, normalizeLegacyState
} from './game/engine';
import { playAlertSound, playSuccessSound, playGameOverSound } from './game/audio';

import { TitleScreen } from './components/TitleScreen';
import { TopBar } from './components/TopBar';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { OverviewTab } from './components/tabs/OverviewTab';
import { ProductsTab } from './components/tabs/ProductsTab';
import { StaffTab } from './components/tabs/StaffTab';
import { MarketingTab } from './components/tabs/MarketingTab';
import { FinanceTab } from './components/tabs/FinanceTab';
import { RivalsTab } from './components/tabs/RivalsTab';

import { EventModal } from './components/modals/EventModal';
import { CreateProductModal } from './components/modals/CreateProductModal';
import { GameOverModal } from './components/modals/GameOverModal';
import { AchievementsModal } from './components/modals/AchievementsModal';

const SAVE_STORAGE_KEY = 'founder_forge_company_save_v1';

export default function App() {
  const [gameState, setGameState] = useState<CompanyState | null>(null);
  const [screen, setScreen] = useState<'title' | 'playing'>('title');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  
  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [savedRun, setSavedRun] = useState<CompanyState | null>(null);

  // Auto-play timer ref
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state to body dataset for Ultra Mode verification
  useEffect(() => {
    if (screen === 'title') {
      document.body.dataset.state = 'title';
    } else if (gameState?.isGameOver) {
      document.body.dataset.state = 'gameover';
    } else {
      document.body.dataset.state = 'playing';
    }
  }, [screen, gameState?.isGameOver]);

  // Load saved game from localStorage on boot & check ?autostart=1
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_STORAGE_KEY);
      if (raw) {
        const parsed = normalizeLegacyState(JSON.parse(raw));
        setSavedRun(parsed);
      }
    } catch {
      // Safe fallback
    }

    // Check autostart query param
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      const initial = createInitialCompany({
        companyName: 'NovaSynthetix',
        founderName: 'Alex Mercer',
        founderTrait: 'code_wizard',
        industry: 'saas',
      });
      setGameState(initial);
      setScreen('playing');
    }
  }, []);

  // Save game progress helper
  const handleSaveGame = () => {
    if (!gameState) return;
    try {
      localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(gameState));
      setSavedRun(gameState);
    } catch {
      // Storage safe catch
    }
  };

  // Start new company game
  const handleStartGame = (params: {
    companyName: string;
    founderName: string;
    founderTrait: FounderTrait;
    industry: IndustryType;
  }) => {
    const initial = createInitialCompany(params);
    setGameState(initial);
    setScreen('playing');
    try {
      localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(initial));
      setSavedRun(initial);
    } catch {
      // ignore
    }
  };

  // Resume saved game
  const handleLoadSavedGame = () => {
    if (!savedRun) return;
    setGameState(normalizeLegacyState(savedRun));
    setScreen('playing');
  };

  // Advance week turn
  const handleAdvanceWeek = () => {
    if (!gameState || gameState.isGameOver) return;
    
    setGameState((prev) => {
      if (!prev) return prev;
      const next = advanceWeek(prev);

      // Sound alerts
      if (next.pendingEvent && !prev.pendingEvent) {
        playAlertSound(next.settings.soundEnabled);
        setIsEventModalOpen(true);
      }

      if (next.isGameOver) {
        playGameOverSound(next.settings.soundEnabled);
      }

      // Check for newly unlocked achievements
      const prevAchUnlocked = prev.achievements.filter(a => a.unlocked).length;
      const nextAchUnlocked = next.achievements.filter(a => a.unlocked).length;
      if (nextAchUnlocked > prevAchUnlocked) {
        playSuccessSound(next.settings.soundEnabled);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      }

      return next;
    });
  };

  // Keyboard shortcut listener: Space advances week, Escape closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' && screen === 'playing' && !isEventModalOpen && !isCreateProductOpen && !isAchievementsOpen) {
        e.preventDefault();
        handleAdvanceWeek();
      }
      if (e.key === 'Escape') {
        setIsCreateProductOpen(false);
        setIsAchievementsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, isEventModalOpen, isCreateProductOpen, isAchievementsOpen, gameState]);

  // Auto-play timer effect
  useEffect(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    if (
      screen === 'playing' && 
      gameState && 
      !gameState.isGameOver && 
      !isEventModalOpen && 
      gameState.settings.autoPlaySpeed !== 'pause'
    ) {
      const intervalMs = gameState.settings.autoPlaySpeed === 'fast' ? 1200 : 2500;
      autoPlayTimerRef.current = setInterval(() => {
        handleAdvanceWeek();
      }, intervalMs);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [screen, gameState?.settings.autoPlaySpeed, gameState?.isGameOver, isEventModalOpen]);

  // Executive quick action
  const handleQuickAction = (actionType: 'pizza_party' | 'hackathon' | 'security_audit') => {
    if (!gameState) return;
    setGameState((prev) => {
      if (!prev) return prev;
      const state: CompanyState = JSON.parse(JSON.stringify(prev));

      if (actionType === 'pizza_party') {
        if (state.cash < 1500) return prev;
        state.cash -= 1500;
        for (const emp of state.staff) {
          emp.morale = Math.min(100, emp.morale + 15);
        }
        state.logs.unshift({
          id: 'log_pizza_' + Date.now(),
          week: state.week,
          type: 'success',
          message: '🍕 Hosted company pizza feast! Staff morale surged across all desks.',
        });
      } else if (actionType === 'hackathon') {
        if (state.cash < 4000) return prev;
        state.cash -= 4000;
        for (const p of state.products) {
          if (p.status === 'development') {
            p.developmentProgress = Math.min(100, p.developmentProgress + 25);
          }
        }
        state.logs.unshift({
          id: 'log_hack_' + Date.now(),
          week: state.week,
          type: 'success',
          message: '⚡ 48-Hour Hackathon complete! High-velocity sprint pushed product progress.',
        });
      } else if (actionType === 'security_audit') {
        if (state.cash < 5000) return prev;
        state.cash -= 5000;
        for (const p of state.products) {
          p.bugsCount = Math.max(0, p.bugsCount - 8);
          p.features.security = Math.min(99, p.features.security + 5);
        }
        state.logs.unshift({
          id: 'log_audit_' + Date.now(),
          week: state.week,
          type: 'success',
          message: '🛡️ Third-party penetration audit squashed vulnerabilities.',
        });
      }

      return state;
    });
  };

  // TopBar toggles
  const handleToggleSound = () => {
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          soundEnabled: !prev.settings.soundEnabled,
        },
      };
    });
  };

  const handleToggleAutoSpeed = (speed: 'pause' | 'normal' | 'fast') => {
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          autoPlaySpeed: speed,
        },
      };
    });
  };

  // Render Title Screen
  if (screen === 'title' || !gameState) {
    return (
      <TitleScreen
        onStartGame={handleStartGame}
        savedState={savedRun}
        onLoadSavedGame={handleLoadSavedGame}
        soundEnabled={gameState?.settings.soundEnabled ?? true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Mobile Device Frame Container */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-slate-950 border-x border-slate-800/80 shadow-2xl relative">
        
        {/* Top HUD */}
        <TopBar
          state={gameState}
          onAdvanceWeek={handleAdvanceWeek}
          onToggleSound={handleToggleSound}
          onToggleAutoSpeed={handleToggleAutoSpeed}
          onSaveGame={handleSaveGame}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
        />

        {/* Scrollable Tab Area */}
        <main className="flex-1 p-3.5 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewTab
              state={gameState}
              onOpenEventModal={() => setIsEventModalOpen(true)}
              onQuickAction={handleQuickAction}
              onHostEarningsCall={(strategy) => setGameState(prev => prev ? hostEarningsCall(prev, strategy) : prev)}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              state={gameState}
              onOpenCreateProduct={() => setIsCreateProductOpen(true)}
              onFixBugs={(id) => setGameState(prev => prev ? fixBugs(prev, id) : prev)}
              onScaleServers={(id) => {
                setGameState(prev => {
                  if (!prev || prev.cash < 8000) return prev;
                  const next: CompanyState = JSON.parse(JSON.stringify(prev));
                  const prod = next.products.find(p => p.id === id);
                  if (prod) {
                    next.cash -= 8000;
                    prod.features.serverCapacity += 10000;
                    next.logs.unshift({
                      id: 'log_scale_' + Date.now(),
                      week: next.week,
                      type: 'success',
                      message: `Expanded cloud server fleet for ${prod.name} (+10,000 capacity).`,
                    });
                  }
                  return next;
                });
              }}
              onSunsetProduct={(id) => setGameState(prev => prev ? deprecateProduct(prev, id) : prev)}
            />
          )}

          {activeTab === 'staff' && (
            <StaffTab
              state={gameState}
              onHireCandidate={(candId) => setGameState(prev => prev ? hireEmployee(prev, candId) : prev)}
              onFireEmployee={(empId) => setGameState(prev => prev ? fireEmployee(prev, empId) : prev)}
              onGiveRaise={(empId, pct) => setGameState(prev => prev ? giveRaise(prev, empId, pct) : prev)}
              onGiveBonus={(empId, amount) => setGameState(prev => prev ? giveBonus(prev, empId, amount) : prev)}
              onTrainEmployee={(empId) => setGameState(prev => prev ? trainEmployee(prev, empId) : prev)}
              onToggleOfficePerk={(perkId) => setGameState(prev => prev ? toggleOfficePerk(prev, perkId) : prev)}
              onUpgradeOffice={() => setGameState(prev => prev ? upgradeOffice(prev) : prev)}
            />
          )}

          {activeTab === 'marketing' && (
            <MarketingTab
              state={gameState}
              onLaunchCampaign={(channel, cost) => setGameState(prev => prev ? launchCampaign(prev, channel, cost) : prev)}
              onAcceptContract={(contractId) => setGameState(prev => prev ? acceptContract(prev, contractId) : prev)}
              onUnlockRegion={(regionId) => {
                setGameState(prev => prev ? unlockRegion(prev, regionId) : prev);
                confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
              }}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceTab
              state={gameState}
              onRaiseFunding={(round, eq, val) => {
                setGameState(prev => prev ? raiseFunding(prev, round, eq, val) : prev);
                confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
              }}
              onBuybackShares={(eq) => setGameState(prev => prev ? buybackShares(prev, eq) : prev)}
              onTakeLoan={(amount) => setGameState(prev => prev ? takeLoan(prev, amount) : prev)}
              onRepayLoan={(amount) => setGameState(prev => prev ? repayLoan(prev, amount) : prev)}
              onLaunchIPO={() => {
                setGameState(prev => prev ? launchIPO(prev) : prev);
                confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
              }}
            />
          )}

          {activeTab === 'market' && (
            <RivalsTab
              state={gameState}
              onStartResearch={(techId) => setGameState(prev => prev ? startResearch(prev, techId) : prev)}
              onBuyoutCompetitor={(compId) => {
                setGameState(prev => prev ? buyoutCompetitor(prev, compId) : prev);
                confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
              }}
              onSabotageCompetitor={(compId, op) => setGameState(prev => prev ? sabotageCompetitor(prev, compId, op) : prev)}
            />
          )}
        </main>

        {/* Bottom Thumb Navigation */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingEventCount={gameState.pendingEvent ? 1 : 0}
          soundEnabled={gameState.settings.soundEnabled}
        />

        {/* Narrative Dilemma Modal */}
        {isEventModalOpen && gameState.pendingEvent && (
          <EventModal
            event={gameState.pendingEvent}
            onSelectChoice={(choiceIdx) => {
              setGameState(prev => prev ? resolveEvent(prev, choiceIdx) : prev);
              setIsEventModalOpen(false);
            }}
            onClose={() => setIsEventModalOpen(false)}
            soundEnabled={gameState.settings.soundEnabled}
          />
        )}

        {/* New Product Modal */}
        {isCreateProductOpen && (
          <CreateProductModal
            state={gameState}
            onClose={() => setIsCreateProductOpen(false)}
            onCreateProduct={(params) => {
              setGameState(prev => prev ? createProduct(prev, params) : prev);
            }}
          />
        )}

        {/* Achievements Hall of Fame Modal */}
        {isAchievementsOpen && (
          <AchievementsModal
            state={gameState}
            onClose={() => setIsAchievementsOpen(false)}
          />
        )}

        {/* Game Over / Victory Modal */}
        {gameState.isGameOver && (
          <GameOverModal
            state={gameState}
            onRestart={() => {
              setScreen('title');
              setGameState(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
