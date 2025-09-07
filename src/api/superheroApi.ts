import type { Superhero, HeroesCache } from '../interfaces/superhero';
import { LocalDb } from '../storage/localDb';

const API_URL = 'https://akabab.github.io/superhero-api/api/all.json';
const CACHE_VERSION = 1;

export type FetchHeroesResult = {
  heroes: Superhero[];
  fromCache: boolean;
};

export async function fetchHeroes(forceRefresh = false): Promise<FetchHeroesResult> {
  if (!forceRefresh) {
    const cached = await LocalDb.getHeroesCache();
    if (cached?.version === CACHE_VERSION && cached.heroes?.length) {
      return { heroes: cached.heroes, fromCache: true };
    }
  }

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const heroes = (await res.json()) as Superhero[];

    const cache: HeroesCache = {
      version: CACHE_VERSION,
      lastUpdated: Date.now(),
      heroes,
    };
    await LocalDb.setHeroesCache(cache);

    return { heroes, fromCache: false };
  } catch (err) {
    const cached = await LocalDb.getHeroesCache();
    if (cached?.heroes?.length) {
      return { heroes: cached.heroes, fromCache: true };
    }
    throw err;
  }
}
