export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type SubmissionStatus = 'accepted' | 'rejected' | 'pending';

export interface Challenge {
  id?: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  track: string;
  points: number;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Submission {
  id?: string;
  user_id: string;
  challenge_id: string;
  solution: string;
  score: number;
  status: SubmissionStatus;
  submitted_at?: string;
}

export interface LeaderboardEntry {
  id?: string;
  user_id: string;
  challenge_id: string;
  score: number;
  rank?: number;
  updated_at?: string;
  user?: {
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
