export interface Powerstats {
  intelligence: number | null;
  strength:     number | null;
  speed:        number | null;
  durability:   number | null;
  power:        number | null;
  combat:       number | null;
}

export interface Appearance {
  gender:    string | null;
  race:      string | null;
  height:    string[];
  weight:    string[];
  eyeColor:  string | null;
  hairColor: string | null;
}

export interface Biography {
  fullName:        string;
  alterEgos:       string;
  aliases:         string[];
  placeOfBirth:    string;
  firstAppearance: string;
  publisher:       string | null;
  alignment:       'good' | 'bad' | 'neutral' | string | null;
}

export interface Work {
  occupation: string;
  base:       string;
}

export interface Connections {
  groupAffiliation: string;
  relatives:        string;
}

export interface Images {
  xs: string;
  sm: string;
  md: string;
  lg: string;
}

export interface Superhero {
  id:          number;
  name:        string;
  slug:        string;
  powerstats:  Powerstats;
  appearance:  Appearance;
  biography:   Biography;
  work:        Work;
  connections: Connections;
  images:      Images;
}

export type TeamId = string;

export interface Team {
  id:        TeamId;
  name:      string;
  memberIds: number[];
  createdAt: number;
  updatedAt: number;
}

export interface HeroesCache {
  version:     number;
  lastUpdated: number;
  heroes:      Superhero[];
}

export interface FavoritesState {
  ids:       number[];
  updatedAt: number;
}
