import { z } from "zod";

export const challengeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  points: z.number().min(1, "Points must be at least 1"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]), // Match DB Enum
  duration: z.string().nullable().optional(),
  track: z.string().min(1, "Track name is required"),
  track_id: z.string().uuid("Invalid track ID").nullable().optional(),
  status: z.string().nullable().optional(),
  requirements: z.string().nullable().optional(),
});

export type ChallengeSchema = z.infer<typeof challengeSchema>;
