import { z } from "zod";

export const competitionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  prize: z.string().min(1, "Prize description is required"),
  status: z.enum(["upcoming", "live", "completed", "draft"]),
  time_per_question: z.number().min(5, "Time per question must be at least 5 seconds"),
  scheduled_date: z.string().min(1, "Scheduled date is required"),
  questions: z.array(z.any()).min(1, "At least one question is required").optional(),
});

export type CompetitionSchema = z.infer<typeof competitionSchema>;
