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

/**
 * Compact USD formatter used to derive display strings from PLATFORM_STATS.
 * Kept simple and deterministic so tests can verify label ↔ number consistency
 * without pulling in Intl locale variance.
 */
function compactUsd(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B+`;
  if (n >= 1_000_000) return `$${Math.round(n / 1_000_000)}M+`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K+`;
  return `$${n}`;
}

function compactPlus(n: number): string {
  return `${n}+`;
}

/**
 * Assert the human-readable labels agree with the numeric source of truth.
 * Called at module load in dev; test suite calls it too.
 * Throws with a descriptive message on the first mismatch so drift is caught early.
 */
export function validatePlatformStats(): void {
  const expected: Record<keyof typeof PLATFORM_STAT_LABELS, string> = {
    startupsAccelerated: compactPlus(PLATFORM_STATS.startupsAccelerated),
    totalFundingRaised: compactUsd(PLATFORM_STATS.totalFundingRaisedUsd),
    unicornPotential: compactPlus(PLATFORM_STATS.unicornPotentialCount),
    activeMentors: compactPlus(PLATFORM_STATS.activeMentors),
    investorNetwork: compactPlus(PLATFORM_STATS.investorNetwork),
    countriesRepresented: String(PLATFORM_STATS.countriesRepresented),
    cohortsCompleted: String(PLATFORM_STATS.cohortsCompleted),
    currentCohortSize: String(PLATFORM_STATS.currentCohortSize),
    successRate: `${PLATFORM_STATS.successRatePct}%`,
  };

  for (const key of Object.keys(expected) as Array<keyof typeof expected>) {
    if (PLATFORM_STAT_LABELS[key] !== expected[key]) {
      throw new Error(
        `[platformStats] Label drift for "${key}": label="${PLATFORM_STAT_LABELS[key]}" but PLATFORM_STATS derives "${expected[key]}". Update PLATFORM_STAT_LABELS or PLATFORM_STATS in src/lib/platformStats.ts.`,
      );
    }
  }
}

// Fail loudly in dev if a contributor edits one side but not the other.
if (import.meta.env?.DEV) {
  try {
    validatePlatformStats();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}
