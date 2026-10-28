import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  createInitialCompany, 
  advanceWeek, 
  hireEmployee, 
  createProduct, 
  startResearch,
  takeLoan,
  repayLoan,
  raiseFunding,
  resolveEvent,
  trainEmployee,
  toggleOfficePerk,
  unlockRegion,
  buybackShares,
  hostEarningsCall,
  sabotageCompetitor
} from './engine';

test('createInitialCompany initializes valid starting company state', () => {
  const company = createInitialCompany({
    companyName: 'Apex Cloud',
    founderName: 'Jane Doe',
    founderTrait: 'code_wizard',
    industry: 'saas',
  });

  assert.equal(company.companyName, 'Apex Cloud');
  assert.equal(company.founderName, 'Jane Doe');
  assert.equal(company.founderTrait, 'code_wizard');
  assert.equal(company.industry, 'saas');
  assert.equal(company.cash, 100000);
  assert.equal(company.week, 1);
  assert.equal(company.officeLevel, 0);
  assert.equal(company.staff.length, 1);
  assert.equal(company.products.length, 1);
  assert.equal(company.boardConfidence, 78);
  assert.equal(company.regions.length, 6);
  assert.equal(company.isGameOver, false);
});

test('venture_prodigy founder starts with bonus capital', () => {
  const company = createInitialCompany({
    companyName: 'Venture Capitalized',
    founderName: 'Rich Kid',
    founderTrait: 'venture_prodigy',
    industry: 'ai',
  });

  assert.equal(company.cash, 250000);
  assert.equal(company.valuation, 1200000);
});

test('advanceWeek progresses turns and creates financial snapshot', () => {
  let state = createInitialCompany({
    companyName: 'Tick Corp',
    founderName: 'Founder',
    founderTrait: 'growth_hacker',
    industry: 'gaming',
  });

  state = advanceWeek(state);
  assert.equal(state.week, 2);
  assert.equal(state.financialHistory.length, 1);
  assert.ok(state.financialHistory[0].expenses.payroll > 0);
  assert.ok(state.products[0].developmentProgress > 45);
});

test('hireEmployee adds candidate and respects office limit', () => {
  let state = createInitialCompany({
    companyName: 'Hiring Corp',
    founderName: 'HR Manager',
    founderTrait: 'sales_shark',
    industry: 'saas',
  });

  const candidateId = state.candidatePool[0].id;
  const initialCash = state.cash;
  const candidateBonus = state.candidatePool[0].signingBonus;

  state = hireEmployee(state, candidateId);
  assert.equal(state.staff.length, 2);
  assert.equal(state.cash, initialCash - candidateBonus);

  // Garage limit is 3. Let's hire 1 more (total 3)
  const candidateId2 = state.candidatePool[0].id;
  state = hireEmployee(state, candidateId2);
  assert.equal(state.staff.length, 3);

  // Hiring a 4th when max is 3 should be rejected
  if (state.candidatePool.length > 0) {
    const candidateId3 = state.candidatePool[0].id;
    const rejectedState = hireEmployee(state, candidateId3);
    assert.equal(rejectedState.staff.length, 3);
  }
});

test('trainEmployee permanently increases employee skill and morale', () => {
  let state = createInitialCompany({
    companyName: 'Academy Corp',
    founderName: 'Coach',
    founderTrait: 'code_wizard',
    industry: 'saas',
  });

  const empId = state.staff[0].id;
  const oldSkill = state.staff[0].skill;
  state = trainEmployee(state, empId);

  assert.equal(state.staff[0].skill, oldSkill + 7);
  assert.equal(state.cash, 100000 - 3500);
});

test('toggleOfficePerk activates and deactivates workplace culture perks', () => {
  let state = createInitialCompany({
    companyName: 'Perk Corp',
    founderName: 'Culture Chief',
    founderTrait: 'design_visionary',
    industry: 'saas',
  });

  state = toggleOfficePerk(state, 'espresso_bar');
  assert.ok(state.activePerkIds.includes('espresso_bar'));
  assert.equal(state.cash, 100000 - 2500);

  state = toggleOfficePerk(state, 'espresso_bar');
  assert.ok(!state.activePerkIds.includes('espresso_bar'));
});

test('unlockRegion expands into international markets', () => {
  let state = createInitialCompany({
    companyName: 'Global Corp',
    founderName: 'Explorer',
    founderTrait: 'growth_hacker',
    industry: 'ecommerce',
  });

  state = unlockRegion(state, 'latam');
  const latam = state.regions.find(r => r.id === 'latam');
  assert.equal(latam?.unlocked, true);
  assert.equal(state.cash, 100000 - 18000);
});

test('raiseFunding and buybackShares adjust founder equity accurately', () => {
  let state = createInitialCompany({
    companyName: 'Equity Inc',
    founderName: 'Pitch Master',
    founderTrait: 'venture_prodigy',
    industry: 'ai',
  });

  state = raiseFunding(state, 'Seed Round', 15, 2000000);
  assert.equal(state.equityFounder, 85);
  assert.equal(state.cash, 250000 + 300000);

  state = buybackShares(state, 5);
  assert.equal(state.equityFounder, 90);
});

test('hostEarningsCall boosts valuation and board confidence', () => {
  let state = createInitialCompany({
    companyName: 'Keynote Corp',
    founderName: 'Speaker',
    founderTrait: 'sales_shark',
    industry: 'saas',
  });

  const oldVal = state.valuation;
  state = hostEarningsCall(state, 'balanced');
  assert.ok(state.valuation > oldVal);
  assert.ok(state.boardConfidence > 78);
});

test('sabotageCompetitor weakens rival valuation and adds poached talent', () => {
  let state = createInitialCompany({
    companyName: 'Spy Corp',
    founderName: 'Agent',
    founderTrait: 'code_wizard',
    industry: 'ai',
  });

  const targetRival = state.competitors[0];
  const oldVal = targetRival.valuation;
  const oldPoolCount = state.candidatePool.length;

  state = sabotageCompetitor(state, targetRival.id, 'poach');
  assert.ok(state.competitors[0].valuation < oldVal);
  assert.equal(state.candidatePool.length, oldPoolCount + 1);
});

test('bankruptcy triggers when cash is severely negative', () => {
  let state = createInitialCompany({
    companyName: 'Broke Corp',
    founderName: 'Unlucky',
    founderTrait: 'workaholic',
    industry: 'gaming',
  });

  state.cash = -30000;
  state = advanceWeek(state);
  assert.equal(state.isGameOver, true);
  assert.ok(state.gameOverReason?.includes('Bankruptcy'));
});
