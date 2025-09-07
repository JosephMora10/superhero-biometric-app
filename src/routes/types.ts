import { Superhero } from '../interfaces/superhero';

export type RootStackParamList = {
  Home: undefined;
  Teams: undefined;
  Favorites: undefined;
  
  Heroes: undefined;
  Hero: { heroId: number };
  
  TeamsHome: undefined;
  TeamDetail: { teamId: string };
  AddTeamMember: { teamId: string };
  
  Search: undefined;
};

export type FavoritesStackParamList = {
  FavoritesHome: undefined;
  Hero: { heroId: number };
};

export type TeamsStackParamList = {
  TeamsHome: undefined;
  TeamDetail: { teamId: string };
  AddTeamMember: { teamId: string };
};

export type HeroesStackParamList = {
  HeroesHome: undefined;
  Hero: { heroId: number };
};
