import { z } from 'zod';

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const scheduleSchema = z.object({
  body: z.object({
    userId: z.string(),
    dayOfWeek: z.enum([
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ]),
    startTime: z.string().regex(timeRegex, 'Formato de hora inválido (HH:mm)'),
    endTime: z.string().regex(timeRegex, 'Formato de hora inválido (HH:mm)'),
    isWorkDay: z.boolean().default(true),
  }),
});

export const bulkScheduleSchema = z.object({
  body: z.object({
    userId: z.string(),
    schedules: z.array(z.object({
      dayOfWeek: z.enum([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ]),
      startTime: z.string().regex(timeRegex, 'Formato de hora inválido (HH:mm)'),
      endTime: z.string().regex(timeRegex, 'Formato de hora inválido (HH:mm)'),
      isWorkDay: z.boolean().default(true),
    })),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().cuid('ID de usuario inválido'),
  }),
});

export type ScheduleInput = z.infer<typeof scheduleSchema>['body'];
export type BulkScheduleInput = z.infer<typeof bulkScheduleSchema>['body'];
