import { z } from "zod";

export const trackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  long_description: z.string().min(20, "Long description must be at least 20 characters"),
  icon_key: z.string().min(1, "Icon is required"),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format"),
});

export type TrackSchema = z.infer<typeof trackSchema>;
