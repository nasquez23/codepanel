export interface PodiumEntry {
  rank: number;
  user: {
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };
  points: number;
  problems: number;
  streak: number;
}
