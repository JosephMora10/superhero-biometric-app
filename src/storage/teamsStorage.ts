import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Team } from '../interfaces/team';

const TEAMS_KEY = '@startrack/teams';

export async function getTeams(): Promise<Team[]> {
  try {
    const raw = await AsyncStorage.getItem(TEAMS_KEY);
    if (!raw) return [];
    const parsed: Team[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error('getTeams error', e);
    return [];
  }
}

export async function saveTeams(teams: Team[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  } catch (e) {
    console.error('saveTeams error', e);
  }
}

export async function addTeam(name: string): Promise<Team> {
  const now = new Date().toISOString();
  const newTeam: Team = {
    id: `${Date.now()}`,
    name,
    memberIds: [],
    createdAt: now,
    updatedAt: now,
  };
  const teams = await getTeams();
  const next = [newTeam, ...teams];
  await saveTeams(next);
  return newTeam;
}

export async function updateTeam(updated: Team): Promise<void> {
  const teams = await getTeams();
  const idx = teams.findIndex(t => t.id === updated.id);
  if (idx === -1) return;
  const next = [...teams];
  next[idx] = { ...updated, updatedAt: new Date().toISOString() };
  await saveTeams(next);
}

export async function removeTeam(id: string): Promise<void> {
  const teams = await getTeams();
  const next = teams.filter(t => t.id !== id);
  await saveTeams(next);
}
