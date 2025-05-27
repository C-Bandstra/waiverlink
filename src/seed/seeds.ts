// seeds/index.ts
import NeverSummer from './NeverSummer/never-summer';
// import { Burton } from './Burton';

export const seeds = {
  [NeverSummer.id]: NeverSummer,
  // [Burton.id]: Burton,
};

export type Seed = typeof NeverSummer; // or build a base type for structure