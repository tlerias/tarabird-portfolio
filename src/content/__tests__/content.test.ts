import { describe, it, expect } from 'vitest';
import { now } from '../now';
import { builds } from '../builds';
import { offKeyboard } from '../off-keyboard';
import { offTheClock } from '../off-the-clock';
import { NowSchema, BuildSchema, OffKeyboardSchema, OffTheClockSchema } from '../schema';
import { z } from 'zod';

describe('content data', () => {
  it('now items match schema', () => {
    expect(() => z.array(NowSchema).parse(now)).not.toThrow();
    expect(now.length).toBeGreaterThanOrEqual(3);
  });

  it('builds match schema', () => {
    expect(() => z.array(BuildSchema).parse(builds)).not.toThrow();
    expect(builds.length).toBe(3);
    const slugs = builds.map(b => b.slug);
    expect(slugs).toEqual(['severance', 'rollcall', 'knock-it-off']);
  });

  it('off-keyboard items match schema', () => {
    expect(() => z.array(OffKeyboardSchema).parse(offKeyboard)).not.toThrow();
    expect(offKeyboard.length).toBe(2);
  });

  it('off-the-clock items match schema', () => {
    expect(() => z.array(OffTheClockSchema).parse(offTheClock)).not.toThrow();
    expect(offTheClock.length).toBe(4);
  });

  it('build schema accepts the fair-roads shape', () => {
    const entry = {
      slug: 'fair-roads',
      title: 'fair-roads',
      oneLine: 'x',
      description: 'x',
      dates: 'Sept 2026 · proposal submitted',
      liveUrl: 'https://huggingface.co/tarabird90/dinov2s-roads',
      liveLabel: 'Model card ↗',
      status: 'wip',
      statusLabel: 'PROPOSAL SUBMITTED',
      screenshot: '/screenshots/fair-roads-fair-ui.jpg',
      gradientHeader: 'linear-gradient(135deg, #0d2820 0%, #5b4380 100%)',
    };
    expect(() => BuildSchema.parse(entry)).not.toThrow();
  });

  it('statusLabel is optional', () => {
    const withoutLabel = {
      slug: 'severance', title: 'x', oneLine: 'x', description: 'x', dates: 'x',
      liveUrl: 'https://example.com', liveLabel: 'x', status: 'live',
      screenshot: 'x', gradientHeader: 'x',
    };
    expect(() => BuildSchema.parse(withoutLabel)).not.toThrow();
  });
});
