import { TechNode } from './types';

export const TECH_TREE: TechNode[] = [
  // TIER 1
  {
    id: 'git_ci_cd',
    name: 'Automated CI/CD Pipelines',
    tier: 1,
    description: 'Continuous integration and test runners ensure fast, low-regression code deploys.',
    cost: 8000,
    requiredDevHours: 80,
    requires: [],
    effects: {
      rdSpeedBonus: 0.15,
      qualityBonus: 8,
    },
  },
  {
    id: 'analytics_telemetry',
    name: 'Event Telemetry & Heatmaps',
    tier: 1,
    description: 'Fine-grained product telemetry reveals drop-off funnels and user friction points.',
    cost: 10000,
    requiredDevHours: 90,
    requires: [],
    effects: {
      churnReduction: 0.03,
      viralMultiplier: 0.1,
    },
  },
  {
    id: 'cloud_autoscaling',
    name: 'Elastic Cloud Auto-Scaling',
    tier: 1,
    description: 'Server fleets scale dynamically with real-time traffic spikes without crashing.',
    cost: 12000,
    requiredDevHours: 110,
    requires: [],
    effects: {
      serverCostReduction: 0.2,
      qualityBonus: 5,
    },
  },

  // TIER 2
  {
    id: 'ai_copilot_suite',
    name: 'Internal AI Pair Programmers',
    tier: 2,
    description: 'Equip all engineers with code generation copilots, dramatically accelerating sprint velocity.',
    cost: 35000,
    requiredDevHours: 240,
    requires: ['git_ci_cd'],
    effects: {
      rdSpeedBonus: 0.25,
      qualityBonus: 10,
    },
  },
  {
    id: 'growth_funnel_ab',
    name: 'Multi-Armed Bandit A/B Testing',
    tier: 2,
    description: 'Algorithmic dynamic pricing and copy optimization maximizes user conversion.',
    cost: 40000,
    requiredDevHours: 220,
    requires: ['analytics_telemetry'],
    effects: {
      revenueMultiplier: 0.18,
      churnReduction: 0.04,
    },
  },
  {
    id: 'global_edge_cdn',
    name: 'Global Anycast Edge CDN',
    tier: 2,
    description: 'Sub-15ms edge compute worldwide gives products silky-smooth global latency.',
    cost: 48000,
    requiredDevHours: 260,
    requires: ['cloud_autoscaling'],
    effects: {
      serverCostReduction: 0.25,
      churnReduction: 0.03,
      qualityBonus: 12,
    },
  },

  // TIER 3
  {
    id: 'autonomous_agents',
    name: 'Autonomous Multi-Agent Swarms',
    tier: 3,
    description: 'Self-healing infrastructure and synthetic customer support bots resolving tickets 24/7.',
    cost: 120000,
    requiredDevHours: 500,
    requires: ['ai_copilot_suite'],
    effects: {
      rdSpeedBonus: 0.35,
      churnReduction: 0.06,
      revenueMultiplier: 0.2,
    },
  },
  {
    id: 'enterprise_soc2',
    name: 'Military-Grade SOC-2 & Zero-Trust',
    tier: 3,
    description: 'End-to-end homomorphic encryption opens doors to Fortune 500 multi-million dollar contracts.',
    cost: 150000,
    requiredDevHours: 550,
    requires: ['global_edge_cdn'],
    effects: {
      revenueMultiplier: 0.3,
      qualityBonus: 20,
    },
  },
  {
    id: 'viral_referral_engine',
    name: 'Gamified Organic Viral Loops',
    tier: 3,
    description: 'K-factor viral referral rewards that make every user bring 1.4 additional paying accounts.',
    cost: 110000,
    requiredDevHours: 480,
    requires: ['growth_funnel_ab'],
    effects: {
      viralMultiplier: 0.45,
      revenueMultiplier: 0.15,
    },
  },

  // TIER 4
  {
    id: 'quantum_neural_engine',
    name: 'Quantum-Accelerated Reasoning Chip',
    tier: 4,
    description: 'Proprietary custom silicon architecture that obsoletes conventional market alternatives.',
    cost: 650000,
    requiredDevHours: 1200,
    requires: ['autonomous_agents', 'enterprise_soc2'],
    effects: {
      rdSpeedBonus: 0.5,
      qualityBonus: 35,
      revenueMultiplier: 0.5,
      churnReduction: 0.08,
    },
  },
  {
    id: 'monopoly_ecosystem',
    name: 'Universal Ecosystem Lock-In',
    tier: 4,
    description: 'Your platform becomes the industry default operating standard with impenetrable network moats.',
    cost: 950000,
    requiredDevHours: 1500,
    requires: ['enterprise_soc2', 'viral_referral_engine'],
    effects: {
      revenueMultiplier: 0.75,
      churnReduction: 0.12,
      viralMultiplier: 0.6,
    },
  },
];
