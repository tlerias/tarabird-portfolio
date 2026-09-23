import type { z } from 'zod';
import type { ServiceSchema } from './schema';

type Service = z.infer<typeof ServiceSchema>;

export const services: Service[] = [
  {
    slug: 'ship',
    title: 'Ship the whole product, model included.',
    description: 'Idea to shipped thing, solo. Design, build, deploy, the unglamorous parts after launch — and when the product is a model, train, evaluate and export that too.',
    statValue: '4',
    statCaption: 'products shipped, built alone',
    tags: ['Next.js', 'Supabase', 'PyTorch', 'ONNX', 'Godot'],
  },
  {
    slug: 'integrate',
    title: 'Make systems talk.',
    description: 'Partner APIs, accounting platforms, sync pipelines that fail quietly until someone makes them stop.',
    statValue: '15% → 7%',
    statCaption: 'sync errors · teams I led',
    tags: ['QuickBooks', 'Xero', 'Sage Intacct'],
  },
  {
    slug: 'lead',
    title: 'Run the engineering team.',
    description: 'Fractional tech leadership. On-call rotations, ops reviews, calibration — the infrastructure that makes leadership scale.',
    statValue: '20 days → 9',
    statCaption: 'time-to-resolve · teams I led',
    tags: ['2 teams', '5 engineers'],
  },
  {
    slug: 'enable',
    title: 'Get a team productive with new tools.',
    description: 'AI tooling adoption, workshops, and teaching people who have never written a line of code.',
    statValue: '58%',
    statCaption: 'PR throughput · 2-team sprint, DX-confirmed',
    tags: ['AI tooling', 'Workshops', 'AI certificate'],
  },
];
