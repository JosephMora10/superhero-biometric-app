import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Team } from '../interfaces/team';
import { addTeam as storageAddTeam, getTeams, removeTeam as storageRemoveTeam, updateTeam as storageUpdateTeam } from '../storage/teamsStorage';

// Simple in-module event bus to keep multiple hook instances in sync
type TeamsListener = (teams: Team[]) => void;
const teamsListeners = new Set<TeamsListener>();
const notifyTeamsUpdate = (teams: Team[]) => {
  teamsListeners.forEach((fn) => {
    try { fn(teams); } catch { /* noop */ }
  });
};

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getTeams();
        setTeams(data);
        notifyTeamsUpdate(data);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load teams');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Subscribe to updates from other hook instances
  useEffect(() => {
    const listener: TeamsListener = (data) => setTeams(data);
    teamsListeners.add(listener);
    return () => { teamsListeners.delete(listener); };
  }, []);

  const reload = useCallback(async () => {
    try {
      const data = await getTeams();
      setTeams(data);
      notifyTeamsUpdate(data);
    } catch (e) {
      // noop
    }
  }, []);

  const createTeam = useCallback(async (name?: string) => {
    const finalName = (name && name.trim()) || `Team ${teams.length + 1}`;
    const newTeam = await storageAddTeam(finalName);
    setTeams(prev => {
      const next = [newTeam, ...prev];
      notifyTeamsUpdate(next);
      return next;
    });
    return newTeam;
  }, [teams.length]);

  const renameTeam = useCallback(async (id: string, name: string) => {
    setTeams(prev => {
      const idx = prev.findIndex(t => t.id === id);
      if (idx === -1) return prev;
      const updated: Team = { ...prev[idx], name, updatedAt: new Date().toISOString() };
      storageUpdateTeam(updated);
      const next = [...prev];
      next[idx] = updated;
      notifyTeamsUpdate(next);
      return next;
    });
  }, []);

  const deleteTeam = useCallback(async (id: string) => {
    await storageRemoveTeam(id);
    setTeams(prev => {
      const next = prev.filter(t => t.id !== id);
      notifyTeamsUpdate(next);
      return next;
    });
  }, []);

  const addMember = useCallback(async (teamId: string, heroId: number) => {
    setTeams(prev => {
      const idx = prev.findIndex(t => t.id === teamId);
      if (idx === -1) return prev;
      const team = prev[idx];
      if (team.memberIds.includes(heroId)) return prev;
      const updated: Team = { ...team, memberIds: [...team.memberIds, heroId], updatedAt: new Date().toISOString() };
      storageUpdateTeam(updated);
      const next = [...prev];
      next[idx] = updated;
      notifyTeamsUpdate(next);
      return next;
    });
  }, []);

  const removeMember = useCallback(async (teamId: string, heroId: number) => {
    setTeams(prev => {
      const idx = prev.findIndex(t => t.id === teamId);
      if (idx === -1) return prev;
      const team = prev[idx];
      const updated: Team = { ...team, memberIds: team.memberIds.filter(id => id !== heroId), updatedAt: new Date().toISOString() };
      storageUpdateTeam(updated);
      const next = [...prev];
      next[idx] = updated;
      notifyTeamsUpdate(next);
      return next;
    });
  }, []);

  return useMemo(() => ({
    teams,
    loading,
    error,
    reload,
    createTeam,
    renameTeam,
    deleteTeam,
    addMember,
    removeMember,
  }), [teams, loading, error, reload, createTeam, renameTeam, deleteTeam, addMember, removeMember]);
}
