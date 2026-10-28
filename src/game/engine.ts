import { 
  CompanyState, 
  IndustryType, 
  FounderTrait, 
  Candidate, 
  ContractDeal, 
  StaffRole, 
  Product, 
  WeeklyFinancialSnapshot, 
  GameLog, 
  MarketingCampaign 
} from './types';
import { INDUSTRIES, FOUNDER_TRAITS, OFFICE_TIERS, CANDIDATE_NAMES, STAFF_TRAITS } from './constants';
import { TECH_TREE } from './techTree';
import { INITIAL_COMPETITORS } from './competitors';
import { INITIAL_ACHIEVEMENTS } from './achievements';
import { GAME_EVENTS } from './events';

export function createInitialCompany(options: {
  companyName: string;
  founderName: string;
  founderTrait: FounderTrait;
  industry: IndustryType;
}): CompanyState {
  const { companyName, founderName, founderTrait, industry } = options;
  const industryCfg = INDUSTRIES[industry];

  // Starting capital: Base $100k, extra if venture prodigy
  const startingCash = founderTrait === 'venture_prodigy' ? 250000 : 100000;
  const initialValuation = founderTrait === 'venture_prodigy' ? 1200000 : 750000;

  // Initial starter product in development
  const starterProduct: Product = {
    id: 'prod_' + Math.random().toString(36).substring(2, 9),
    name: industryCfg.starterProduct.name,
    type: industryCfg.starterProduct.type,
    description: industryCfg.starterProduct.description,
    status: 'development',
    developmentProgress: 45, // Started already
    features: {
      techQuality: 65,
      userExperience: 60,
      security: 70,
      serverCapacity: 5000,
    },
    pricingModel: industry === 'gaming' ? 'freemium' : 'subscription',
    pricePerUserPerMonth: industry === 'gaming' ? 4 : industry === 'saas' ? 39 : 19,
    activeUsers: 0,
    churnRate: 0.05,
    bugsCount: 4,
    weeklyRevenue: 0,
    totalRevenue: 0,
    satisfactionScore: 78,
    createdWeek: 1,
  };

  // 1 Founding employee (co-founder / senior engineer)
  const foundingEmployee: Candidate = {
    id: 'emp_founding',
    name: 'Morgan Vance',
    role: 'engineer',
    avatarSeed: 'morgan',
    skill: 72,
    salaryPerWeek: 1400,
    morale: 95,
    energy: 95,
    trait: '10x Coder',
    traitDescription: 'High engineering output and clean system architecture.',
    signingBonus: 0,
  };

  const initialCandidates: Candidate[] = [
    generateCandidate('engineer', 1),
    generateCandidate('marketer', 1),
    generateCandidate('designer', 1),
  ];

  const initialContracts: ContractDeal[] = [
    generateContract(industry, 1),
    generateContract(industry, 1),
  ];

  const initialCompetitors = JSON.parse(JSON.stringify(INITIAL_COMPETITORS[industry]));
  const initialAchievements = JSON.parse(JSON.stringify(INITIAL_ACHIEVEMENTS));

  const state: CompanyState = {
    companyName: companyName.trim() || 'NovaForge Inc.',
    founderName: founderName.trim() || 'Alex Mercer',
    founderTrait,
    industry,
    week: 1,
    cash: startingCash,
    debt: 0,
    valuation: initialValuation,
    reputation: 60,
    brandAwareness: 25,
    equityFounder: 100,
    sharesTotal: 1000000,
    sharePrice: initialValuation / 1000000,
    isPublic: false,
    officeLevel: 0, // Garage
    products: [starterProduct],
    staff: [foundingEmployee],
    candidatePool: initialCandidates,
    unlockedTechIds: [],
    activeResearch: null,
    activeCampaigns: [],
    availableContracts: initialContracts,
    activeContracts: [],
    competitors: initialCompetitors,
    pendingEvent: null,
    logs: [
      {
        id: 'log_start',
        week: 1,
        type: 'info',
        message: `Welcome to ${companyName}! You have begun your entrepreneurial journey with $${startingCash.toLocaleString()} in the Suburban Garage.`,
      },
    ],
    financialHistory: [],
    achievements: initialAchievements,
    settings: {
      soundEnabled: true,
      autoPlaySpeed: 'pause',
      theme: 'modern_dark',
    },
    isGameOver: false,
    gameOverReason: null,
    isVictory: false,
  };

  return state;
}

export function generateCandidate(specificRole?: StaffRole, week: number = 1): Candidate {
  const roles: StaffRole[] = ['engineer', 'designer', 'marketer', 'sales_rep', 'qa_tester'];
  const role = specificRole || roles[Math.floor(Math.random() * roles.length)];
  
  const fNames = CANDIDATE_NAMES.first;
  const lNames = CANDIDATE_NAMES.last;
  const name = `${fNames[Math.floor(Math.random() * fNames.length)]} ${lNames[Math.floor(Math.random() * lNames.length)]}`;
  
  // Skill scales with progression (40 to 95)
  const baseSkill = 40 + Math.min(45, Math.floor(Math.random() * 35) + Math.floor(week / 10) * 3);
  const skill = Math.min(98, baseSkill);
  
  // Weekly salary: $800 - $3500 depending on skill
  const salaryPerWeek = Math.round((skill * 30 + Math.random() * 400) / 50) * 50;
  const signingBonus = Math.round((salaryPerWeek * (1.5 + Math.random() * 2)) / 100) * 100;
  
  const traitObj = STAFF_TRAITS[Math.floor(Math.random() * STAFF_TRAITS.length)];

  return {
    id: 'cand_' + Math.random().toString(36).substring(2, 9),
    name,
    role,
    avatarSeed: name.toLowerCase().replace(/\s+/g, '_'),
    skill,
    salaryPerWeek,
    morale: 80 + Math.floor(Math.random() * 18),
    energy: 90,
    trait: traitObj.name,
    traitDescription: traitObj.desc,
    signingBonus,
  };
}

export function generateContract(industry: IndustryType, week: number = 1): ContractDeal {
  const clients = [
    'Acrobatix Global', 'Vanguard Data Systems', 'Nexus Healthcare', 
    'Quantum Retail Partners', 'Cyberdyne Media', 'AeroFleet Defense',
    'Apex Horizon Group', 'OmniGlobal Bank', 'Titan Micro Logistics'
  ];
  const clientName = clients[Math.floor(Math.random() * clients.length)];
  
  const mult = 1 + Math.floor(week / 8) * 0.4;
  const basePayout = Math.round((25000 + Math.random() * 50000) * mult / 1000) * 1000;
  const weeksToComplete = Math.floor(Math.random() * 3) + 3; // 3 - 5 weeks
  const reqSkill = Math.min(90, 50 + Math.floor(Math.random() * 30));

  return {
    id: 'cont_' + Math.random().toString(36).substring(2, 9),
    clientName,
    scopeDescription: `Enterprise milestone delivery for ${clientName}. Requires dedicated engineering throughput.`,
    payout: basePayout,
    requiredEngineeringSkill: reqSkill,
    weeksToComplete,
    weeksRemaining: weeksToComplete,
    penaltyOnFailure: Math.round(basePayout * 0.3),
    progress: 0,
  };
}

export function advanceWeek(prevState: CompanyState): CompanyState {
  if (prevState.isGameOver) return prevState;

  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const week = state.week + 1;
  state.week = week;

  const logs: GameLog[] = [];

  // 1. Tech Tree bonus calculations
  let rdSpeedBonus = 0;
  let churnReduction = 0;
  let qualityBonus = 0;
  let serverCostReduction = 0;
  let viralMultiplier = 1.0;
  let revenueMultiplier = 1.0;

  for (const techId of state.unlockedTechIds) {
    const node = TECH_TREE.find(t => t.id === techId);
    if (node) {
      if (node.effects.rdSpeedBonus) rdSpeedBonus += node.effects.rdSpeedBonus;
      if (node.effects.churnReduction) churnReduction += node.effects.churnReduction;
      if (node.effects.qualityBonus) qualityBonus += node.effects.qualityBonus;
      if (node.effects.serverCostReduction) serverCostReduction += node.effects.serverCostReduction;
      if (node.effects.viralMultiplier) viralMultiplier += node.effects.viralMultiplier;
      if (node.effects.revenueMultiplier) revenueMultiplier += node.effects.revenueMultiplier;
    }
  }

  if (state.founderTrait === 'code_wizard') rdSpeedBonus += 0.25;
  if (state.founderTrait === 'growth_hacker') viralMultiplier += 0.35;
  if (state.founderTrait === 'design_visionary') {
    qualityBonus += 15;
    churnReduction += 0.03;
  }

  // 2. Staff Work & Output
  let totalEngineeringSkill = 0;
  let totalDesignSkill = 0;
  let totalMarketingSkill = 0;
  let totalSalesSkill = 0;
  let totalQASkill = 0;

  const office = OFFICE_TIERS[state.officeLevel] || OFFICE_TIERS[0];
  const officeMoraleMod = office.moraleBonus;

  for (const emp of state.staff) {
    // Morale drift towards office base
    let targetMorale = 80 + officeMoraleMod;
    if (emp.trait === 'Morale Booster') targetMorale += 10;
    emp.morale = Math.max(10, Math.min(100, Math.round(emp.morale * 0.95 + targetMorale * 0.05)));

    const effectiveSkill = (emp.skill * (emp.morale / 100)) * (emp.trait === '10x Coder' ? 1.5 : 1.0);

    if (emp.role === 'engineer') totalEngineeringSkill += effectiveSkill;
    else if (emp.role === 'designer') totalDesignSkill += effectiveSkill;
    else if (emp.role === 'marketer') totalMarketingSkill += effectiveSkill;
    else if (emp.role === 'sales_rep') totalSalesSkill += effectiveSkill;
    else if (emp.role === 'qa_tester') totalQASkill += effectiveSkill;
    else if (emp.role === 'executive') {
      totalEngineeringSkill += effectiveSkill * 0.3;
      totalSalesSkill += effectiveSkill * 0.3;
      totalMarketingSkill += effectiveSkill * 0.3;
    }
  }

  // 3. Products Progress & Revenue
  let weeklyProductRevenue = 0;
  let serverTotalCost = 0;

  for (const prod of state.products) {
    if (prod.status === 'development') {
      // Advance development
      const devSpeed = Math.max(8, (totalEngineeringSkill * 0.15 + 10) * (1 + rdSpeedBonus));
      prod.developmentProgress = Math.min(100, prod.developmentProgress + devSpeed);

      if (prod.developmentProgress >= 100) {
        prod.status = 'live';
        prod.activeUsers = 120 + Math.floor(Math.random() * 200);
        logs.push({
          id: 'log_prod_live_' + prod.id,
          week,
          type: 'success',
          message: `🚀 ${prod.name} has completed development and is now LIVE in the market!`,
        });
      }
    } else if (prod.status === 'live') {
      // Fix bugs via QA
      const bugsFixed = Math.floor(totalQASkill * 0.08) + 1;
      prod.bugsCount = Math.max(0, prod.bugsCount - bugsFixed);

      // Random new bugs if QA is low
      if (Math.random() < 0.3 && totalQASkill < 40) {
        prod.bugsCount += Math.floor(Math.random() * 2) + 1;
      }

      // Calculate churn based on bugs, satisfaction & quality
      const baseChurn = prod.churnRate;
      const bugPenalty = Math.min(0.15, prod.bugsCount * 0.015);
      const effectiveChurn = Math.max(0.01, (baseChurn + bugPenalty - churnReduction));

      // Calculate organic growth
      const viralRate = (0.04 + (totalMarketingSkill * 0.001) + (state.brandAwareness * 0.001)) * viralMultiplier;
      const lostUsers = Math.round(prod.activeUsers * effectiveChurn);
      const gainedUsers = Math.round(Math.max(5, prod.activeUsers * viralRate) + (totalMarketingSkill * 1.5));

      prod.activeUsers = Math.max(10, prod.activeUsers - lostUsers + gainedUsers);

      // Revenue: Price per user / 4 (since 4 weeks per month)
      const weeklyRate = prod.pricePerUserPerMonth / 4;
      const baseRev = prod.activeUsers * weeklyRate * revenueMultiplier * INDUSTRIES[state.industry].marginMultiplier;
      const prodRev = Math.round(baseRev);

      prod.weeklyRevenue = prodRev;
      prod.totalRevenue += prodRev;
      weeklyProductRevenue += prodRev;

      // Server hosting costs
      let prodServerCost = Math.round((prod.activeUsers * 0.12) * (1 - serverCostReduction));
      // Over-capacity penalty if users exceed capacity
      if (prod.activeUsers > prod.features.serverCapacity) {
        const excess = prod.activeUsers - prod.features.serverCapacity;
        prodServerCost += Math.round(excess * 0.35);
        prod.satisfactionScore = Math.max(20, prod.satisfactionScore - 3);
        if (Math.random() < 0.25) {
          logs.push({
            id: 'log_server_lag_' + prod.id + '_' + week,
            week,
            type: 'warning',
            message: `⚠️ Server bottleneck on ${prod.name}: Users are reporting latency spikes! Upgrade server capacity.`,
          });
        }
      } else {
        prod.satisfactionScore = Math.min(99, prod.satisfactionScore + 1);
      }
      serverTotalCost += prodServerCost;
    }
  }

  // 4. Marketing Campaigns Progress
  let marketingWeeklySpend = 0;
  const activeCampaigns: MarketingCampaign[] = [];

  for (const camp of state.activeCampaigns) {
    marketingWeeklySpend += camp.weeklyCost;
    camp.weeksRemaining -= 1;

    // Bring in extra users to highest live product
    const liveProd = state.products.find(p => p.status === 'live');
    if (liveProd) {
      const addedUsers = Math.round((camp.weeklyCost * camp.efficiency) * (1 + viralMultiplier * 0.2));
      liveProd.activeUsers += addedUsers;
      state.brandAwareness = Math.min(100, state.brandAwareness + Math.round(camp.weeklyCost / 5000));
    }

    if (camp.weeksRemaining > 0) {
      activeCampaigns.push(camp);
    } else {
      logs.push({
        id: 'log_camp_end_' + camp.id,
        week,
        type: 'info',
        message: `📢 Marketing campaign "${camp.name}" has concluded.`,
      });
    }
  }
  state.activeCampaigns = activeCampaigns;

  // 5. Contracts Progress
  let contractRevenueThisWeek = 0;
  const remainingContracts: ContractDeal[] = [];

  for (const contract of state.activeContracts) {
    contract.weeksRemaining -= 1;
    // Engineering contribution
    const progAdd = Math.min(40, Math.max(15, (totalEngineeringSkill / contract.requiredEngineeringSkill) * 30));
    contract.progress = Math.min(100, contract.progress + progAdd);

    if (contract.progress >= 100) {
      // Completed successfully!
      const bonus = state.founderTrait === 'sales_shark' ? 1.3 : 1.0;
      const payout = Math.round(contract.payout * bonus);
      contractRevenueThisWeek += payout;
      state.reputation = Math.min(100, state.reputation + 4);
      logs.push({
        id: 'log_contract_done_' + contract.id,
        week,
        type: 'success',
        message: `🤝 Contract completed for ${contract.clientName}! Earned $${payout.toLocaleString()}.`,
      });
    } else if (contract.weeksRemaining <= 0) {
      // Failed deadline
      state.cash = Math.max(0, state.cash - contract.penaltyOnFailure);
      state.reputation = Math.max(10, state.reputation - 8);
      logs.push({
        id: 'log_contract_fail_' + contract.id,
        week,
        type: 'danger',
        message: `❌ Failed deadline on ${contract.clientName} contract. Paid penalty: $${contract.penaltyOnFailure.toLocaleString()}.`,
      });
    } else {
      remainingContracts.push(contract);
    }
  }
  state.activeContracts = remainingContracts;

  // 6. R&D Research Progress
  if (state.activeResearch) {
    const researchHoursAdded = Math.round((totalEngineeringSkill * 0.6 + 5) * (1 + rdSpeedBonus));
    state.activeResearch.progressHours += researchHoursAdded;

    if (state.activeResearch.progressHours >= state.activeResearch.targetHours) {
      const finishedTechId = state.activeResearch.techId;
      state.unlockedTechIds.push(finishedTechId);
      const finishedTech = TECH_TREE.find(t => t.id === finishedTechId);
      state.activeResearch = null;
      logs.push({
        id: 'log_tech_unlock_' + finishedTechId + '_' + week,
        week,
        type: 'success',
        message: `🔬 Research Breakthrough: "${finishedTech?.name}" has been unlocked!`,
      });
    }
  }

  // 7. Calculate Total Revenue & Expenses
  const totalRevenue = weeklyProductRevenue + contractRevenueThisWeek;

  let payrollTotal = 0;
  for (const emp of state.staff) {
    payrollTotal += emp.salaryPerWeek;
  }

  const officeRent = office.weeklyRent;
  const loanInterest = Math.round(state.debt * 0.004); // ~0.4% weekly interest (~20% APR)
  const taxableProfit = Math.max(0, totalRevenue - payrollTotal - serverTotalCost - marketingWeeklySpend - officeRent - loanInterest);
  const taxes = Math.round(taxableProfit * 0.15); // 15% corporate tax

  const totalExpenses = payrollTotal + serverTotalCost + marketingWeeklySpend + officeRent + loanInterest + taxes;
  const netIncome = totalRevenue - totalExpenses;

  state.cash += netIncome;

  // 8. Financial History Snapshot
  const snapshot: WeeklyFinancialSnapshot = {
    week,
    revenue: totalRevenue,
    expenses: {
      payroll: payrollTotal,
      servers: serverTotalCost,
      marketing: marketingWeeklySpend,
      office: officeRent,
      loanInterest,
      taxes,
    },
    netIncome,
    cash: state.cash,
    valuation: state.valuation,
  };

  // Keep last 24 weeks of history for sparklines & graphs
  state.financialHistory.push(snapshot);
  if (state.financialHistory.length > 36) {
    state.financialHistory.shift();
  }

  // 9. Update Valuation & Competitors
  const annualizedRevenue = totalRevenue * 52;
  const indMultiplier = INDUSTRIES[state.industry].marginMultiplier;
  const growthMultiplier = state.brandAwareness / 30 + 1.2;
  const calculatedValuation = Math.max(
    500000,
    Math.round((annualizedRevenue * (4 + indMultiplier) * growthMultiplier) + (state.cash * 1.5))
  );
  // Smooth valuation transitions
  state.valuation = Math.round(state.valuation * 0.85 + calculatedValuation * 0.15);

  // If public company, update share price based on netIncome and growth
  if (state.isPublic) {
    const marketMood = 1 + (Math.random() * 0.08 - 0.035);
    const earningsFactor = netIncome > 0 ? 1.02 : 0.97;
    state.sharePrice = Math.max(0.5, +(state.sharePrice * marketMood * earningsFactor).toFixed(2));
    state.valuation = Math.round(state.sharePrice * state.sharesTotal);
  }

  // Competitor evolution
  for (const comp of state.competitors) {
    if (comp.health !== 'bankrupt' && comp.health !== 'acquired') {
      const shift = Math.random() * 0.06 - 0.025;
      comp.valuation = Math.round(comp.valuation * (1 + shift));
      if (Math.random() < 0.1) {
        comp.headline = getRandomCompetitorHeadline(comp.name, comp.ceoName, state.industry);
      }
    }
  }

  // Replenish Candidate Pool & Contract Offers periodically
  if (week % 3 === 0) {
    state.candidatePool = [
      generateCandidate(undefined, week),
      generateCandidate(undefined, week),
      generateCandidate(undefined, week),
    ];
  }
  if (week % 4 === 0 && state.availableContracts.length < 3) {
    state.availableContracts.push(generateContract(state.industry, week));
  }

  // 10. Random Narrative Event Trigger (every 4-7 weeks if none pending)
  if (!state.pendingEvent && week > 2 && Math.random() < 0.28) {
    const randomEvt = GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)];
    state.pendingEvent = JSON.parse(JSON.stringify(randomEvt));
    logs.push({
      id: 'log_event_trigger_' + week,
      week,
      type: 'warning',
      message: `🔔 New Decision Required: "${randomEvt.title}"`,
    });
  }

  // 11. Check Achievements
  for (const ach of state.achievements) {
    if (!ach.unlocked) {
      let shouldUnlock = false;
      if (ach.id === 'first_revenue' && totalRevenue > 0) shouldUnlock = true;
      if (ach.id === 'hire_first' && state.staff.length >= 2) shouldUnlock = true;
      if (ach.id === 'first_product_live' && state.products.some(p => p.status === 'live')) shouldUnlock = true;
      if (ach.id === 'ramen_profitable' && netIncome > 0 && totalRevenue > 2000) shouldUnlock = true;
      if (ach.id === 'upgrade_office' && state.officeLevel >= 1) shouldUnlock = true;
      if (ach.id === 'ten_k_users' && state.products.reduce((acc, p) => acc + p.activeUsers, 0) >= 10000) shouldUnlock = true;
      if (ach.id === 'series_a' && state.valuation >= 5000000) shouldUnlock = true;
      if (ach.id === 'tech_pioneer' && state.unlockedTechIds.length >= 5) shouldUnlock = true;
      if (ach.id === 'one_hundred_k_revenue' && totalRevenue >= 50000) shouldUnlock = true;
      if (ach.id === 'unicorn_status' && state.valuation >= 1000000000) shouldUnlock = true;
      if (ach.id === 'ring_the_bell' && state.isPublic) shouldUnlock = true;
      if (ach.id === 'centurion' && week >= 104) shouldUnlock = true;

      if (shouldUnlock) {
        ach.unlocked = true;
        ach.unlockedWeek = week;
        logs.push({
          id: 'log_ach_' + ach.id,
          week,
          type: 'success',
          message: `🏆 Achievement Unlocked: ${ach.icon} ${ach.title}!`,
        });
      }
    }
  }

  // 12. Check Bankruptcy Condition
  // If cash drops below -$20,000 and debt is high or cannot pay salaries
  if (state.cash < -25000) {
    state.isGameOver = true;
    state.gameOverReason = 'Insolvency Bankruptcy: Your corporate accounts were frozen by creditors due to severe negative cash balance.';
    logs.push({
      id: 'log_game_over_' + week,
      week,
      type: 'danger',
      message: '💀 GAME OVER: The company has run out of funds and filed for Chapter 7 liquidation.',
    });
  }

  // Append logs
  state.logs = [...logs, ...state.logs].slice(0, 50);

  return state;
}

export function hireEmployee(prevState: CompanyState, candidateId: string): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const candidateIndex = state.candidatePool.findIndex(c => c.id === candidateId);
  if (candidateIndex === -1) return prevState;

  const candidate = state.candidatePool[candidateIndex];
  const office = OFFICE_TIERS[state.officeLevel];

  if (state.staff.length >= office.maxStaff) {
    return prevState; // Reached office limit
  }

  const cost = candidate.signingBonus;
  if (state.cash < cost) return prevState;

  state.cash -= cost;
  state.staff.push(candidate);
  state.candidatePool.splice(candidateIndex, 1);

  state.logs.unshift({
    id: 'log_hire_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'info',
    message: `Hired ${candidate.name} as a full-time ${candidate.role} ($${candidate.salaryPerWeek}/wk).`,
  });

  return state;
}

export function fireEmployee(prevState: CompanyState, employeeId: string): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const index = state.staff.findIndex(e => e.id === employeeId);
  if (index === -1) return prevState;

  const employee = state.staff[index];
  const severance = employee.salaryPerWeek * 2;
  state.cash -= severance;
  state.staff.splice(index, 1);

  // Slight team morale dip on termination
  for (const emp of state.staff) {
    emp.morale = Math.max(15, emp.morale - 4);
  }

  state.logs.unshift({
    id: 'log_fire_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'warning',
    message: `Parted ways with ${employee.name}. Paid 2-week severance ($${severance.toLocaleString()}).`,
  });

  return state;
}

export function giveRaise(prevState: CompanyState, employeeId: string, percentage: number): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const emp = state.staff.find(e => e.id === employeeId);
  if (!emp) return prevState;

  const bump = Math.round(emp.salaryPerWeek * (percentage / 100));
  emp.salaryPerWeek += bump;
  emp.morale = Math.min(100, emp.morale + 20);

  state.logs.unshift({
    id: 'log_raise_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'success',
    message: `Awarded ${percentage}% salary raise to ${emp.name}. Morale surged to ${emp.morale}%!`,
  });

  return state;
}

export function giveBonus(prevState: CompanyState, employeeId: string, amount: number): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  if (state.cash < amount) return prevState;

  const emp = state.staff.find(e => e.id === employeeId);
  if (!emp) return prevState;

  state.cash -= amount;
  emp.morale = Math.min(100, emp.morale + 30);

  state.logs.unshift({
    id: 'log_bonus_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'success',
    message: `Issued $${amount.toLocaleString()} spot performance bonus to ${emp.name}!`,
  });

  return state;
}

export function createProduct(
  prevState: CompanyState,
  params: {
    name: string;
    type: string;
    pricingModel: Product['pricingModel'];
    pricePerMonth: number;
    features: Product['features'];
  }
): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  
  const setupFee = 15000;
  if (state.cash < setupFee) return prevState;

  state.cash -= setupFee;

  const newProd: Product = {
    id: 'prod_' + Math.random().toString(36).substring(2, 9),
    name: params.name.trim() || 'NextGen Project',
    type: params.type || 'SaaS Application',
    description: `Targeting high-margin commercial growth in ${state.industry.toUpperCase()}.`,
    status: 'development',
    developmentProgress: 0,
    features: params.features,
    pricingModel: params.pricingModel,
    pricePerUserPerMonth: params.pricePerMonth,
    activeUsers: 0,
    churnRate: 0.04,
    bugsCount: 2,
    weeklyRevenue: 0,
    totalRevenue: 0,
    satisfactionScore: 82,
    createdWeek: state.week,
  };

  state.products.push(newProd);

  state.logs.unshift({
    id: 'log_newprod_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'info',
    message: `Initiated R&D sprint on new product: "${newProd.name}". Allocated engineering resources.`,
  });

  return state;
}

export function fixBugs(prevState: CompanyState, productId: string): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return prevState;

  const cost = 3000;
  if (state.cash < cost) return prevState;

  state.cash -= cost;
  prod.bugsCount = Math.max(0, prod.bugsCount - 5);
  prod.satisfactionScore = Math.min(100, prod.satisfactionScore + 6);

  state.logs.unshift({
    id: 'log_fixbugs_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'success',
    message: `Emergency QA sprint patched critical bugs on "${prod.name}". Satisfaction rose to ${prod.satisfactionScore}%.`,
  });

  return state;
}

export function deprecateProduct(prevState: CompanyState, productId: string): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return prevState;

  prod.status = 'deprecated';
  prod.activeUsers = 0;
  prod.weeklyRevenue = 0;

  state.logs.unshift({
    id: 'log_depr_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'warning',
    message: `Sunsetting product "${prod.name}". Redirecting all engineering capacity.`,
  });

  return state;
}

export function startResearch(prevState: CompanyState, techId: string): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const tech = TECH_TREE.find(t => t.id === techId);
  if (!tech) return prevState;

  if (state.unlockedTechIds.includes(techId)) return prevState;
  if (state.cash < tech.cost) return prevState;

  // Check prerequisites
  for (const req of tech.requires) {
    if (!state.unlockedTechIds.includes(req)) return prevState;
  }

  state.cash -= tech.cost;
  state.activeResearch = {
    techId,
    progressHours: 0,
    targetHours: tech.requiredDevHours,
  };

  state.logs.unshift({
    id: 'log_startres_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'info',
    message: `Began R&D project: "${tech.name}". Treasury committed: $${tech.cost.toLocaleString()}.`,
  });

  return state;
}

export function launchCampaign(
  prevState: CompanyState, 
  channel: MarketingCampaign['channel'], 
  weeklyCost: number
): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  if (state.cash < weeklyCost) return prevState;

  const efficiencies: Record<MarketingCampaign['channel'], { name: string; eff: number; weeks: number }> = {
    social_ads: { name: 'Paid Social Performance Ads', eff: 0.12, weeks: 4 },
    influencer: { name: 'Creator & Tech Podcast Sponsorship', eff: 0.18, weeks: 3 },
    seo_content: { name: 'High-Intent SEO Inbound Engine', eff: 0.08, weeks: 8 },
    superbowl: { name: 'Primetime TV & Billboard Blitz', eff: 0.25, weeks: 2 },
    cold_calling: { name: 'Outbound Enterprise B2B SDR Blitz', eff: 0.05, weeks: 6 },
    pr_stunt: { name: 'Viral Guerilla PR Stunt', eff: 0.22, weeks: 2 },
  };

  const info = efficiencies[channel];

  state.activeCampaigns.push({
    id: 'camp_' + Math.random().toString(36).substring(2, 9),
    name: info.name,
    channel,
    weeklyCost,
    targetIndustry: state.industry,
    efficiency: info.eff,
    weeksRemaining: info.weeks,
  });

  state.logs.unshift({
    id: 'log_camp_launch_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'info',
    message: `Launched campaign: "${info.name}" ($${weeklyCost.toLocaleString()}/wk for ${info.weeks} weeks).`,
  });

  return state;
}

export function acceptContract(prevState: CompanyState, contractId: string): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const idx = state.availableContracts.findIndex(c => c.id === contractId);
  if (idx === -1) return prevState;

  const contract = state.availableContracts[idx];
  state.availableContracts.splice(idx, 1);
  state.activeContracts.push(contract);

  state.logs.unshift({
    id: 'log_contract_accept_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'info',
    message: `Accepted enterprise contract for ${contract.clientName} (Payout: $${contract.payout.toLocaleString()}).`,
  });

  return state;
}

export function raiseFunding(
  prevState: CompanyState,
  roundName: string,
  equityPercent: number,
  valuation: number
): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  if (state.equityFounder < equityPercent) return prevState;

  const capitalRaised = Math.round(valuation * (equityPercent / 100));
  state.cash += capitalRaised;
  state.equityFounder -= equityPercent;
  state.valuation = Math.max(state.valuation, valuation);

  state.logs.unshift({
    id: 'log_funding_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'success',
    message: `🎉 Closed ${roundName}! Injected $${capitalRaised.toLocaleString()} for ${equityPercent}% equity at $${valuation.toLocaleString()} post-money valuation.`,
  });

  return state;
}

export function takeLoan(prevState: CompanyState, amount: number): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const maxLoan = Math.max(50000, Math.round(state.valuation * 0.3));
  if (state.debt + amount > maxLoan) return prevState;

  state.debt += amount;
  state.cash += amount;

  state.logs.unshift({
    id: 'log_loan_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'warning',
    message: `Secured $${amount.toLocaleString()} business credit line. Total debt: $${state.debt.toLocaleString()}.`,
  });

  return state;
}

export function repayLoan(prevState: CompanyState, amount: number): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const repayAmount = Math.min(amount, state.debt);
  if (state.cash < repayAmount) return prevState;

  state.cash -= repayAmount;
  state.debt -= repayAmount;

  state.logs.unshift({
    id: 'log_repay_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'info',
    message: `Repaid $${repayAmount.toLocaleString()} of debt balance. Remaining debt: $${state.debt.toLocaleString()}.`,
  });

  return state;
}

export function upgradeOffice(prevState: CompanyState): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const nextLevel = state.officeLevel + 1;
  const nextOffice = OFFICE_TIERS[nextLevel];
  if (!nextOffice) return prevState;

  if (state.cash < nextOffice.upgradeCost) return prevState;

  state.cash -= nextOffice.upgradeCost;
  state.officeLevel = nextLevel;

  // Boost team morale
  for (const emp of state.staff) {
    emp.morale = Math.min(100, emp.morale + 15);
  }

  state.logs.unshift({
    id: 'log_office_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'success',
    message: `🏢 Relocated company HQ to ${nextOffice.name}! Staff capacity expanded to ${nextOffice.maxStaff}.`,
  });

  return state;
}

export function launchIPO(prevState: CompanyState): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  if (state.isPublic) return prevState;
  if (state.valuation < 30000000) return prevState; // $30M min valuation to IPO

  state.isPublic = true;
  // Sell 20% of company to public markets
  const publicCash = Math.round(state.valuation * 0.2);
  state.cash += publicCash;
  state.equityFounder = Math.max(10, state.equityFounder - 20);
  state.sharePrice = +(state.valuation / state.sharesTotal).toFixed(2);

  state.logs.unshift({
    id: 'log_ipo_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'success',
    message: `🔔 BELL RINGS! Company went public on NASDAQ! Raised $${publicCash.toLocaleString()} at opening price of $${state.sharePrice}/share.`,
  });

  return state;
}

export function resolveEvent(prevState: CompanyState, choiceIndex: number): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const evt = state.pendingEvent;
  if (!evt) return prevState;

  const choice = evt.choices[choiceIndex];
  if (!choice) return prevState;

  let backfire = false;
  if (choice.effects.riskOfBackfire && Math.random() < choice.effects.riskOfBackfire) {
    backfire = true;
  }

  if (choice.effects.cashDelta) state.cash += choice.effects.cashDelta;
  if (choice.effects.reputationDelta) state.reputation = Math.max(0, Math.min(100, state.reputation + choice.effects.reputationDelta));
  if (choice.effects.valuationDelta) state.valuation = Math.max(100000, state.valuation + choice.effects.valuationDelta);

  if (choice.effects.moraleDelta) {
    for (const emp of state.staff) {
      emp.morale = Math.max(10, Math.min(100, emp.morale + choice.effects.moraleDelta));
    }
  }

  const logMsg = backfire && choice.effects.backfireMessage
    ? `⚠️ ${choice.effects.backfireMessage}`
    : `Decision resolved for "${evt.title}": ${choice.text}`;

  state.logs.unshift({
    id: 'log_event_res_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: backfire ? 'danger' : 'info',
    message: logMsg,
  });

  state.pendingEvent = null;
  return state;
}

export function buyoutCompetitor(prevState: CompanyState, competitorId: string): CompanyState {
  const state: CompanyState = JSON.parse(JSON.stringify(prevState));
  const comp = state.competitors.find(c => c.id === competitorId);
  if (!comp) return prevState;

  if (comp.health === 'acquired' || comp.health === 'bankrupt') return prevState;
  if (state.cash < comp.buyoutCost) return prevState;

  state.cash -= comp.buyoutCost;
  comp.health = 'acquired';
  state.reputation = Math.min(100, state.reputation + 15);
  state.brandAwareness = Math.min(100, state.brandAwareness + 20);
  state.valuation += Math.round(comp.valuation * 0.8);

  // Absorption of customers to first live product
  const live = state.products.find(p => p.status === 'live');
  if (live) {
    live.activeUsers += Math.round(comp.marketShare * 350);
  }

  state.logs.unshift({
    id: 'log_buyout_' + Math.random().toString(36).substring(2, 7),
    week: state.week,
    type: 'success',
    message: `🦈 M&A Deal Closed: Successfully acquired ${comp.name} for $${comp.buyoutCost.toLocaleString()}!`,
  });

  return state;
}

function getRandomCompetitorHeadline(compName: string, ceoName: string, industry: IndustryType): string {
  const headlines = [
    `${compName} CEO ${ceoName} hints at major product overhaul next quarter.`,
    `${compName} poached top engineering talent from rival labs.`,
    `Wall Street analysts upgrade ${compName} price target following revenue beat.`,
    `${compName} files key patent applications in ${industry.toUpperCase()} automation.`,
    `${compName} faces scrutiny over aggressive privacy terms.`,
    `Rumors circulate that ${compName} is in talks for private equity buyout.`,
  ];
  return headlines[Math.floor(Math.random() * headlines.length)];
}
