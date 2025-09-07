import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchHeroes } from '../api/superheroApi';
import type { Superhero } from '../interfaces/superhero';

export function useHeroes() {
  const [heroes, setHeroes] = useState<Superhero[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');

  const load = useCallback(async (opts?: { force?: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const { heroes: data, fromCache } = await fetchHeroes(!!opts?.force);
      setHeroes(data);
      setFromCache(fromCache);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load heroes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return heroes;
    return heroes.filter(h => {
      const byName = h.name?.toLowerCase().includes(q);
      const byFullName = h.biography?.fullName?.toLowerCase().includes(q);
      return byName || byFullName;
    });
  }, [heroes, query]);

  return {
    heroes,
    filtered,
    loading,
    error,
    fromCache,
    query,
    setQuery,
    reload: () => load({ force: true })
  } as const;
}
