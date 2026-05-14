import { describe, it, expect } from 'vitest';
import { createKonamiMatcher } from '../konami';

const FULL = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

describe('konami matcher', () => {
  it('returns true when the full sequence is pressed in order', () => {
    const matcher = createKonamiMatcher();
    let triggered = false;
    for (const key of FULL) {
      triggered = matcher(key);
    }
    expect(triggered).toBe(true);
  });

  it('resets when a wrong key is pressed', () => {
    const matcher = createKonamiMatcher();
    matcher('ArrowUp');
    matcher('ArrowDown'); // wrong — second should be ArrowUp
    // Should now start fresh: pressing the full sequence still works
    let triggered = false;
    for (const key of FULL) {
      triggered = matcher(key);
    }
    expect(triggered).toBe(true);
  });

  it('does not trigger on partial sequence', () => {
    const matcher = createKonamiMatcher();
    for (const key of FULL.slice(0, FULL.length - 1)) {
      expect(matcher(key)).toBe(false);
    }
  });
});
