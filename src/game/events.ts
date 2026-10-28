import { GameEvent } from './types';

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'data_leak_scare',
    title: '🚨 Suspected Zero-Day Vulnerability',
    category: 'crisis',
    description: 'An anonymous white-hat researcher contacts your CTO claiming a critical database leak exposes user records. They give you 48 hours before dropping a public blog post.',
    choices: [
      {
        text: 'Pay $25,000 Bug Bounty & Silence NDA',
        description: 'Quietly patch the issue and protect public valuation, though some internal staff will grumble.',
        effects: {
          cashDelta: -25000,
          reputationDelta: 2,
          moraleDelta: -5,
          valuationDelta: 0,
        },
      },
      {
        text: 'Issue Full Public Transparency Post',
        description: 'Proactively disclose the flaw, apologize, and roll out security patches. Short-term churn, long-term brand trust.',
        effects: {
          reputationDelta: 15,
          userChurnDelta: 0.04,
          moraleDelta: 8,
          valuationDelta: -50000,
        },
      },
      {
        text: 'Ignore the Threat as Extortion',
        description: 'Dismiss the report as a scam and instruct legal to threaten a defamation lawsuit.',
        effects: {
          riskOfBackfire: 0.7,
          backfireMessage: 'The researcher published proof of concept! TechCrunch picked it up, causing massive user backlash.',
          reputationDelta: -25,
          cashDelta: -60000,
          userChurnDelta: 0.12,
        },
      },
    ],
  },
  {
    id: 'viral_influencer_unsolicited',
    title: '🌟 Massive Unsolicited Viral Tweet',
    category: 'opportunity',
    description: 'A top tech influencer with 4 million followers posted a glowing video demo praising your flagship product. Servers are smoking as signups surge 600%!',
    choices: [
      {
        text: 'Spin Up Emergency High-Tier Cloud Nodes ($15k)',
        description: 'Ensure 100% server uptime and capture every incoming lead without downtime.',
        effects: {
          cashDelta: -15000,
          valuationDelta: 150000,
          reputationDelta: 12,
          userChurnDelta: -0.03,
        },
      },
      {
        text: 'Sponsor the Influencer for an Exclusive Partnership ($35k)',
        description: 'Double down immediately with a paid brand ambassadorship deal.',
        effects: {
          cashDelta: -35000,
          valuationDelta: 300000,
          reputationDelta: 20,
        },
      },
      {
        text: 'Ride the Organic Wave for Free',
        description: 'Let existing servers handle traffic queues without spending emergency treasury.',
        effects: {
          valuationDelta: 60000,
          reputationDelta: 3,
        },
      },
    ],
  },
  {
    id: 'rival_poaching_raid',
    title: '⚔️ Competitor Poaching Blitz',
    category: 'personnel',
    description: 'Your leading rival is offering 40% salary bumps and equity golden handcuffs to poach your top engineers right in the middle of a release cycle.',
    choices: [
      {
        text: 'Match Salaries & Hand Out Retention Bonuses ($30k)',
        description: 'Lock in loyalty with immediate cash bonuses and salary adjustments.',
        effects: {
          cashDelta: -30000,
          moraleDelta: 25,
          reputationDelta: 5,
        },
      },
      {
        text: 'Offer Lucrative ESOP Stock Options',
        description: 'Grant additional equity pooling. Preserves cash, dilutes founder equity slightly.',
        effects: {
          moraleDelta: 18,
          valuationDelta: 20000,
        },
      },
      {
        text: 'Deliver an Inspiring Vision Speech & Trust Loyalty',
        description: 'Remind them of the mission and company culture without increasing payroll.',
        effects: {
          riskOfBackfire: 0.5,
          backfireMessage: 'Two key engineers handed in their two-week notices to join the rival!',
          moraleDelta: -12,
          reputationDelta: -3,
        },
      },
    ],
  },
  {
    id: 'hostile_patent_troll',
    title: '⚖️ Patent Infringement Lawsuit',
    category: 'crisis',
    description: 'A notorious patent troll firm in Texas claims your core algorithms infringe on an obscure 2008 patent. They demand an immediate $80,000 licensing settlement.',
    choices: [
      {
        text: 'Settle Out of Court for $40,000',
        description: 'A bitter pill to swallow, but avoids distracting the team with months of depositions.',
        effects: {
          cashDelta: -40000,
          moraleDelta: -4,
        },
      },
      {
        text: 'Hire Elite Litigators to Invalidate the Patent ($75k)',
        description: 'Take them to federal court to set a precedent. If successful, earns massive industry respect.',
        effects: {
          cashDelta: -75000,
          reputationDelta: 22,
          valuationDelta: 100000,
          moraleDelta: 10,
        },
      },
      {
        text: 'Rapidly Re-architect Algorithm to Circumvent Claim ($12k)',
        description: 'Assign engineers to rewrite the disputed module to bypass patent wording.',
        effects: {
          cashDelta: -12000,
          moraleDelta: -8,
        },
      },
    ],
  },
  {
    id: 'whale_enterprise_contract',
    title: '🐋 Global Conglomerate RFP Opportunity',
    category: 'opportunity',
    description: 'Global Logistics Titan wants to replace their legacy vendor with your platform, potentially generating $200,000 in immediate licensing fees if you meet their custom security demands in 3 weeks.',
    choices: [
      {
        text: 'Sprint All Hands on Custom Integration ($20k overtime)',
        description: 'Mobilize engineering to deliver around the clock to win the mammoth account.',
        effects: {
          cashDelta: 180000, // net positive ($200k - $20k)
          valuationDelta: 350000,
          moraleDelta: -10,
          reputationDelta: 14,
        },
      },
      {
        text: 'Offer Standard Off-the-Shelf SLA without Custom Code',
        description: 'Refuse custom code drift. Take what they accept from standard tier.',
        effects: {
          cashDelta: 60000,
          valuationDelta: 90000,
          moraleDelta: 5,
        },
      },
      {
        text: 'Decline to Protect Product Roadmap',
        description: 'Stay true to pure core product development rather than becoming a custom dev shop.',
        effects: {
          moraleDelta: 15,
          reputationDelta: 4,
        },
      },
    ],
  },
  {
    id: 'crypto_pivot_temptation',
    title: '🪙 Hype Cycle Pivot Opportunity',
    category: 'market',
    description: 'A group of flashy crypto/Web3 venture partners offers to inject $250,000 if you announce a pivot to blockchain tokens and decentralized governance.',
    choices: [
      {
        text: 'Accept the Hype Cash & Launch Token ($250k cash)',
        description: 'Instant liquidity injection, but risks alienating conservative enterprise customers.',
        effects: {
          cashDelta: 250000,
          reputationDelta: -15,
          userChurnDelta: 0.05,
          valuationDelta: 100000,
        },
      },
      {
        text: 'Politely Decline and Double Down on Core Utility',
        description: 'Avoid distraction. Focus on durable customer delight and organic cash flow.',
        effects: {
          reputationDelta: 10,
          moraleDelta: 8,
          valuationDelta: 40000,
        },
      },
    ],
  },
  {
    id: 'burnout_crisis',
    title: '☕ Team Burnout & Culture Fatigue',
    category: 'personnel',
    description: 'Three consecutive crunch weeks have left your staff irritable and exhausted. The office energy is drained and caffeine consumption is off the charts.',
    choices: [
      {
        text: 'Host an All-Expenses Paid Tropical Retreat ($18k)',
        description: 'Fly the entire team out for a 3-day beach retreat, reset vibes, and recharge batteries.',
        effects: {
          cashDelta: -18000,
          moraleDelta: 35,
          reputationDelta: 8,
        },
      },
      {
        text: 'Implement 4-Day Work Weeks & No-Meeting Fridays',
        description: 'Institutionalize sustainable pacing. Small hit to weekly speed, massive morale gain.',
        effects: {
          moraleDelta: 25,
          reputationDelta: 10,
        },
      },
      {
        text: 'Send a Free Pizza Delivery & Push Through',
        description: 'The deadlines cannot wait. Order late-night pepperoni and urge the team forward.',
        effects: {
          moraleDelta: -20,
          reputationDelta: -5,
        },
      },
    ],
  },
  {
    id: 'acquisition_shark_bid',
    title: '🤝 Megacorp Strategic Buyout Offer',
    category: 'opportunity',
    description: 'Tech Giant "OmniCorp" CEO invites you to a Michelin-star dinner and drops a non-binding term sheet to acquire 100% of your company for cash & stock!',
    choices: [
      {
        text: 'Counter-Offer +30% Higher Valuation',
        description: 'Play hardball and demand a staggering premium.',
        effects: {
          valuationDelta: 250000,
          reputationDelta: 15,
        },
      },
      {
        text: 'Firmly Reject: "We Are Building a Generational Monopoly"',
        description: 'Walk away from the table. Tell the tech press your company is not for sale.',
        effects: {
          reputationDelta: 20,
          moraleDelta: 20,
          valuationDelta: 150000,
        },
      },
      {
        text: 'Leak the Bid to Tech Press to Spark a VC Bidding War',
        description: 'Drive frenzy among tier-1 venture capital investors looking to lead your next round.',
        effects: {
          valuationDelta: 400000,
          reputationDelta: 5,
        },
      },
    ],
  },
];
