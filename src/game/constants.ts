import { IndustryConfig, IndustryType, OfficeTier, FounderTrait } from './types';

export const INDUSTRIES: Record<IndustryType, IndustryConfig> = {
  saas: {
    id: 'saas',
    name: 'Enterprise Cloud & SaaS',
    badge: '☁️ Cloud B2B',
    description: 'High recurring subscription margins and negative churn potential, but heavy server maintenance and high CAC.',
    marginMultiplier: 1.25,
    rdCostMultiplier: 1.0,
    volatility: 0.8,
    starterProduct: {
      name: 'OmniDesk CRM',
      description: 'Streamlined pipeline management for remote enterprise sales teams.',
      type: 'Workflow SaaS',
    },
  },
  ai: {
    id: 'ai',
    name: 'Artificial Intelligence & Robotics',
    badge: '🧠 DeepTech AI',
    description: 'Skyrocketing valuation multiples and investor frenzy, offset by massive GPU compute costs and talent wars.',
    marginMultiplier: 1.15,
    rdCostMultiplier: 1.5,
    volatility: 1.6,
    starterProduct: {
      name: 'NeuroSynthetix LLM',
      description: 'Autonomous reasoning copilot for high-frequency legal & financial auditing.',
      type: 'Foundation Agent',
    },
  },
  gaming: {
    id: 'gaming',
    name: 'Mobile & Interactive Gaming',
    badge: '🎮 Game Studio',
    description: 'Huge viral monetization spikes and organic loop upside, but fast player churn and hit-dependent lifecycles.',
    marginMultiplier: 1.35,
    rdCostMultiplier: 0.9,
    volatility: 1.4,
    starterProduct: {
      name: 'CyberRogue: Endless Tactics',
      description: 'Tactical cyberpunk roguelike with live-service competitive seasons.',
      type: 'Mobile Game',
    },
  },
  hardware: {
    id: 'hardware',
    name: 'Smart Hardware & Consumer Tech',
    badge: '⚡ Hardware & IoT',
    description: 'Solid retail unit margins and consumer brand prestige, balanced with manufacturing tooling and inventory risk.',
    marginMultiplier: 0.95,
    rdCostMultiplier: 1.3,
    volatility: 0.9,
    starterProduct: {
      name: 'AuraRing Quantum Health',
      description: 'Titanium bio-tracking smart ring with real-time neural telemetry.',
      type: 'Wearable Tech',
    },
  },
  biotech: {
    id: 'biotech',
    name: 'Biotech & Genomics Therapeutics',
    badge: '🧬 Biotech Pharma',
    description: 'Long R&D cycles with immense patent blockbuster payouts and global licensing royalties upon milestone breakthrough.',
    marginMultiplier: 1.5,
    rdCostMultiplier: 1.7,
    volatility: 1.8,
    starterProduct: {
      name: 'HelixImmune CR-4',
      description: 'Targeted synthetic mRNA adjuvant for metabolic longevity therapy.',
      type: 'Cell Therapy',
    },
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-Commerce & Smart Logistics',
    badge: '📦 Direct-to-Consumer',
    description: 'High transaction volume, rapid cash velocity, and international reach, but sensitive to warehouse and freight costs.',
    marginMultiplier: 0.9,
    rdCostMultiplier: 0.8,
    volatility: 1.1,
    starterProduct: {
      name: 'AeroCart Express',
      description: 'Predictive autonomous drone replenishment marketplace.',
      type: 'Logistics Platform',
    },
  },
};

export const FOUNDER_TRAITS: { id: FounderTrait; name: string; tag: string; description: string; icon: string }[] = [
  {
    id: 'code_wizard',
    name: 'Code Wizard',
    tag: '+25% R&D Output',
    description: 'Deep technical background. Your engineering team pushes features 25% faster with fewer critical bugs.',
    icon: '💻',
  },
  {
    id: 'sales_shark',
    name: 'Sales Shark',
    tag: '+30% Contract Revenue',
    description: 'Master negotiator. B2B enterprise clients sign higher payout contracts and close 30% faster.',
    icon: '🦈',
  },
  {
    id: 'venture_prodigy',
    name: 'Venture Prodigy',
    tag: '+$150,000 Seed & Better Valuations',
    description: 'Silicon Valley alumni connections. Starts with $150k extra cash and unlocks higher valuation terms.',
    icon: '💎',
  },
  {
    id: 'growth_hacker',
    name: 'Growth Hacker',
    tag: '-35% Ad CAC',
    description: 'Viral algorithm specialist. Marketing campaigns convert customers with 35% higher user yield.',
    icon: '🚀',
  },
  {
    id: 'design_visionary',
    name: 'Design Visionary',
    tag: '+20% Product Quality & Retention',
    description: 'Uncompromising aesthetic intuition. Products gain 20% higher user satisfaction and lower churn.',
    icon: '🎨',
  },
  {
    id: 'workaholic',
    name: 'Relentless Grind',
    tag: '+15% All Team Output',
    description: 'Inspires intense operational tempo, pushing company-wide productivity while watching burn rate.',
    icon: '⚡',
  },
];

export const OFFICE_TIERS: OfficeTier[] = [
  {
    level: 0,
    name: 'Suburban Garage',
    maxStaff: 3,
    weeklyRent: 250,
    moraleBonus: -5,
    upgradeCost: 0,
    description: 'Dusty workbench, flickering fluorescent lights, and extension cords everywhere. Humble beginnings.',
  },
  {
    level: 1,
    name: 'Coworking Hub Desk',
    maxStaff: 8,
    weeklyRent: 1200,
    moraleBonus: 0,
    upgradeCost: 15000,
    description: 'Artisanal cold brew on tap, ergonomic desks, and meeting rooms bookable via tablet app.',
  },
  {
    level: 2,
    name: 'Loft Innovation Hub',
    maxStaff: 18,
    weeklyRent: 4800,
    moraleBonus: 8,
    upgradeCost: 65000,
    description: 'Exposed brick, soundproof podcast booths, catered lunches, and a dedicated ping-pong lounge.',
  },
  {
    level: 3,
    name: 'Downtown Glass Tower',
    maxStaff: 40,
    weeklyRent: 14000,
    moraleBonus: 16,
    upgradeCost: 220000,
    description: '36th-floor panoramic city skyline views, private boardroom, server room, and executive barista.',
  },
  {
    level: 4,
    name: 'Silicon Valley Mega-Campus',
    maxStaff: 100,
    weeklyRent: 38000,
    moraleBonus: 25,
    upgradeCost: 950000,
    description: 'Solar-powered architectural wonder with helicopter pad, gym, amphitheater, and meditation gardens.',
  },
];

export const CANDIDATE_NAMES: Record<string, string[]> = {
  first: ['Alex', 'Elena', 'Marcus', 'Samantha', 'David', 'Chloe', 'Jin', 'Priya', 'Leo', 'Tara', 'Dante', 'Maya', 'Nico', 'Siddharth', 'Zoe', 'Julian', 'Freya', 'Kai', 'Amara', 'Lucas'],
  last: ['Chen', 'Vance', 'Mercer', 'Patel', 'Lindqvist', 'O’Connor', 'Sterling', 'Kowalski', 'Nakamura', 'Holloway', 'Sinclair', 'Rios', 'Gupta', 'Blackwood', 'Tanaka', 'Fontaine'],
};

export const STAFF_TRAITS = [
  { name: '10x Coder', desc: 'Produces double engineering output with razor-sharp code.' },
  { name: 'Morale Booster', desc: 'High charisma radiates through the team, lifting department morale.' },
  { name: 'Perfectionist', desc: 'Virtually zero bugs introduced, but takes 15% longer to polish.' },
  { name: 'Growth Prodigy', desc: 'Knocks viral loops and user acquisition efficiency out of the park.' },
  { name: 'Deal Closer', desc: 'Secures premium contract payouts and negotiates enterprise terms.' },
  { name: 'Workaholic', desc: 'Works late into the night without burning out easily.' },
];
