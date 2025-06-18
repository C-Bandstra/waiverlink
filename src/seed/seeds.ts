// seeds/index.ts
import ChristySports from "./ChristySports/christy-sports";
import NeverSummer from "./NeverSummer/never-summer";
// import { Burton } from './Burton';

export const seeds = {
  [NeverSummer.id]: NeverSummer,
  [ChristySports.id]: ChristySports,
  // [Burton.id]: Burton,
};

export type Seed = typeof NeverSummer; // or build a base type for structure
