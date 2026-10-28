export type IndustryType = 'saas' | 'ai' | 'hardware' | 'gaming' | 'biotech' | 'ecommerce';

export type FounderTrait = 
  | 'code_wizard'      // +25% R&D tech output
  | 'sales_shark'      // +30% contract margins & sales speed
  | 'venture_prodigy'  // +$150,000 starting capital & better VC valuations
  | 'growth_hacker'    // -35% marketing CAC
  | 'design_visionary' // +20% product quality & customer retention
  | 'workaholic';      // +10 company productivity, but morale depletes faster

export interface IndustryConfig {
  id: IndustryType;
  name: string;
  badge: string;
  description: string;
  marginMultiplier: number;
  rdCostMultiplier: number;
  volatility: number;
  starterProduct: {
    name: string;
    description: string;
    type: string;
  };
}

export type StaffRole = 
  | 'engineer' 
  | 'designer' 
  | 'marketer' 
  | 'sales_rep' 
  | 'qa_tester' 
  | 'executive';

export interface Employee {
  id: string;
  name: string;
  role: StaffRole;
  avatarSeed: string;
  skill: number; // 20 - 99
  salaryPerWeek: number;
  morale: number; // 0 - 100
  energy: number; // 0 - 100
  trait: string;
  traitDescription: string;
}

export interface Candidate extends Employee {
  signingBonus: number;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'development' | 'live' | 'deprecated';
  developmentProgress: number; // 0 - 100
  features: {
    techQuality: number; // 1 - 100
    userExperience: number; // 1 - 100
    security: number; // 1 - 100
    serverCapacity: number; // Max users supported
  };
  pricingModel: 'freemium' | 'subscription' | 'enterprise' | 'onetime';
  pricePerUserPerMonth: number;
  activeUsers: number;
  churnRate: number; // 0.01 - 0.20
  bugsCount: number;
  weeklyRevenue: number;
  totalRevenue: number;
  satisfactionScore: number; // 0 - 100
  createdWeek: number;
}

export interface TechNode {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  description: string;
  cost: number;
  requiredDevHours: number;
  requires: string[];
  effects: {
    rdSpeedBonus?: number;
    churnReduction?: number;
    qualityBonus?: number;
    serverCostReduction?: number;
    viralMultiplier?: number;
    revenueMultiplier?: number;
  };
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: 'social_ads' | 'influencer' | 'seo_content' | 'superbowl' | 'cold_calling' | 'pr_stunt';
  weeklyCost: number;
  targetIndustry: string;
  efficiency: number; // users per $1 spent
  weeksRemaining: number;
}

export interface ContractDeal {
  id: string;
  clientName: string;
  scopeDescription: string;
  payout: number;
  requiredEngineeringSkill: number;
  weeksToComplete: number;
  weeksRemaining: number;
  penaltyOnFailure: number;
  progress: number; // 0 - 100
}

export interface Competitor {
  id: string;
  name: string;
  ceoName: string;
  marketShare: number; // percentage
  valuation: number;
  health: 'surging' | 'stable' | 'struggling' | 'bankrupt' | 'acquired';
  headline: string;
  productCount: number;
  buyoutCost: number;
}

export interface GameEventChoice {
  text: string;
  description: string;
  effects: {
    cashDelta?: number;
    reputationDelta?: number;
    moraleDelta?: number;
    userChurnDelta?: number;
    valuationDelta?: number;
    riskOfBackfire?: number; // 0-1 probability
    backfireMessage?: string;
  };
}

export interface GameEvent {
  id: string;
  title: string;
  category: 'crisis' | 'opportunity' | 'media' | 'personnel' | 'market';
  description: string;
  choices: GameEventChoice[];
}

export interface GameLog {
  id: string;
  week: number;
  type: 'info' | 'success' | 'warning' | 'danger';
  message: string;
}

export interface WeeklyFinancialSnapshot {
  week: number;
  revenue: number;
  expenses: {
    payroll: number;
    servers: number;
    marketing: number;
    office: number;
    loanInterest: number;
    taxes: number;
  };
  netIncome: number;
  cash: number;
  valuation: number;
}

export interface OfficeTier {
  level: number;
  name: string;
  maxStaff: number;
  weeklyRent: number;
  moraleBonus: number;
  upgradeCost: number;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedWeek?: number;
}

export interface CompanyState {
  companyName: string;
  founderName: string;
  founderTrait: FounderTrait;
  industry: IndustryType;
  
  week: number; // Current week of simulation
  cash: number;
  debt: number;
  valuation: number;
  reputation: number; // 0 - 100
  brandAwareness: number; // 0 - 100
  
  equityFounder: number; // 0 - 100%
  sharesTotal: number;
  sharePrice: number;
  isPublic: boolean;
  
  officeLevel: number;
  products: Product[];
  staff: Employee[];
  candidatePool: Candidate[];
  
  unlockedTechIds: string[];
  activeResearch: {
    techId: string;
    progressHours: number;
    targetHours: number;
  } | null;
  
  activeCampaigns: MarketingCampaign[];
  availableContracts: ContractDeal[];
  activeContracts: ContractDeal[];
  
  competitors: Competitor[];
  pendingEvent: GameEvent | null;
  logs: GameLog[];
  financialHistory: WeeklyFinancialSnapshot[];
  achievements: Achievement[];
  
  settings: {
    soundEnabled: boolean;
    autoPlaySpeed: 'pause' | 'normal' | 'fast';
    theme: 'modern_dark' | 'retro_terminal' | 'wall_street' | 'cyberpunk';
  };
  
  isGameOver: boolean;
  gameOverReason: string | null;
  isVictory: boolean;
}
