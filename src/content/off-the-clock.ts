import type { z } from 'zod';
import type { OffTheClockSchema } from './schema';

type Item = z.infer<typeof OffTheClockSchema>;

export const offTheClock: Item[] = [
  { title: 'Jiu-jitsu.', body: 'White belt, a year in. I eat my own dog food by tracking every roll on Rollcall.' },
  { title: 'Gardening.', body: 'Slowly turning the yard into something the kids can dig in.' },
  { title: 'Caterpillar habitats.', body: 'Backyard butterfly releases with the three short people I share a roof with.' },
  { title: 'Snowboarding & hiking.', body: 'CU Boulder ruined me forever (in a good way).' },
];
