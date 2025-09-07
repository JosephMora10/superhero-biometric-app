export interface Team {
  id:        string;
  name:      string;
  memberIds: number[]; // References to Superhero.id
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
