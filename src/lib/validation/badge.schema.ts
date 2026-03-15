import { z } from "zod";

export const badgeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  min_points: z.number().min(0, "Minimum points must be at least 0"),
  icon_key: z.string().min(1, "Icon is required"),
});

export type BadgeSchema = z.infer<typeof badgeSchema>;
