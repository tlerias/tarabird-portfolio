import type { z } from 'zod';
import type { BuildSchema } from './schema';

type Build = z.infer<typeof BuildSchema>;

export const builds: Build[] = [
  {
    slug: 'severance',
    title: 'Layoff Calculator',
    oneLine: 'A free, source-cited tool that grades severance offers.',
    description: 'A free, source-cited tool that grades severance offers and estimates runway in sixty seconds.',
    dates: '2024 → ongoing',
    liveUrl: 'https://layoffcalculator.com',
    liveLabel: 'Visit ↗',
    status: 'live',
    screenshot: '/screenshots/severance-hero.png',
    gradientHeader: 'linear-gradient(135deg, #0d2820 0%, #1a4a3a 100%)',
  },
  {
    slug: 'rollcall',
    title: 'Rollcall',
    oneLine: 'A training log and community for jiu-jitsu practitioners.',
    description: 'A training log and community for jiu-jitsu practitioners. Tracks belts, drills, and the people you roll with.',
    dates: '2025 → ongoing',
    liveUrl: 'https://www.meetwithrollcall.com/u/tara',
    liveLabel: 'Visit ↗',
    status: 'live',
    screenshot: '/screenshots/rollcall-profile.png',
    gradientHeader: 'linear-gradient(135deg, #fef9f0 0%, #f3eef8 100%)',
  },
  {
    slug: 'knock-it-off',
    title: 'Knock It Off',
    oneLine: 'A tap-and-knock game where a cat shoves food off the counter.',
    description: 'A tap-and-knock game where a cat shoves food off the counter to a hungry dog. Built in Godot, mostly for my kids.',
    dates: '2025 · live',
    liveUrl: 'https://knock-it-off.vercel.app',
    liveLabel: 'Play ↗',
    status: 'kids',
    screenshot: '/screenshots/knock-it-off-cat-select.png',
    gradientHeader: 'linear-gradient(180deg, #8a6f5a 0%, #5b3a2a 100%)',
  },
];
