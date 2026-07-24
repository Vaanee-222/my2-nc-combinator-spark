// Single source of truth for platform-wide numbers.
// Import from here in Hero, dashboards, and program pages so figures never drift.
// Money values are USD base — render with <Money usd={...} /> for currency conversion.

export const PLATFORM_STATS = {
  startupsAccelerated: 500,
  totalFundingRaisedUsd: 1_200_000_000, // $1.2B
  unicornPotentialCount: 50,
  activeMentors: 250,
  investorNetwork: 180,
  countriesRepresented: 32,
  cohortsCompleted: 12,
  currentCohortSize: 24,
  successRatePct: 78,
  averageValuationUsd: 15_000_000,
} as const;

// Pre-formatted display strings for stat cards.
export const PLATFORM_STAT_LABELS = {
  startupsAccelerated: "500+",
  totalFundingRaised: "$1.2B+",
  unicornPotential: "50+",
  activeMentors: "250+",
  investorNetwork: "180+",
  countriesRepresented: "32",
  cohortsCompleted: "12",
  currentCohortSize: "24",
  successRate: "78%",
} as const;
