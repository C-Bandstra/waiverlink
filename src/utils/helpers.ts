
import { seeds } from '../seed/seeds.ts';

export function getSeedBySlug(slug: string = "") {
  const seed = seeds[slug];
  if (!seed) {
    throw new Error(`Seed not found for slug: ${slug}`);
  }
  return seed;
}

export function getSeedFromHostOrParam(hostname: string, paramId?: string) {
  const subdomain = hostname.split('.')[0];
  const seedId = paramId || subdomain;

  const seed = seeds[seedId];
  if (!seed) throw new Error(`Seed not found for id: ${seedId}`);

  return seed;
}