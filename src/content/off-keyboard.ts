import type { z } from 'zod';
import type { OffKeyboardSchema } from './schema';

type OffKeyboard = z.infer<typeof OffKeyboardSchema>;

export const offKeyboard: OffKeyboard[] = [
  {
    title: 'Heart & Hammer',
    meta: '501(c)(3) · 2012 → today',
    description: 'A nonprofit my family started for community partnerships and humanitarian giving across NY, NJ, FL, and the Philippines.',
    stats: [
      { value: '5,000+', label: 'care packages' },
      { value: '13 yrs', label: 'continuous' },
      { value: '4', label: 'regions served' },
    ],
    link: 'https://heartandhammer.org',
  },
  {
    title: 'Kinetic Minds',
    meta: 'kid-coding pilot · 2024 → 2025',
    description: 'A creative-coding program for 3rd–5th graders in Montclair. Started with a community fundraiser.',
    stats: [
      { value: '$3,750', label: 'seed raised' },
      { value: '30%', label: 'sponsored seats' },
      { value: '6 mo', label: 'ran' },
    ],
    link: 'https://www.kineticmindscreative.com',
  },
];
