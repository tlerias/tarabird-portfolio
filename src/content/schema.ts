import { z } from 'zod';

export const NowSchema = z.string().min(1);

export const BuildSchema = z.object({
  slug: z.enum(['severance', 'rollcall', 'knock-it-off']),
  title: z.string(),
  oneLine: z.string(),
  description: z.string(),
  dates: z.string(),
  liveUrl: z.string().url(),
  liveLabel: z.string(),
  status: z.enum(['live', 'kids']),
  screenshot: z.string(),
  gradientHeader: z.string(),
});

export const OffKeyboardSchema = z.object({
  title: z.string(),
  meta: z.string(),
  description: z.string(),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).length(3),
  link: z.string().url().optional(),
});

export const OffTheClockSchema = z.object({
  title: z.string(),
  body: z.string(),
});
