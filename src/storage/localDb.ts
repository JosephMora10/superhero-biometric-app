import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HeroesCache, FavoritesState, Team } from '../interfaces/superhero';

const KEYS = {
  heroes: 'startrack.heroes.v1',
  favorites: 'startrack.favorites.v1',
  teams: 'startrack.teams.v1',
};

export const LocalDb = {
  // Heroes cache
  async getHeroesCache(): Promise<HeroesCache | null> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.heroes);
      return raw ? (JSON.parse(raw) as HeroesCache) : null;
    } catch (e) {
      return null;
    }
  },
  async setHeroesCache(cache: HeroesCache): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.heroes, JSON.stringify(cache));
    } catch (e) {
      // noop
    }
  },

  // Favorites
  async getFavorites(): Promise<FavoritesState> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.favorites);
      if (raw) return JSON.parse(raw) as FavoritesState;
      return { ids: [], updatedAt: Date.now() };
    } catch (e) {
      return { ids: [], updatedAt: Date.now() };
    }
  },
  async setFavorites(state: FavoritesState): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.favorites, JSON.stringify(state));
    } catch {}
  },
  async toggleFavorite(id: number): Promise<FavoritesState> {
    const current = await this.getFavorites();
    const exists = current.ids.includes(id);
    const ids = exists ? current.ids.filter(x => x !== id) : [...current.ids, id];
    const next = { ids, updatedAt: Date.now() };
    await this.setFavorites(next);
    return next;
  },

  // Teams
  async getTeams(): Promise<Team[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.teams);
      return raw ? (JSON.parse(raw) as Team[]) : [];
    } catch (e) {
      return [];
    }
  },
  async setTeams(teams: Team[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.teams, JSON.stringify(teams));
    } catch {}
  },
  async upsertTeam(team: Team): Promise<void> {
    const teams = await this.getTeams();
    const idx = teams.findIndex(t => t.id === team.id);
    if (idx >= 0) teams[idx] = team; else teams.push(team);
    await this.setTeams(teams);
  },
  async deleteTeam(id: string): Promise<void> {
    const teams = await this.getTeams();
    const next = teams.filter(t => t.id !== id);
    await this.setTeams(next);
  },
};
