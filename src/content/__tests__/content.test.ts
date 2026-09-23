import { describe, it, expect } from 'vitest';
import { now } from '../now';
import { builds } from '../builds';
import { offKeyboard } from '../off-keyboard';
import { offTheClock } from '../off-the-clock';
import { services } from '../services';
import { NowSchema, BuildSchema, OffKeyboardSchema, OffTheClockSchema, ServiceSchema } from '../schema';
import { z } from 'zod';

describe('content data', () => {
  it('now items match schema', () => {
    expect(() => z.array(NowSchema).parse(now)).not.toThrow();
    expect(now.length).toBeGreaterThanOrEqual(3);
  });

  it('builds match schema', () => {
    expect(() => z.array(BuildSchema).parse(builds)).not.toThrow();
    const slugs = builds.map(b => b.slug);
    expect(slugs).toEqual(['fair-roads', 'severance', 'rollcall', 'knock-it-off']);
  });

  it('every build carries a stack', () => {
    expect(builds.every(b => b.stack.length > 0)).toBe(true);
  });

  it('off-keyboard items match schema', () => {
    expect(() => z.array(OffKeyboardSchema).parse(offKeyboard)).not.toThrow();
    expect(offKeyboard.length).toBe(2);
  });

  it('off-the-clock items match schema', () => {
    expect(() => z.array(OffTheClockSchema).parse(offTheClock)).not.toThrow();
    expect(offTheClock.length).toBe(4);
  });

  it('service schema rejects too few and too many tags', () => {
    const base = {
      slug: 'ship', title: 'x', description: 'x',
      statValue: '4', statCaption: 'x', tags: ['a', 'b'],
    };
    expect(() => ServiceSchema.parse(base)).not.toThrow();
    expect(() => ServiceSchema.parse({ ...base, tags: ['a'] })).toThrow();
    expect(() => ServiceSchema.parse({ ...base, tags: ['a','b','c','d','e','f'] })).toThrow();
    expect(() => ServiceSchema.parse({ ...base, statCaption: '' })).toThrow();
  });

  it('services match schema', () => {
    expect(() => z.array(ServiceSchema).parse(services)).not.toThrow();
    expect(services.length).toBe(4);
    const slugs = services.map(s => s.slug);
    expect(slugs).toEqual(['ship', 'integrate', 'lead', 'enable']);
  });

  it('gusto metrics are attributed to teams, not to one person', () => {
    const gusto = services.filter(s => ['integrate', 'lead'].includes(s.slug));
    expect(gusto).toHaveLength(2);
    for (const s of gusto) {
      expect(s.statCaption).toContain('teams I led');
    }
  });

  it('the withdrawn production-error metric never ships', () => {
    const blob = JSON.stringify(services);
    expect(blob).not.toContain('92');
    expect(blob).not.toContain('production error');
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
      stack: ['DINOv2 ViT-S/14', 'UPerNet', 'ONNX'],
    };
    expect(() => BuildSchema.parse(entry)).not.toThrow();
  });

  it('statusLabel is optional', () => {
    const withoutLabel = {
      slug: 'severance', title: 'x', oneLine: 'x', description: 'x', dates: 'x',
      liveUrl: 'https://example.com', liveLabel: 'x', status: 'live',
      screenshot: 'x', gradientHeader: 'x', stack: ['x'],
    };
    expect(() => BuildSchema.parse(withoutLabel)).not.toThrow();
  });
});
