import { z } from 'zod';

export const NowSchema = z.string().min(1);

export const BuildSchema = z.object({
  slug: z.enum(['fair-roads', 'severance', 'rollcall', 'knock-it-off']),
  title: z.string(),
  oneLine: z.string(),
  description: z.string(),
  dates: z.string(),
  liveUrl: z.string().url(),
  liveLabel: z.string(),
  status: z.enum(['live', 'kids', 'wip']),
  statusLabel: z.string().optional(),
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

export const ServiceSchema = z.object({
  slug: z.enum(['ship', 'integrate', 'lead', 'enable']),
  title: z.string().min(1),
  description: z.string().min(1),
  statValue: z.string().min(1),
  statCaption: z.string().min(1),
  tags: z.array(z.string().min(1)).min(2).max(5),
});
