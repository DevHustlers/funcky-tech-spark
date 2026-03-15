import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location is required"),
  date: z.string().refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(val) >= today;
  }, "Date must be in the future or today"),
  time: z.string().min(1, "Time is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  type: z.enum(["hackathon", "workshop", "competition", "meetup", "online"]), // Allow 'online'
  event_link: z.string().url("Invalid URL format").optional().or(z.literal("")),
  status: z.string().optional().nullable(),
});

export type EventSchema = z.infer<typeof eventSchema>;
