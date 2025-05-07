export type Tier = 1 | 2 | 3 | 4; // sepa criar enum e chamar por nomes específicos futuramente ex. bronze, silver, etc

export const MAX_TIER: Tier = 4;

export type TieredValues = [number | null, number | null, number | null, number | null];
