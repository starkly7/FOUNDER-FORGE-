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
  upgradeOffice
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

test('createProduct deducts setup fee and adds development project', () => {
  let state = createInitialCompany({
    companyName: 'Product Corp',
    founderName: 'Builder',
    founderTrait: 'design_visionary',
    industry: 'ecommerce',
  });

  const initialProds = state.products.length;
  const initialCash = state.cash;

  state = createProduct(state, {
    name: 'SmartCart 2.0',
    type: 'Logistics AI',
    pricingModel: 'subscription',
    pricePerMonth: 29,
    features: {
      techQuality: 70,
      userExperience: 80,
      security: 75,
      serverCapacity: 10000,
    },
  });

  assert.equal(state.products.length, initialProds + 1);
  assert.equal(state.cash, initialCash - 15000);
  assert.equal(state.products[initialProds].name, 'SmartCart 2.0');
  assert.equal(state.products[initialProds].status, 'development');
});

test('startResearch unlocks R&D tech queue', () => {
  let state = createInitialCompany({
    companyName: 'Research Labs',
    founderName: 'Scientist',
    founderTrait: 'code_wizard',
    industry: 'biotech',
  });

  state = startResearch(state, 'git_ci_cd');
  assert.ok(state.activeResearch);
  assert.equal(state.activeResearch?.techId, 'git_ci_cd');
  assert.equal(state.cash, 100000 - 8000);
});

test('takeLoan and repayLoan adjust balances accurately', () => {
  let state = createInitialCompany({
    companyName: 'Debt Corp',
    founderName: 'Borrower',
    founderTrait: 'sales_shark',
    industry: 'saas',
  });

  state = takeLoan(state, 50000);
  assert.equal(state.debt, 50000);
  assert.equal(state.cash, 150000);

  state = repayLoan(state, 20000);
  assert.equal(state.debt, 30000);
  assert.equal(state.cash, 130000);
});

test('raiseFunding dilutes founder equity and injects valuation capital', () => {
  let state = createInitialCompany({
    companyName: 'Funded Inc',
    founderName: 'Pitch Master',
    founderTrait: 'venture_prodigy',
    industry: 'ai',
  });

  state = raiseFunding(state, 'Seed Round', 15, 2000000);
  assert.equal(state.equityFounder, 85);
  // 15% of $2,000,000 = $300,000 cash raised
  assert.equal(state.cash, 250000 + 300000);
});

test('resolveEvent applies chosen decision effects', () => {
  let state = createInitialCompany({
    companyName: 'Eventful Corp',
    founderName: 'Leader',
    founderTrait: 'code_wizard',
    industry: 'saas',
  });

  state.pendingEvent = {
    id: 'test_event',
    title: 'Test Opportunity',
    category: 'opportunity',
    description: 'A venture partner offers an accelerated marketing grant.',
    choices: [
      {
        text: 'Take Grant',
        description: 'Accept cash and boost reputation.',
        effects: {
          cashDelta: 50000,
          reputationDelta: 10,
        },
      },
    ],
  };

  state = resolveEvent(state, 0);
  assert.equal(state.cash, 150000);
  assert.equal(state.reputation, 70);
  assert.equal(state.pendingEvent, null);
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
