import { z } from 'zod';

export const attendanceNoteSchema = z.object({
  body: z.object({
    notes: z.string().optional(),
    location: z.string().optional(),
  }),
});

export type AttendanceNoteInput = z.infer<typeof attendanceNoteSchema>['body'];
