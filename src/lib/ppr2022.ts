export type BidType = "expense" | "income";
export type SystemChoice = "field" | "80/20" | "90/10";

export interface Bidder {
  name: string;
  price: number;
  goals: number;
}
export interface PreferenceSystem {
  name: "80/20" | "90/10";
  price: 80 | 90;
  goals: 20 | 10;
}
export interface ScoredBid extends Bidder {
  index: number;
  goalPoints: number;
  goalsCapped: boolean;
  pricePoints: number;
  total: number;
  rank: number;
  tied?: boolean;
}
export interface Evaluation {
  system: PreferenceSystem | null;
  referencePrice: number;
  results: ScoredBid[];
  ranked: ScoredBid[];
}

const THRESHOLD = 50_000_000;
const LEGACY_BBBEE: Record<PreferenceSystem["name"], number[]> = {
  "80/20": [20, 18, 14, 12, 8, 6, 4, 2, 0],
  "90/10": [10, 9, 6, 5, 4, 3, 2, 1, 0]
};

export function choosePreferenceSystem(referencePrice: number, choice: SystemChoice = "field"): PreferenceSystem | null {
  if (!Number.isFinite(referencePrice) || referencePrice <= 0) return null;
  if (choice === "80/20") return { name: "80/20", price: 80, goals: 20 };
  if (choice === "90/10") return { name: "90/10", price: 90, goals: 10 };
  return referencePrice <= THRESHOLD
    ? { name: "80/20", price: 80, goals: 20 }
    : { name: "90/10", price: 90, goals: 10 };
}

export function pricePoints(type: BidType, system: PreferenceSystem, price: number, referencePrice: number): number {
  if (type === "income") return system.price * (1 + (price - referencePrice) / referencePrice);
  return system.price * (1 - (price - referencePrice) / referencePrice);
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Pass only acceptable tender prices: the regulations use the lowest/highest acceptable tender as reference. */
export function evaluateBids(bidders: Bidder[], type: BidType, choice: SystemChoice = "field"): Evaluation {
  const valid = bidders.filter((bid) => Number.isFinite(bid.price) && bid.price > 0);
  const referencePrice = valid.length
    ? (type === "income" ? Math.max(...valid.map((bid) => bid.price)) : Math.min(...valid.map((bid) => bid.price)))
    : 0;
  const system = choosePreferenceSystem(referencePrice, choice);
  if (!system) return { system: null, referencePrice, results: [], ranked: [] };

  const results: ScoredBid[] = valid.map((bid, index) => {
    const claimed = Number.isFinite(bid.goals) ? Math.max(0, bid.goals) : 0;
    const goalPoints = Math.min(claimed, system.goals);
    const rawPricePoints = pricePoints(type, system, bid.price, referencePrice);
    return {
      ...bid,
      index,
      goalPoints,
      goalsCapped: claimed > system.goals,
      pricePoints: round2(rawPricePoints),
      total: round2(rawPricePoints + goalPoints),
      rank: 0
    };
  });

  const ranked = [...results].sort((a, b) => b.total - a.total || b.goalPoints - a.goalPoints);
  ranked.forEach((bid, index) => { bid.rank = index + 1; });
  for (let index = 1; index < ranked.length; index += 1) {
    const previous = ranked[index - 1];
    const current = ranked[index];
    if (previous.total === current.total && previous.goalPoints === current.goalPoints) {
      current.rank = previous.rank;
      current.tied = true;
      previous.tied = true;
    }
  }
  return { system, referencePrice, results, ranked };
}

function meRanksFirst(me: Bidder, competitors: Bidder[], type: BidType, price: number, choice: SystemChoice): boolean {
  const evaluation = evaluateBids([{ ...me, price }, ...competitors], type, choice);
  const mine = evaluation.results[0];
  if (!mine) return false;
  return evaluation.results.slice(1).every((other) =>
    other.total < mine.total || (other.total === mine.total && other.goalPoints < mine.goalPoints)
  );
}

/**
 * Finds a cent-rounded planning threshold while competitor prices/goals stay fixed.
 * Exact ties still need the tie-break rule (and may require drawing lots).
 */
export function winningPrice(
  me: Bidder,
  competitors: Bidder[],
  type: BidType,
  choice: SystemChoice = "field"
): { price: number; direction: "maximum" | "minimum" } | null {
  if (!competitors.length) return null;
  const floor = 0.01;
  const ceiling = Math.max(me.price, ...competitors.map((bid) => bid.price)) * 10;

  if (type === "expense") {
    if (!meRanksFirst(me, competitors, type, floor, choice)) return null;
    let low = floor;
    let high = ceiling;
    for (let i = 0; i < 100; i += 1) {
      const middle = (low + high) / 2;
      if (meRanksFirst(me, competitors, type, middle, choice)) low = middle;
      else high = middle;
    }
    return { price: Math.floor((low + 1e-8) * 100) / 100, direction: "maximum" };
  }

  if (!meRanksFirst(me, competitors, type, ceiling, choice)) return null;
  let low = floor;
  let high = ceiling;
  for (let i = 0; i < 100; i += 1) {
    const middle = (low + high) / 2;
    if (meRanksFirst(me, competitors, type, middle, choice)) high = middle;
    else low = middle;
  }
  return { price: Math.ceil((high - 1e-8) * 100) / 100, direction: "minimum" };
}

export function percentPerGoalPoint(system: PreferenceSystem): number {
  return 100 / system.price;
}

export const legacyBbeePoints = LEGACY_BBBEE;
export const preferenceThreshold = THRESHOLD;
